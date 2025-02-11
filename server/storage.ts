import { users, expenses, type User, type InsertUser, type Expense } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getExpenses(userId: number): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(userId: number, expense: Omit<Expense, "id" | "userId" | "createdAt">): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private expenses: Map<number, Expense>;
  private currentUserId: number;
  private currentExpenseId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
    this.currentUserId = 1;
    this.currentExpenseId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId,
    );
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(
    userId: number,
    expense: Omit<Expense, "id" | "userId" | "createdAt">,
  ): Promise<Expense> {
    const id = this.currentExpenseId++;
    const newExpense: Expense = {
      ...expense,
      id,
      userId,
      createdAt: new Date(),
    };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  async deleteExpense(id: number): Promise<void> {
    this.expenses.delete(id);
  }
}

export const storage = new MemStorage();
