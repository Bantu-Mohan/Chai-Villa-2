import React from 'react';
import { useApp } from '../../store/AppContext';
import TableCard from '../TableCard/TableCard';
import styles from './TableGrid.module.css';

const TableGrid: React.FC = () => {
    const { state } = useApp();
    const tableIds = Object.keys(state.tables).sort((a, b) => {
        const tableA = state.tables[a];
        const tableB = state.tables[b];

        // If both have startedAt (Active/Paid/Served), sort by time (Ascending: Oldest first)
        if (tableA.startedAt && tableB.startedAt) {
            return tableA.startedAt - tableB.startedAt;
        }

        // If A is active but B is not, A comes first
        if (tableA.startedAt && !tableB.startedAt) return -1;

        // If B is active but A is not, B comes first
        if (!tableA.startedAt && tableB.startedAt) return 1;

        // If both are empty, sort by ID (numeric)
        return parseInt(a) - parseInt(b);
    });

    return (
        <div className={styles.grid}>
            {tableIds.map(id => (
                <TableCard key={id} id={id} table={state.tables[id]} />
            ))}
        </div>
    );
};

export default TableGrid;
