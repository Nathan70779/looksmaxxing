import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getAICoachResponse, analyzeProgressPhoto } from "./openai";
import multer from "multer";
import { z } from "zod";
import { 
  insertRoutineSchema,
  insertRoutineItemSchema,
  insertRoutineCompletionSchema,
  insertProgressPhotoSchema,
  insertChatMessageSchema 
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      const user = await storage.updateUserProfile(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Routine routes
  app.get('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routines = await storage.getUserRoutines(userId);
      
      // Get items for each routine
      const routinesWithItems = await Promise.all(
        routines.map(async (routine) => {
          const items = await storage.getRoutineItems(routine.id);
          return { ...routine, items };
        })
      );

      res.json(routinesWithItems);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Failed to fetch routines" });
    }
  });

  app.post('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routineData = insertRoutineSchema.parse({ ...req.body, userId });
      
      const routine = await storage.createRoutine(routineData);
      res.json(routine);
    } catch (error) {
      console.error("Error creating routine:", error);
      res.status(500).json({ message: "Failed to create routine" });
    }
  });

  app.post('/api/routines/:id/items', isAuthenticated, async (req: any, res) => {
    try {
      const routineId = parseInt(req.params.id);
      const itemData = insertRoutineItemSchema.parse({ ...req.body, routineId });
      
      const item = await storage.createRoutineItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating routine item:", error);
      res.status(500).json({ message: "Failed to create routine item" });
    }
  });

  app.post('/api/routines/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completionData = insertRoutineCompletionSchema.parse({ 
        ...req.body, 
        userId,
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      });
      
      const completion = await storage.completeRoutineItem(completionData);
      
      // Update user XP and streak
      const user = await storage.getUser(userId);
      if (user) {
        const newXP = (user.totalXP || 0) + 10; // Base XP for completing a routine item
        const newLevel = Math.floor(newXP / 100) + 1;
        
        await storage.updateUserProfile(userId, {
          totalXP: newXP,
          level: newLevel,
          currentStreak: (user.currentStreak || 0) + 1,
        });
      }
      
      res.json(completion);
    } catch (error) {
      console.error("Error completing routine item:", error);
      res.status(500).json({ message: "Failed to complete routine item" });
    }
  });

  app.get('/api/routines/completions/:date', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.params.date;
      
      const completions = await storage.getUserCompletionsForDate(userId, date);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  // Progress photo routes
  app.get('/api/progress-photos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const photos = await storage.getUserProgressPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching progress photos:", error);
      res.status(500).json({ message: "Failed to fetch progress photos" });
    }
  });

  app.post('/api/progress-photos', isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      const caption = req.body.caption || '';

      if (!file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      // Convert to base64 for AI analysis
      const base64Image = file.buffer.toString('base64');
      
      // Analyze the image with AI
      const analysisData = await analyzeProgressPhoto(base64Image);

      // In a real app, you'd upload the image to cloud storage and get a URL
      // For now, we'll use a placeholder URL
      const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

      const photoData = insertProgressPhotoSchema.parse({
        userId,
        imageUrl,
        caption,
        analysisData,
      });

      const photo = await storage.createProgressPhoto(photoData);
      res.json(photo);
    } catch (error) {
      console.error("Error uploading progress photo:", error);
      res.status(500).json({ message: "Failed to upload progress photo" });
    }
  });

  // AI Coach routes
  app.get('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get user profile for context
      const user = await storage.getUser(userId);
      
      // Get AI response
      const aiResponse = await getAICoachResponse(message, user);

      // Save the conversation
      const chatMessageData = insertChatMessageSchema.parse({
        userId,
        message,
        response: aiResponse.message,
      });

      const chatMessage = await storage.createChatMessage(chatMessageData);
      
      res.json({
        ...chatMessage,
        suggestions: aiResponse.suggestions,
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Product recommendations
  app.get('/api/products/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const products = await storage.getProductRecommendations(userId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching product recommendations:", error);
      res.status(500).json({ message: "Failed to fetch product recommendations" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const today = new Date().toISOString().split('T')[0];
      
      const [user, todayCompletions, progressPhotos] = await Promise.all([
        storage.getUser(userId),
        storage.getUserCompletionsForDate(userId, today),
        storage.getUserProgressPhotos(userId),
      ]);

      const stats = {
        currentStreak: user?.currentStreak || 0,
        totalXP: user?.totalXP || 0,
        level: user?.level || 1,
        todayCompletions: todayCompletions.length,
        totalProgressPhotos: progressPhotos.length,
        lastPhotoDate: progressPhotos[0]?.createdAt || null,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
