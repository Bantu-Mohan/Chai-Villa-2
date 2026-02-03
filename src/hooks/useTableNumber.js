import { useMemo } from 'react';

// Custom hook for parsing table number from URL
export function useTableNumber() {
    const tableNumber = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const table = params.get('table');

        // Validate and return table number, default to 1
        if (table && /^\d+$/.test(table)) {
            return parseInt(table, 10);
        }
        return 1;
    }, []);

    return tableNumber;
}

export default useTableNumber;
