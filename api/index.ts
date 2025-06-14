import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from '../config.js';

let app: express.Application | null = null;

async function createApp(): Promise<express.Application> {
  if (app) return app;
  
  app = express();

  // CORS configuration
  app.use(cors({
    origin: config.hosting.cors.origin,
    credentials: config.hosting.cors.credentials
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.hosting.rateLimit.windowMs,
    max: config.hosting.rateLimit.max,
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(config.hosting.rateLimit.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Setup API routes directly to avoid Express type issues
  setupApiRoutes(app);
  
  // Error handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Serve static files for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
  
  return app;
}

function setupApiRoutes(app: express.Application) {
  // Config endpoint
  app.get("/api/config", (req, res) => {
    res.json({
      name: config.name,
      tagline: config.tagline,
      description: config.description,
      discordUrl: config.discordUrl,
      themes: config.themes,
      features: config.features,
      supportedServices: config.supportedServices,
      stats: config.stats
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Bypass endpoint
  app.post("/api/bypass", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ 
          error: "URL is required and must be a valid string" 
        });
      }

      const SOLAR_API_KEY = process.env.SOLAR_API_KEY || config.api.key;
      
      // Make request to Solar API
      const response = await fetch(`${config.api.endpoint}${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SOLAR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Solar API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const result = {
        success: true,
        original_url: url,
        bypassed_url: data.result || data.url || data.bypassed_url,
        message: data.message || "URL bypassed successfully"
      };

      res.json(result);
    } catch (error: any) {
      console.error('Bypass error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || "Failed to bypass URL" 
      });
    }
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await createApp();
  return expressApp(req as any, res as any);
}