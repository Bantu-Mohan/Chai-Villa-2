import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTableStatus(tableId) {
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tableId) return;

        const checkStatus = async () => {
            // Find any order for this table that is NOT archived and NOT cancelled.
            // AND also check if it is PAID. 
            // Logic: 
            // - If New/Preparing/Served -> BLOCK (activeOrder = object)
            // - If Paid -> ALLOW (activeOrder = null, effectively) - wait, if paid, we treat it as empty for customer?
            // User said "until paid ... unable to order". So Paid = Unlocked.

            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('table_id', tableId)
                .neq('status', 'archived')
                .neq('status', 'cancelled')
                .neq('status', 'paid') // Explicitly exclude PAID to treat it as "unlocked"
                .limit(1);

            if (data && data.length > 0) {
                setActiveOrder(data[0]);
            } else {
                setActiveOrder(null);
            }
            setLoading(false);
        };

        checkStatus();

        // Real-time tracking for THIS table
        const channel = supabase
            .channel(`table-${tableId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `table_id=eq.${tableId}` }, (payload) => {
                const { new: newRecord } = payload;
                if (!newRecord) {
                    // Deleted? Unlock
                    setActiveOrder(null);
                    return;
                }

                // Check if the update makes it blocking or non-blocking
                const isBlocking = ['new', 'preparing', 'served'].includes(newRecord.status);

                if (isBlocking) {
                    setActiveOrder(newRecord);
                } else {
                    setActiveOrder(null);
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [tableId]);

    return { activeOrder, loading };
}
