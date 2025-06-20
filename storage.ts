import {
  users,
  routines,
  routineItems,
  routineCompletions,
  progressPhotos,
  chatMessages,
  achievements,
  userAchievements,
  products,
  type User,
  type UpsertUser,
  type InsertRoutine,
  type Routine,
  type InsertRoutineItem,
  type RoutineItem,
  type InsertRoutineCompletion,
  type RoutineCompletion,
  type InsertProgressPhoto,
  type ProgressPhoto,
  type InsertChatMessage,
  type ChatMessage,
  type Achievement,
  type UserAchievement,
  type Product,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  
  // Routine operations
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  getUserRoutines(userId: string): Promise<Routine[]>;
  createRoutineItem(item: InsertRoutineItem): Promise<RoutineItem>;
  getRoutineItems(routineId: number): Promise<RoutineItem[]>;
  completeRoutineItem(completion: InsertRoutineCompletion): Promise<RoutineCompletion>;
  getUserCompletionsForDate(userId: string, date: string): Promise<RoutineCompletion[]>;
  
  // Progress photos
  createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto>;
  getUserProgressPhotos(userId: string): Promise<ProgressPhoto[]>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  
  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  
  // Products
  getProducts(category?: string): Promise<Product[]>;
  getProductRecommendations(userId: string): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Routine operations
  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const [newRoutine] = await db.insert(routines).values(routine).returning();
    return newRoutine;
  }

  async getUserRoutines(userId: string): Promise<Routine[]> {
    return await db
      .select()
      .from(routines)
      .where(and(eq(routines.userId, userId), eq(routines.isActive, true)))
      .orderBy(asc(routines.timeOfDay));
  }

  async createRoutineItem(item: InsertRoutineItem): Promise<RoutineItem> {
    const [newItem] = await db.insert(routineItems).values(item).returning();
    return newItem;
  }

  async getRoutineItems(routineId: number): Promise<RoutineItem[]> {
    return await db
      .select()
      .from(routineItems)
      .where(eq(routineItems.routineId, routineId))
      .orderBy(asc(routineItems.orderIndex));
  }

  async completeRoutineItem(completion: InsertRoutineCompletion): Promise<RoutineCompletion> {
    const [newCompletion] = await db.insert(routineCompletions).values(completion).returning();
    return newCompletion;
  }

  async getUserCompletionsForDate(userId: string, date: string): Promise<RoutineCompletion[]> {
    return await db
      .select()
      .from(routineCompletions)
      .where(and(eq(routineCompletions.userId, userId), eq(routineCompletions.date, date)));
  }

  // Progress photos
  async createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto> {
    const [newPhoto] = await db.insert(progressPhotos).values(photo).returning();
    return newPhoto;
  }

  async getUserProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
    return await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.userId, userId))
      .orderBy(desc(progressPhotos.createdAt));
  }

  // Chat messages
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getUserChatMessages(userId: string, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    const query = db.select().from(products);
    if (category) {
      return await query.where(eq(products.category, category));
    }
    return await query;
  }

  async getProductRecommendations(userId: string): Promise<Product[]> {
    // Simple recommendation based on user's skin type
    const user = await this.getUser(userId);
    if (!user?.skinType) {
      return await db.select().from(products).limit(10);
    }

    // This is a basic implementation - in a real app you'd have more sophisticated ML recommendations
    return await db.select().from(products).limit(10);
  }
}

export const storage = new DatabaseStorage();
