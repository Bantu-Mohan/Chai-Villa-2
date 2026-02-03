import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { playNotificationSound } from '../utils/sound';

const formatOrder = (dbOrder) => ({
    id: dbOrder.id,
    tableId: dbOrder.table_id,
    token: `T${dbOrder.table_id}-${dbOrder.id}`,
    items: dbOrder.items || [],
    status: dbOrder.status,
    total: dbOrder.total,
    timestamp: new Date(dbOrder.created_at).getTime(),
    paidAt: dbOrder.paid_at ? new Date(dbOrder.paid_at).getTime() : null
});

export default function useAdminData() {
    const [orders, setOrders] = useState([]);
    const [paidOrders, setPaidOrders] = useState([]);
    const [tableCount, setTableCount] = useState(() => {
        const saved = localStorage.getItem('tableCount');
        return saved ? parseInt(saved, 10) : 5;
    });
    const [stats, setStats] = useState({ sales: 0, count: 0, avg: 0 });

    useEffect(() => {
        // Calculate Business Day Start (2 AM)
        const getBusinessDayStart = () => {
            const now = new Date();
            const start = new Date(now);
            if (now.getHours() < 2) {
                start.setDate(now.getDate() - 1);
            }
            start.setHours(2, 0, 0, 0);
            return start.toISOString();
        };

        const startTime = getBusinessDayStart();

        // FETCH INITIAL
        const fetchOrders = async () => {
            // Fetch ACTIVE (created after business day start)
            const { data: activeData } = await supabase
                .from('orders')
                .select('*')
                .neq('status', 'archived')
                .neq('status', 'cancelled')
                .gte('created_at', startTime) // Filter by business day
                .order('created_at', { ascending: false });

            if (activeData) setOrders(activeData.map(formatOrder));

            // Fetch HISTORY (Paid/Archived) - current business day only
            const { data: historyData } = await supabase
                .from('orders')
                .select('*')
                .in('status', ['paid', 'archived'])
                .gte('created_at', startTime) // Filter by business day
                .order('created_at', { ascending: false })
                .limit(200);

            if (historyData) setPaidOrders(historyData.map(formatOrder));
        };

        fetchOrders();

        // SUBSCRIBE TO CHANGES - Real-time updates for All Orders view
        const channel = supabase
            .channel('admin_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                const { new: newRecord, eventType } = payload;
                if (!newRecord) return;

                // PLAY SOUND ON NEW ORDER
                if (eventType === 'INSERT') {
                    playNotificationSound();
                }

                const formatted = formatOrder(newRecord);
                const isArchived = formatted.status === 'archived';
                const isCancelled = formatted.status === 'cancelled';
                const isPaid = formatted.status === 'paid';
                const isActive = !isArchived && !isCancelled;

                // Update Active Orders (for Table view)
                setOrders(prev => {
                    const exists = prev.find(o => o.id === formatted.id);
                    if (isActive) {
                        // Add or update in active orders
                        return exists
                            ? prev.map(o => o.id === formatted.id ? formatted : o)
                            : [formatted, ...prev];
                    } else {
                        // Remove from active orders
                        return prev.filter(o => o.id !== formatted.id);
                    }
                });

                // Update Paid/History Orders (for All Orders view)
                setPaidOrders(prev => {
                    const exists = prev.find(o => o.id === formatted.id);
                    if (isPaid || isArchived) {
                        // Add or update in history
                        return exists
                            ? prev.map(o => o.id === formatted.id ? formatted : o)
                            : [formatted, ...prev];
                    } else if (isCancelled) {
                        // Remove cancelled orders from history
                        return prev.filter(o => o.id !== formatted.id);
                    }
                    return prev;
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // STATS - Only count PAID orders
    useEffect(() => {
        // Only count orders that have been paid (status 'paid' or 'archived' with paid_at)
        const paidFromActive = orders.filter(o => o.status === 'paid');
        const allPaidOrders = [...paidFromActive, ...paidOrders];

        // Remove duplicates by id
        const uniquePaid = allPaidOrders.filter((order, index, self) =>
            index === self.findIndex(o => o.id === order.id)
        );

        const totalSales = uniquePaid.reduce((sum, o) => sum + (o.total || 0), 0);
        setStats({
            sales: totalSales,
            count: uniquePaid.length,
            avg: uniquePaid.length > 0 ? Math.round(totalSales / uniquePaid.length) : 0
        });
    }, [orders, paidOrders]);

    // Persist table count
    useEffect(() => {
        localStorage.setItem('tableCount', tableCount.toString());
    }, [tableCount]);

    // ACTIONS
    const advanceStatus = async (id, specificStatus) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        let nextStatus = specificStatus || 'next';
        if (nextStatus === 'next') {
            const flow = { 'new': 'preparing', 'preparing': 'served', 'served': 'paid', 'paid': 'archived' };
            nextStatus = flow[order.status] || order.status;
        }
        await supabase.from('orders').update({ status: nextStatus, paid_at: nextStatus === 'paid' ? new Date().toISOString() : null }).eq('id', id);
    };

    const cancelOrder = async (id) => await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);

    const clearTableHistory = (tableId) => {
        // Clear paid orders for a specific table from local state
        setPaidOrders(prev => prev.filter(o => o.tableId !== tableId));
    };

    const clearOrder = async (id) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            clearTableHistory(order.tableId); // Clear last bills for this table
        }
        await supabase.from('orders').update({ status: 'archived' }).eq('id', id);
    };

    const addManualOrder = async (tableId, items) => {
        // Logic: if Active -> Update(Merge). If Paid -> Archive & New. Else -> New.
        // Needs a quick fetch to be safe or rely on local.
        // Relying on local 'orders' state is acceptable for UI responsiveness.

        const existing = orders.find(o => o.tableId === tableId && o.status !== 'archived' && o.status !== 'cancelled');

        if (existing && existing.status !== 'paid') {
            // MERGE
            const aggregatedItems = [...existing.items];
            items.forEach(newItem => {
                const matchIndex = aggregatedItems.findIndex(i => i.name === newItem.name);
                if (matchIndex >= 0) {
                    aggregatedItems[matchIndex].qty += newItem.qty;
                } else {
                    aggregatedItems.push({ name: newItem.name, qty: newItem.qty, price: newItem.price });
                }
            });
            const newTotal = aggregatedItems.reduce((sum, i) => sum + (i.price * i.qty), 0);

            await supabase.from('orders').update({ items: aggregatedItems, total: newTotal, status: 'served' }).eq('id', existing.id);

        } else if (existing && existing.status === 'paid') {
            // ARCHIVE OLD & NEW
            await supabase.from('orders').update({ status: 'archived' }).eq('id', existing.id);
            const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
            await supabase.from('orders').insert([{ table_id: tableId, items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total, status: 'new' }]);
        } else {
            // NEW
            const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
            await supabase.from('orders').insert([{ table_id: tableId, items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total, status: 'new' }]);
        }
    };

    // Table helpers
    const addTable = () => setTableCount(c => c + 1);
    const removeTable = () => setTableCount(c => Math.max(1, c - 1));
    const getTableStatus = (tableId) => {
        const tableOrders = orders.filter(o => o.tableId === tableId && o.status !== 'archived' && o.status !== 'cancelled');
        if (tableOrders.length === 0) return 'empty';
        if (tableOrders.some(o => o.status === 'paid')) return 'paid';
        if (tableOrders.some(o => o.status === 'served')) return 'served';
        if (tableOrders.some(o => o.status === 'preparing')) return 'preparing';
        return 'occupied';
    };

    return { orders, paidOrders, tableCount, tables: Array.from({ length: tableCount }, (_, i) => i + 1), stats, updateStatus: advanceStatus, cancelOrder, clearOrder, addTable, removeTable, getTableStatus, addManualOrder };
}
