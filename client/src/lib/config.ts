import { useQuery } from "@tanstack/react-query";

export interface WebsiteConfig {
  name: string;
  tagline: string;
  description: string;
  discordUrl: string;
  themes: {
    red: ThemeConfig;
    blue: ThemeConfig;
  };
  features: FeatureConfig[];
  supportedServices: string[];
  stats: StatsConfig;
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

export interface StatsConfig {
  successRate: string;
  averageResponse: string;
  dailyRequests: string;
  uptime: string;
}

export function useConfig() {
  return useQuery<WebsiteConfig>({
    queryKey: ['/api/config'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}