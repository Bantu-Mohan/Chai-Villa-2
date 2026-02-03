import React from 'react';
import './TableStatusStrip.css';

function TableStatusStrip({ tables, getTableStatus, onAdd, onRemove }) {

    // Check if the last table (highest ID) is safe to remove
    const lastTableId = tables[tables.length - 1];
    const lastTableStatus = getTableStatus(lastTableId);
    // Can remove if it exists and is 'empty'
    const canRemove = lastTableId && lastTableStatus === 'empty';

    return (
        <div className="table-controls-bar">
            {/* Left side spacer or title if needed? User said "Do NOT replace..." */}
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '8px' }}>
                Table Management
            </span>

            <div className="table-controls-group">
                <button
                    className="control-btn remove"
                    onClick={onRemove}
                    disabled={!canRemove}
                    title={!canRemove ? "Cannot remove table with active orders" : "Remove Last Table"}
                >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>−</span>
                    <span className="btn-label">Remove Table</span>
                </button>

                <button
                    className="control-btn add"
                    onClick={onAdd}
                    title="Add New Table"
                >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
                    <span className="btn-label">Add Table</span>
                </button>
            </div>
        </div>
    );
}

export default TableStatusStrip;
