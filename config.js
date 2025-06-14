// Website Configuration
export const config = {
  // Website Information
  name: "ShadowX",
  tagline: "Advanced Shortlink Bypasser",
  description: "The ultimate shortlink bypasser",
  discordUrl: "https://discord.gg/QEUtfQDGW9",
  
  // Hosting Configuration
  hosting: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || "0.0.0.0",
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
    environment: process.env.NODE_ENV || "development",
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true
    },
    ssl: {
      enabled: process.env.SSL_ENABLED === "true",
      cert: process.env.SSL_CERT_PATH,
      key: process.env.SSL_KEY_PATH
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // API Configuration
  api: {
    key: "SLR-3c130135-4c7d-48f8-856f-ee6428dc0943-riyad._.123412",
    endpoint: "https://api.solar-x.top/premium/bypass?url="
  },
  
  // Theme Configuration
  themes: {
    red: {
      name: "Red Theme",
      primary: "hsl(0, 72%, 51%)",
      primaryHover: "hsl(0, 72%, 45%)",
      background: "hsl(222, 84%, 4.9%)",
      foreground: "hsl(0, 0%, 98%)",
      muted: "hsl(217, 32.6%, 17.5%)",
      mutedForeground: "hsl(215, 20.2%, 65.1%)",
      heroGradient: "linear-gradient(-45deg, hsl(0, 72%, 51%), hsl(222, 84%, 4.9%), hsl(0, 72%, 51%), hsl(345, 82%, 11%))"
    },
    blue: {
      name: "Blue Theme",
      primary: "hsl(217, 91%, 60%)",
      primaryHover: "hsl(217, 91%, 55%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222, 84%, 4.9%)",
      muted: "hsl(210, 40%, 96%)",
      mutedForeground: "hsl(215, 16%, 47%)",
      heroGradient: "linear-gradient(-45deg, hsl(217, 91%, 60%), hsl(210, 40%, 98%), hsl(221, 83%, 53%), hsl(213, 27%, 84%))"
    }
  },
  
  // Features Configuration
  features: [
    {
      icon: "Rocket",
      title: "Lightning Fast",
      description: "Process thousands of URLs per minute with our optimized API integration"
    },
    {
      icon: "Shield", 
      title: "100% Secure",
      description: "Your URLs are processed securely without storing any personal data"
    },
    {
      icon: "Globe",
      title: "Universal Support", 
      description: "Works with all major shortlink services and custom URL shorteners"
    }
  ],
  
  // Supported Services
  supportedServices: [
    "Linkvertise",
    "Lootlabs/Admaven",
    "mboost",
    "rekonise",
    "socialwolvez",
    "sub2get",
    "Codex",
    "Delta",
    "sub2unlock (.com, .net)",
    "sub4unlock.com",
    "adfoc.us",
    "unlocknow.net",
    "bstlar",
    "ldnesfspublic.org",
    "link.rbscripts.net",
    "Mediafire (direct download)",
    "pastebin",
    "pastedrop",
    "justpaste",
    "pastecanyon",
    "goldpaster"
  ],
  
  // API Statistics (for display purposes)
  stats: {
    successRate: "99.9%",
    averageResponse: "< 2 seconds",
    dailyRequests: "1M+",
    uptime: "99.99%"
  }
};