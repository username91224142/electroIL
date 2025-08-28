import { 
  users, categories, products, orders, orderItems,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Product methods
  getProducts(filters?: { categoryId?: string; search?: string; limit?: number; offset?: number }): Promise<ProductWithCategory[]>;
  getProduct(id: string): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getFeaturedProducts(limit?: number): Promise<ProductWithCategory[]>;

  // Order methods
  getOrders(limit?: number, offset?: number): Promise<OrderWithItems[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  markTelegramSent(id: string): Promise<void>;

  // Stats methods
  getOrderStats(): Promise<{ total: number; pending: number; revenue: string }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Product methods
  async getProducts(filters: { categoryId?: string; search?: string; limit?: number; offset?: number } = {}): Promise<ProductWithCategory[]> {
    const { categoryId, search, limit = 50, offset = 0 } = filters;
    
    let whereConditions = [eq(products.isActive, true)];
    
    if (categoryId) {
      whereConditions.push(eq(products.categoryId, categoryId));
    }

    if (search) {
      whereConditions.push(ilike(products.name, `%${search}%`));
    }

    let query = db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0]);

    const result = await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(row => ({
      ...row.products,
      category: row.categories,
    }));
  }

  async getProduct(id: string): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!result) return undefined;

    return {
      ...result.products,
      category: result.categories,
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ isActive: false })
      .where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getFeaturedProducts(limit = 4): Promise<ProductWithCategory[]> {
    const result = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.products,
      category: row.categories,
    }));
  }

  // Order methods
  async getOrders(limit = 50, offset = 0): Promise<OrderWithItems[]> {
    const ordersData = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map(item => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items: items.map(item => ({
        ...item.order_items,
        product: item.products!,
      })),
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));

    const createdItems = await db
      .insert(orderItems)
      .values(orderItemsWithOrderId)
      .returning();

    const itemsWithProducts = await Promise.all(
      createdItems.map(async (item) => {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId!));
        return {
          ...item,
          product: product!,
        };
      })
    );

    return {
      ...newOrder,
      items: itemsWithProducts,
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async markTelegramSent(id: string): Promise<void> {
    await db
      .update(orders)
      .set({ telegramSent: true })
      .where(eq(orders.id, id));
  }

  async getOrderStats(): Promise<{ total: number; pending: number; revenue: string }> {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const [pendingResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    const [revenueResult] = await db
      .select({ sum: sql<string>`sum(${orders.totalAmount})` })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    return {
      total: totalResult.count,
      pending: pendingResult.count,
      revenue: revenueResult.sum || "0",
    };
  }
}

export const storage = new DatabaseStorage();
