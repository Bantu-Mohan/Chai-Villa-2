export const MENU_CATEGORIES = ["Milk Tea", "Coffee", "Special Tea", "Milk Items", "Snacks"] as const;
export type MenuCategory = typeof MENU_CATEGORIES[number];

export const MENU_ITEMS = [
    // Milk Tea
    { id: 'mt1', name: 'Chai Villa Chai', price: 10, category: 'Milk Tea' },
    { id: 'mt2', name: 'Matka Cup Chai', price: 15, category: 'Milk Tea' },
    { id: 'mt3', name: 'Elachi Chai', price: 15, category: 'Milk Tea' },
    { id: 'mt4', name: 'Masala Tea', price: 15, category: 'Milk Tea' },
    { id: 'mt5', name: 'Ginger Tea', price: 15, category: 'Milk Tea' },
    { id: 'mt6', name: 'Badam Tea', price: 15, category: 'Milk Tea' },
    { id: 'mt7', name: 'Tea Parcel', price: 15, category: 'Milk Tea' },

    // Coffee
    { id: 'c1', name: 'Coffee', price: 15, category: 'Coffee' },
    { id: 'c2', name: 'Black Coffee', price: 15, category: 'Coffee' },
    { id: 'c3', name: 'Dark Chocolate', price: 15, category: 'Coffee' },
    { id: 'c4', name: 'Horlicks', price: 15, category: 'Coffee' },
    { id: 'c5', name: 'Coffee Parcel', price: 20, category: 'Coffee' },

    // Special Tea (Black/Lemon/Green)
    { id: 'st1', name: 'Black Tea', price: 15, category: 'Special Tea' },
    { id: 'st2', name: 'Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st3', name: 'Ginger Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st4', name: 'Green Tea', price: 15, category: 'Special Tea' },
    { id: 'st5', name: 'Pink Guava Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st6', name: 'Mango Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st7', name: 'Pina Colada Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st8', name: 'Grenadine Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st9', name: 'Blueberry Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st10', name: 'Green Apple Lemon Tea', price: 15, category: 'Special Tea' },
    { id: 'st11', name: 'Blue Curacao Lemon Tea', price: 15, category: 'Special Tea' },

    // Milk Items
    { id: 'mi1', name: 'Masala Milk', price: 15, category: 'Milk Items' },
    { id: 'mi2', name: 'Ragi Malt Drink Mix', price: 15, category: 'Milk Items' },
    { id: 'mi3', name: 'Rose Drink Mix', price: 15, category: 'Milk Items' },
    { id: 'mi4', name: 'Chocolate Drink', price: 15, category: 'Milk Items' },
    { id: 'mi5', name: 'Badam Drink Mix', price: 15, category: 'Milk Items' },
    { id: 'mi6', name: 'Pista Badam Drink Mix', price: 15, category: 'Milk Items' },

    // Snacks
    { id: 's1', name: 'Biscuit (4 pcs)', price: 10, category: 'Snacks' },
    { id: 's2', name: 'Onion Samosa (6 pcs)', price: 20, category: 'Snacks' },
    { id: 's3', name: 'Alu Samosa (1 pc)', price: 15, category: 'Snacks' },
    { id: 's4', name: 'Sweet Corn Samosa (5 pcs)', price: 20, category: 'Snacks' },
    { id: 's5', name: 'Egg Samosa (4 pcs)', price: 20, category: 'Snacks' },
    { id: 's6', name: 'Chicken Samosa (3 pcs)', price: 20, category: 'Snacks' },
] as const;
