import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Additional looksmaxxing profile fields
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  height: integer("height"), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  skinType: varchar("skin_type", { length: 50 }),
  hairType: varchar("hair_type", { length: 50 }),
  goals: text("goals").array(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  currentStreak: integer("current_streak").default(0),
  totalXP: integer("total_xp").default(0),
  level: integer("level").default(1),
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // skincare, fitness, nutrition, etc.
  timeOfDay: varchar("time_of_day", { length: 20 }), // morning, evening, any
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const routineItems = pgTable("routine_items", {
  id: serial("id").primaryKey(),
  routineId: integer("routine_id").notNull().references(() => routines.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  xpReward: integer("xp_reward").default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routineCompletions = pgTable("routine_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  routineItemId: integer("routine_item_id").notNull().references(() => routineItems.id),
  completedAt: timestamp("completed_at").defaultNow(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
});

export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: text("caption"),
  tags: text("tags").array(),
  analysisData: jsonb("analysis_data"), // AI analysis results
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 50 }).notNull(),
  xpReward: integer("xp_reward").default(50),
  criteria: jsonb("criteria").notNull(), // Conditions for unlocking
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: varchar("image_url", { length: 500 }),
  ingredients: text("ingredients").array(),
  targetSkinTypes: text("target_skin_types").array(),
  affiliateUrl: varchar("affiliate_url", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  routines: many(routines),
  routineCompletions: many(routineCompletions),
  progressPhotos: many(progressPhotos),
  chatMessages: many(chatMessages),
  userAchievements: many(userAchievements),
}));

export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, { fields: [routines.userId], references: [users.id] }),
  items: many(routineItems),
}));

export const routineItemsRelations = relations(routineItems, ({ one, many }) => ({
  routine: one(routines, { fields: [routineItems.routineId], references: [routines.id] }),
  completions: many(routineCompletions),
}));

export const routineCompletionsRelations = relations(routineCompletions, ({ one }) => ({
  user: one(users, { fields: [routineCompletions.userId], references: [users.id] }),
  routineItem: one(routineItems, { fields: [routineCompletions.routineItemId], references: [routineItems.id] }),
}));

export const progressPhotosRelations = relations(progressPhotos, ({ one }) => ({
  user: one(users, { fields: [progressPhotos.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertRoutineSchema = createInsertSchema(routines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoutineItemSchema = createInsertSchema(routineItems).omit({
  id: true,
  createdAt: true,
});

export const insertRoutineCompletionSchema = createInsertSchema(routineCompletions).omit({
  id: true,
  completedAt: true,
});

export const insertProgressPhotoSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;
export type Routine = typeof routines.$inferSelect;
export type InsertRoutineItem = z.infer<typeof insertRoutineItemSchema>;
export type RoutineItem = typeof routineItems.$inferSelect;
export type InsertRoutineCompletion = z.infer<typeof insertRoutineCompletionSchema>;
export type RoutineCompletion = typeof routineCompletions.$inferSelect;
export type InsertProgressPhoto = z.infer<typeof insertProgressPhotoSchema>;
export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
