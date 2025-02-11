import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertExpenseSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Middleware to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Get all expenses for user
  app.get("/api/expenses", requireAuth, async (req, res) => {
    try {
      const expenses = await storage.getExpenses(req.user!.id);
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  // Create expense
  app.post("/api/expenses", requireAuth, async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(req.user!.id, {
        ...data,
        amount: Math.round(data.amount * 100), // Convert to cents
      });
      res.status(201).json(expense);
    } catch (err) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });

  // Delete expense
  app.delete("/api/expenses/:id", requireAuth, async (req, res) => {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await storage.getExpense(expenseId);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      if (expense.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteExpense(expenseId);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Export expenses
  app.get("/api/expenses/export", requireAuth, async (req, res) => {
    try {
      const expenses = await storage.getExpenses(req.user!.id);
      res.json(expenses); // Frontend will handle PDF generation
    } catch (err) {
      res.status(500).json({ message: "Failed to export expenses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
