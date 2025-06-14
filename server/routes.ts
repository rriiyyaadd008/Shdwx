import type { Express } from "express";
import { createServer, type Server } from "http";
import { bypassRequestSchema, type BypassResponse } from "@shared/schema";
import { z } from "zod";
import { config } from "../config.js";

const SOLAR_API_KEY = process.env.SOLAR_API_KEY || config.api.key;

export async function registerRoutes(app: Express): Promise<Server> {
  // Bypass shortlink endpoint
  app.post("/api/bypass", async (req, res) => {
    try {
      const { url } = bypassRequestSchema.parse(req.body);
      
      // Make request to Solar API
      const response = await fetch(`${config.api.endpoint}${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SOLAR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Solar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Log the actual response for debugging
      console.log("Solar API response:", JSON.stringify(data, null, 2));
      
      // Handle different possible response formats from Solar API
      let directUrl: string | undefined;
      let success = false;

      // Check various possible response formats based on Solar API response
      if (data.status === "success" && data.result) {
        directUrl = data.result;
        success = true;
      } else if (data.success === true && data.destination) {
        directUrl = data.destination;
        success = true;
      } else if (data.result && data.result.destination) {
        directUrl = data.result.destination;
        success = true;
      } else if (data.bypass_url) {
        directUrl = data.bypass_url;
        success = true;
      } else if (data.direct_url) {
        directUrl = data.direct_url;
        success = true;
      } else if (data.url) {
        directUrl = data.url;
        success = true;
      } else if (data.bypassed_url) {
        directUrl = data.bypassed_url;
        success = true;
      } else if (typeof data === 'string') {
        // Sometimes API returns just the URL as a string
        directUrl = data;
        success = true;
      }

      const result: BypassResponse = {
        success,
        originalUrl: url,
        directUrl,
        error: success ? undefined : (data.error || data.message || data.msg || "Failed to bypass URL"),
      };

      res.json(result);
    } catch (error) {
      console.error("Bypass error:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          originalUrl: req.body.url || "",
          error: error.errors[0]?.message || "Invalid URL format",
        } as BypassResponse);
      } else {
        res.status(500).json({
          success: false,
          originalUrl: req.body.url || "",
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        } as BypassResponse);
      }
    }
  });

  // Health check endpoint for monitoring
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.hosting.environment,
      version: "1.0.0"
    });
  });

  // Get website config endpoint
  app.get("/api/config", (req, res) => {
    res.json({
      name: config.name,
      tagline: config.tagline,
      description: config.description,
      discordUrl: config.discordUrl,
      themes: config.themes,
      features: config.features,
      supportedServices: config.supportedServices,
      stats: config.stats,
      hosting: {
        baseUrl: config.hosting.baseUrl,
        environment: config.hosting.environment
      }
    });
  });

  // Update config endpoint  
  app.post("/api/config/update", async (req, res) => {
    try {
      const { updateConfig } = await import("./config-manager.js");
      await updateConfig(req.body);
      
      res.json({ 
        success: true, 
        message: "Configuration updated successfully" 
      });
    } catch (error) {
      console.error("Config update error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update configuration"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
