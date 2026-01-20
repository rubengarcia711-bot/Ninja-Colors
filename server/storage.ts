import { type User, type InsertUser, type ColoringPage, type SavedArtwork, type InsertSavedArtwork } from "@shared/schema";
import { coloringPages as defaultColoringPages } from "@shared/coloring-data";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getColoringPages(): Promise<ColoringPage[]>;
  getColoringPage(id: string): Promise<ColoringPage | undefined>;
  
  getSavedArtworks(): Promise<SavedArtwork[]>;
  getSavedArtwork(id: string): Promise<SavedArtwork | undefined>;
  createSavedArtwork(artwork: InsertSavedArtwork): Promise<SavedArtwork>;
  deleteSavedArtwork(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private coloringPages: Map<string, ColoringPage>;
  private savedArtworks: Map<string, SavedArtwork>;

  constructor() {
    this.users = new Map();
    this.coloringPages = new Map();
    this.savedArtworks = new Map();
    
    this.seedColoringPages();
  }

  private seedColoringPages(): void {
    for (const page of defaultColoringPages) {
      this.coloringPages.set(page.id, page);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getColoringPages(): Promise<ColoringPage[]> {
    return Array.from(this.coloringPages.values());
  }

  async getColoringPage(id: string): Promise<ColoringPage | undefined> {
    return this.coloringPages.get(id);
  }

  async getSavedArtworks(): Promise<SavedArtwork[]> {
    return Array.from(this.savedArtworks.values()).sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }

  async getSavedArtwork(id: string): Promise<SavedArtwork | undefined> {
    return this.savedArtworks.get(id);
  }

  async createSavedArtwork(artwork: InsertSavedArtwork): Promise<SavedArtwork> {
    const id = randomUUID();
    const savedArtwork: SavedArtwork = {
      ...artwork,
      id,
      completedAt: new Date().toISOString(),
    };
    this.savedArtworks.set(id, savedArtwork);
    return savedArtwork;
  }

  async deleteSavedArtwork(id: string): Promise<boolean> {
    return this.savedArtworks.delete(id);
  }
}

export const storage = new MemStorage();
