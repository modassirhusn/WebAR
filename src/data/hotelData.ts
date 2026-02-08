import { FOOD_DATA, FoodItem } from './foodData';

export interface Hotel {
    id: string;
    name: string;
    description: string;
    dishes: FoodItem[];
}

// Helper to find foods by ID
const getFoods = (ids: string[]): FoodItem[] => {
    return ids.map(id => FOOD_DATA.find(f => f.id === id)).filter((f): f is FoodItem => f !== undefined);
};

export const HOTELS: Record<string, Hotel> = {
    // 1. Shubham Bhai's Hotel
    'shubham-bhais-hotel': {
        id: 'shubham-bhais-hotel',
        name: "Shubham Bhai's Hotel",
        description: "Authentic North Indian & Desserts",
        dishes: getFoods(['butter-chicken', 'paneer-tikka', 'dal-makhani', 'gulab-jamun', 'rasmalai'])
    },
    // 2. Sourav Bhai's Hotel
    'sourav-bhais-hotel': {
        id: 'sourav-bhais-hotel',
        name: "Sourav Bhai's Hotel",
        description: "Spicy Chinese & Fast Food",
        dishes: getFoods(['masala-dosa', 'idli-sambar', 'hakka-noodles', 'chilli-paneer'])
    },
    // 3. Grand Plaza (Sample)
    'grand-plaza': {
        id: 'grand-plaza',
        name: "Grand Plaza Hotel",
        description: "Exquisite Fine Dining & World Class Service",
        dishes: getFoods(['butter-chicken', 'dal-makhani', 'shahi-paneer', 'tandoori-chicken', 'gulab-jamun'])
    },
    // 4. Seaside Bistro (Sample)
    'seaside-bistro': {
        id: 'seaside-bistro',
        name: "Seaside Bistro",
        description: "Fresh Flavors & Ocean Views",
        dishes: getFoods(['masala-dosa', 'idli-sambar', 'hakka-noodles', 'chilli-paneer', 'rasmalai'])
    }
};

export const getHotelById = (id: string): Hotel | undefined => {
    return HOTELS[id];
};
