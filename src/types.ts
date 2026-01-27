export interface OrderItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    category?: string;
}

export interface PaidOrder {
    id: string;
    items: OrderItem[];
    total: number;
    timestamp: number;
}

export type TableStatus = "EMPTY" | "ORDERED" | "PREPARING" | "SERVED" | "PAID";

export interface Table {
    status: TableStatus;
    items: OrderItem[];
    notes: string;
    amount: number;
    startedAt: number | null; // Timestamp
    lastPaid: number | null;
    paidOrders: PaidOrder[];
}

export interface Shop {
    name: string;
    totalTables: number;
}

export interface UIState {
    activeModal: null | "ORDER";
    notifications: string[]; // For now just strings
    selectedTableId: null | string;
}

export interface AppState {
    shop: Shop;
    tables: Record<string, Table>;
    ui: UIState;
}

export type Action =
    | { type: "INIT_STATE"; payload: AppState }
    | { type: "SELECT_TABLE"; payload: string }
    | { type: "CLOSE_MODAL" }
    | { type: "UPDATE_TABLE_STATUS"; payload: { tableId: string; status: TableStatus } }
    | { type: "ADD_ITEM"; payload: { tableId: string; item: OrderItem } }
    | { type: "REMOVE_ITEM"; payload: { tableId: string; itemId: string } }
    | { type: "UPDATE_ITEM_QTY"; payload: { tableId: string; itemId: string; qty: number } }
    | { type: "CLEAR_TABLE"; payload: string }
    | { type: "ADD_NOTIFICATION"; payload: string }
    | { type: "DISMISS_NOTIFICATION" };
