export type Language = 'en' | 'ru' | 'he';

export const translations = {
  en: {
    // Navigation
    catalog: "Catalog",
    vapes: "Vapes", 
    tobacco: "Tobacco",
    accessories: "Accessories",
    cart: "Cart",
    
    // Home page
    heroTitle: "Premium Vape Experience",
    heroSubtitle: "Discover the finest selection of vaping products and tobacco in Israel. Cash payment on delivery.",
    shopNow: "Shop Now",
    contactManager: "Contact Manager",
    shopByCategory: "Shop by Category",
    featuredProducts: "Featured Products",
    viewAll: "View All",
    
    // Product
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    
    // Cart
    shoppingCart: "Shopping Cart",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    cashPayment: "Cash payment on delivery",
    proceedToCheckout: "Proceed to Checkout",
    
    // Checkout
    checkout: "Checkout",
    deliveryInfo: "Delivery Information",
    firstName: "First Name",
    lastName: "Last Name", 
    phone: "Phone Number",
    city: "City/District",
    address: "Full Address",
    notes: "Additional Notes",
    terms: "I agree to the terms and conditions",
    placeOrder: "Place Order",
    
    // Admin
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    customers: "Customers",
    settings: "Settings",
    totalOrders: "Total Orders",
    revenue: "Revenue",
    pendingOrders: "Pending Orders",
    
    // Categories
    electronicVapes: "Electronic Vapes",
    premiumTobacco: "Premium Tobacco",
    vapeAccessories: "Accessories",
    
    // Footer
    cashPaymentOnly: "Cash payment on delivery",
    israelDelivery: "Israel Delivery",
    allRightsReserved: "All rights reserved. 18+ only.",
  },
  ru: {
    // Navigation
    catalog: "Каталог",
    vapes: "Вейпы",
    tobacco: "Табак", 
    accessories: "Аксессуары",
    cart: "Корзина",
    
    // Home page
    heroTitle: "Премиум Вейп Опыт",
    heroSubtitle: "Откройте для себя лучший выбор вейп продуктов и табака в Израиле. Оплата наличными при доставке.",
    shopNow: "В магазин",
    contactManager: "Связаться с менеджером",
    shopByCategory: "Покупки по категориям",
    featuredProducts: "Рекомендуемые товары",
    viewAll: "Посмотреть все",
    
    // Product
    addToCart: "В корзину",
    outOfStock: "Нет в наличии",
    
    // Cart
    shoppingCart: "Корзина покупок",
    subtotal: "Промежуточный итог",
    delivery: "Доставка",
    total: "Итого",
    cashPayment: "Оплата наличными при доставке",
    proceedToCheckout: "Оформить заказ",
    
    // Checkout
    checkout: "Оформление заказа",
    deliveryInfo: "Информация о доставке",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Номер телефона", 
    city: "Город/Район",
    address: "Полный адрес",
    notes: "Дополнительные заметки",
    terms: "Я согласен с условиями",
    placeOrder: "Разместить заказ",
    
    // Admin
    dashboard: "Панель управления",
    orders: "Заказы",
    products: "Товары", 
    customers: "Клиенты",
    settings: "Настройки",
    totalOrders: "Всего заказов",
    revenue: "Доход",
    pendingOrders: "Заказы в ожидании",
    
    // Categories
    electronicVapes: "Электронные вейпы",
    premiumTobacco: "Премиум табак",
    vapeAccessories: "Аксессуары",
    
    // Footer
    cashPaymentOnly: "Оплата только наличными при доставке",
    israelDelivery: "Доставка по Израилю",
    allRightsReserved: "Все права защищены. Только 18+.",
  },
  he: {
    // Navigation
    catalog: "קטלוג",
    vapes: "וייפים",
    tobacco: "טבק",
    accessories: "אביזרים", 
    cart: "עגלה",
    
    // Home page
    heroTitle: "חוויית וייפ פרימיום",
    heroSubtitle: "גלה את המבחר הטוב ביותר של מוצרי וייפ וטבק בישראל. תשלום במזומן בעת המסירה.",
    shopNow: "קנה עכשיו",
    contactManager: "צור קשר עם מנהל",
    shopByCategory: "קניות לפי קטגוריה",
    featuredProducts: "מוצרים מומלצים",
    viewAll: "צפה בהכל",
    
    // Product
    addToCart: "הוסף לעגלה",
    outOfStock: "אזל מהמלאי",
    
    // Cart
    shoppingCart: "עגלת קניות",
    subtotal: "סכום ביניים",
    delivery: "משלוח",
    total: "סך הכל",
    cashPayment: "תשלום במזומן בעת המסירה",
    proceedToCheckout: "המשך לתשלום",
    
    // Checkout
    checkout: "תשלום",
    deliveryInfo: "פרטי משלוח",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    phone: "מספר טלפון",
    city: "עיר/אזור", 
    address: "כתובת מלאה",
    notes: "הערות נוספות",
    terms: "אני מסכים לתנאים וההגבלות",
    placeOrder: "בצע הזמנה",
    
    // Admin
    dashboard: "לוח בקרה",
    orders: "הזמנות",
    products: "מוצרים",
    customers: "לקוחות",
    settings: "הגדרות", 
    totalOrders: "סך הזמנות",
    revenue: "הכנסות",
    pendingOrders: "הזמנות ממתינות",
    
    // Categories
    electronicVapes: "וייפים אלקטרוניים",
    premiumTobacco: "טבק פרימיום",
    vapeAccessories: "אביזרים",
    
    // Footer
    cashPaymentOnly: "תשלום במזומן בלבד בעת המסירה",
    israelDelivery: "משלוח בישראל",
    allRightsReserved: "כל הזכויות שמורות. גיל 18+ בלבד.",
  },
};

export function useTranslation(language: Language = 'en') {
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  return { t };
}
