import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateOrdersPDF = (orders, totals) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text('Tea Shop Orders Report', 14, 20);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        // Summary
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 32, 196, 32);

        doc.setFontSize(12);
        doc.text('Summary', 14, 40);
        doc.setFontSize(10);
        doc.text(`Total Paid Orders: ${totals.count}`, 14, 48);
        doc.text(`Total Revenue: ₹${totals.revenue.toLocaleString()}`, 80, 48);

        // Table Data
        const tableColumn = ["Table", "Time", "Status", "Items", "Total"];
        const tableRows = [];

        orders.forEach(order => {
            const orderTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const itemsStr = order.items.map(item => `${item.qty}x ${item.name}`).join(', ');
            const orderData = [
                `Table ${order.tableId}`,
                orderTime,
                order.status.toUpperCase(),
                itemsStr,
                `₹${order.total}`
            ];
            tableRows.push(orderData);
        });

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'grid',
            headStyles: { fillColor: [47, 111, 94] }, // Primary green color
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 25 },
                2: { cellWidth: 25 },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 25, halign: 'right' }
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
        }

        // Save
        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`TeaShop_Orders_${dateStr}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert(`Failed to generate PDF: ${error.message}`);
    }
};
