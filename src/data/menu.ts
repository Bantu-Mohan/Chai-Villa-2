export const MENU_CATEGORIES = ["Milk Tea", "Coffee", "Special Tea", "Milk Items", "Snacks"] as const;
export type MenuCategory = typeof MENU_CATEGORIES[number];

export const MENU_ITEMS = [
    // Milk Tea
    { id: 'mt1', name: 'Chai Villa Chai', price: 10, category: 'Milk Tea', image: '/images/menu/mt1.png' },
    { id: 'mt2', name: 'Matka Cup Chai', price: 15, category: 'Milk Tea', image: '/images/menu/mt2.png' },
    { id: 'mt3', name: 'Elachi Chai', price: 15, category: 'Milk Tea', image: '/images/menu/mt3.png' },
    { id: 'mt4', name: 'Masala Tea', price: 15, category: 'Milk Tea', image: '/images/menu/mt4.png' },
    { id: 'mt5', name: 'Ginger Tea', price: 15, category: 'Milk Tea', image: '/images/menu/mt5.png' },
    { id: 'mt6', name: 'Badam Tea', price: 15, category: 'Milk Tea', image: '/images/menu/mt6.png' },
    { id: 'mt7', name: 'Tea Parcel', price: 15, category: 'Milk Tea', image: '/images/menu/mt7.png' },

    // Coffee
    { id: 'c1', name: 'Coffee', price: 15, category: 'Coffee', image: '/images/menu/c1.png' },
    { id: 'c2', name: 'Black Coffee', price: 15, category: 'Coffee', image: '/images/menu/c2.png' },
    { id: 'c3', name: 'Dark Chocolate', price: 15, category: 'Coffee', image: '/images/menu/c3.png' },
    { id: 'c4', name: 'Horlicks', price: 15, category: 'Coffee', image: '/images/menu/c1.png' },
    { id: 'c5', name: 'Coffee Parcel', price: 20, category: 'Coffee', image: '/images/menu/c5.png' },

    // Special Tea (Black/Lemon/Green)
    { id: 'st1', name: 'Black Tea', price: 15, category: 'Special Tea', image: '/images/menu/st1.png' },
    { id: 'st2', name: 'Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st3', name: 'Ginger Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st3.png' },
    { id: 'st4', name: 'Green Tea', price: 15, category: 'Special Tea', image: '/images/menu/st4.png' },
    { id: 'st5', name: 'Pink Guava Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st6', name: 'Mango Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st7', name: 'Pina Colada Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st8', name: 'Grenadine Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st9', name: 'Blueberry Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st10', name: 'Green Apple Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },
    { id: 'st11', name: 'Blue Curacao Lemon Tea', price: 15, category: 'Special Tea', image: '/images/menu/st2.png' },

    // Milk Items
    { id: 'mi1', name: 'Masala Milk', price: 15, category: 'Milk Items', image: '/images/menu/mt6.png' },
    { id: 'mi2', name: 'Ragi Malt Drink Mix', price: 15, category: 'Milk Items', image: '/images/menu/mt6.png' },
    { id: 'mi3', name: 'Rose Drink Mix', price: 15, category: 'Milk Items', image: '/images/menu/mt6.png' },
    { id: 'mi4', name: 'Chocolate Drink', price: 15, category: 'Milk Items', image: '/images/menu/c3.png' },
    { id: 'mi5', name: 'Badam Drink Mix', price: 15, category: 'Milk Items', image: '/images/menu/mt6.png' },
    { id: 'mi6', name: 'Pista Badam Drink Mix', price: 15, category: 'Milk Items', image: '/images/menu/mt6.png' },

    // Snacks
    { id: 's1', name: 'Biscuit (4 pcs)', price: 10, category: 'Snacks', image: '/images/menu/mt1.png' },
    { id: 's2', name: 'Onion Samosa (6 pcs)', price: 20, category: 'Snacks', image: '/images/menu/mt1.png' },
    { id: 's3', name: 'Alu Samosa (1 pc)', price: 15, category: 'Snacks', image: '/images/menu/mt1.png' },
    { id: 's4', name: 'Sweet Corn Samosa (5 pcs)', price: 20, category: 'Snacks', image: '/images/menu/mt1.png' },
    { id: 's5', name: 'Egg Samosa (4 pcs)', price: 20, category: 'Snacks', image: '/images/menu/mt1.png' },
    { id: 's6', name: 'Chicken Samosa (3 pcs)', price: 20, category: 'Snacks', image: '/images/menu/mt1.png' },
] as const;
