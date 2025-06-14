import { promises as fs } from 'fs';
import path from 'path';

interface ConfigUpdateData {
  name?: string;
  tagline?: string; 
  description?: string;
  apiKey?: string;
  apiEndpoint?: string;
  hosting?: {
    port?: number;
    host?: string;
    baseUrl?: string;
    cors?: {
      origin?: string;
      credentials?: boolean;
    };
    rateLimit?: {
      windowMs?: number;
      max?: number;
    };
  };
}

const CONFIG_PATH = path.join(process.cwd(), 'config.js');

export async function updateConfig(updates: ConfigUpdateData): Promise<void> {
  try {
    // Read current config file
    const configContent = await fs.readFile(CONFIG_PATH, 'utf-8');
    
    let updatedContent = configContent;
    
    // Update name if provided
    if (updates.name) {
      updatedContent = updatedContent.replace(
        /name: "[^"]*"/,
        `name: "${updates.name}"`
      );
    }
    
    // Update tagline if provided
    if (updates.tagline) {
      updatedContent = updatedContent.replace(
        /tagline: "[^"]*"/,
        `tagline: "${updates.tagline}"`
      );
    }
    
    // Update description if provided
    if (updates.description) {
      updatedContent = updatedContent.replace(
        /description: "[^"]*"/,
        `description: "${updates.description}"`
      );
    }
    
    // Update API key if provided
    if (updates.apiKey) {
      updatedContent = updatedContent.replace(
        /key: "[^"]*"/,
        `key: "${updates.apiKey}"`
      );
    }
    
    // Update API endpoint if provided
    if (updates.apiEndpoint) {
      updatedContent = updatedContent.replace(
        /endpoint: "[^"]*"/,
        `endpoint: "${updates.apiEndpoint}"`
      );
    }
    
    // Write updated config back to file
    await fs.writeFile(CONFIG_PATH, updatedContent, 'utf-8');
    
    // Clear require cache to reload config
    delete require.cache[require.resolve('../config.js')];
    
  } catch (error) {
    console.error('Error updating config:', error);
    throw new Error('Failed to update configuration file');
  }
}