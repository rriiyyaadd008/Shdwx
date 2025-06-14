export interface Config {
  name: string;
  tagline: string;
  description: string;
  discordUrl: string;
  hosting: {
    port: number;
    host: string;
    baseUrl: string;
    environment: string;
    cors: {
      origin: string;
      credentials: boolean;
    };
    ssl: {
      enabled: boolean;
      cert?: string;
      key?: string;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
  api: {
    key: string;
    endpoint: string;
  };
  themes: {
    red: ThemeConfig;
    blue: ThemeConfig;
  };
  features: FeatureConfig[];
  supportedServices: string[];
  stats: {
    successRate: string;
    averageResponse: string;
    dailyRequests: string;
    uptime: string;
  };
}

export interface ThemeConfig {
  name: string;
  primary: string;
  primaryHover: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  heroGradient: string;
}

export interface FeatureConfig {
  icon: string;
  title: string;
  description: string;
}

declare module './config.js' {
  export const config: Config;
}