import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedArtworkSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/coloring-pages", async (req, res) => {
    const pages = await storage.getColoringPages();
    res.json(pages);
  });

  app.get("/api/coloring-pages/:id", async (req, res) => {
    const page = await storage.getColoringPage(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Coloring page not found" });
    }
    res.json(page);
  });

  app.get("/api/artworks", async (req, res) => {
    const artworks = await storage.getSavedArtworks();
    res.json(artworks);
  });

  app.get("/api/artworks/:id", async (req, res) => {
    const artwork = await storage.getSavedArtwork(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(artwork);
  });

  app.post("/api/artworks", async (req, res) => {
    const parseResult = insertSavedArtworkSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    
    const artwork = await storage.createSavedArtwork(parseResult.data);
    res.status(201).json(artwork);
  });

  app.delete("/api/artworks/:id", async (req, res) => {
    const deleted = await storage.deleteSavedArtwork(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.status(204).send();
  });

  return httpServer;
}
