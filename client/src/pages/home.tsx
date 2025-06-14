import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { bypassUrl } from "@/lib/api";
import { BypassResponse } from "@shared/schema";
import { useConfig } from "@/lib/config";
import { SettingsDialog } from "@/components/settings-dialog";
import { 
  Palette, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  AlertTriangle,
  Rocket,
  Shield,
  Globe,
  Zap,
  ShieldCheck,
  ExternalLink,
  MessageCircle
} from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<BypassResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { data: config, isLoading: configLoading } = useConfig();

  // Use fallback values if config is loading
  const siteName = config?.name || "ShadowX";
  const siteTagline = config?.tagline || "Advanced Shortlink Bypasser";
  const siteDescription = config?.description || "The ultimate shortlink bypasser";
  const discordUrl = config?.discordUrl || "https://discord.gg/QEUtfQDGW9";
  const features = config?.features || [];
  const supportedServices = config?.supportedServices || [];
  const stats = config?.stats || {
    successRate: "99.9%",
    averageResponse: "< 2 seconds", 
    dailyRequests: "1M+",
    uptime: "99.99%"
  };

  const bypassMutation = useMutation({
    mutationFn: bypassUrl,
    onSuccess: (data) => {
      setResult(data);
      if (!data.success) {
        toast({
          title: "Bypass Failed",
          description: data.error || "Unable to bypass this URL",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "URL bypassed successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }
    
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }
    
    setResult(null);
    bypassMutation.mutate({ url });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Discord Banner */}
      <div className="w-full discord-banner py-3 px-4 text-center relative z-40">
        <a 
          href={discordUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors duration-200"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">JOIN DISCORD</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog />
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleTheme}
          size="icon"
          className="rounded-full glass-effect shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 hero-bg"></div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
                {siteName.split('').map((char, i) => 
                  char === 'X' ? <span key={i} className="brand-accent">{char}</span> : char
                )}
              </h1>
              <p className="text-xl text-gray-300 font-light">{siteTagline}</p>
            </div>
            <div className="flex justify-center space-x-4 text-white/80">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 icon-accent" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 icon-accent" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 icon-accent" />
                <span>Universal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* URL Processor */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect shadow-2xl processor-card">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-2">Bypass Any Shortlink</h2>
                <p className="text-muted-foreground">Enter your shortened URL below and get the direct link instantly</p>
              </div>

              <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://short.link/example"
                    className="w-full px-6 py-4 text-lg rounded-xl pr-32 url-input"
                    disabled={bypassMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={bypassMutation.isPending}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg font-semibold bypass-btn"
                  >
                    {bypassMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Bypass
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4 inline mr-1" />
                  Supports all major shortlink services (bit.ly, tinyurl, short.link, etc.)
                </div>
              </form>

              {/* Loading State */}
              {bypassMutation.isPending && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 loading-spinner" />
                  <p className="text-lg font-medium">Processing your request...</p>
                  <p className="text-sm text-muted-foreground mt-2">This usually takes just a few seconds</p>
                </div>
              )}

              {/* Results Section */}
              {result && result.success && (
                <Card className="results-container">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      Bypass Successful
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Original URL:</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={result.originalUrl}
                            readOnly
                            className="flex-1 font-mono text-sm"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(result.originalUrl, "original")}
                            className="copy-btn"
                          >
                            {copiedField === "original" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Direct URL:</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={result.directUrl || ""}
                            readOnly
                            className="flex-1 font-mono text-sm"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(result.directUrl || "", "direct")}
                            className="copy-btn"
                          >
                            {copiedField === "direct" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {result && !result.success && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Error</span>
                    </div>
                    <p className="text-red-600 dark:text-red-300">
                      {result.error || "Unable to bypass this URL. Please check the URL format and try again."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose {siteName}?</h2>
            <p className="text-xl text-muted-foreground">The most advanced shortlink bypasser available</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon === "Rocket" ? Rocket : 
                                 feature.icon === "Shield" ? Shield : Globe;
              return (
                <Card key={index} className="text-center feature-card hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center feature-icon">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* API Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="glass-effect api-info-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Powered by Solar API</h2>
                <p className="text-muted-foreground">Advanced bypass technology with 99.9% success rate</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Supported Services</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {supportedServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">API Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-semibold text-green-600">{stats.successRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response:</span>
                      <span className="font-semibold">{stats.averageResponse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Requests:</span>
                      <span className="font-semibold">{stats.dailyRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-semibold text-green-600">{stats.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">
              {siteName.split('').map((char, i) => 
                char === 'X' ? <span key={i} className="brand-accent">{char}</span> : char
              )}
            </h3>
            <p className="text-muted-foreground mt-2">{siteDescription}</p>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span>© 2024 {siteName}</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
