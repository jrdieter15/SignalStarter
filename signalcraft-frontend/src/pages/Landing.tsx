import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Globe, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SignalCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Turn <span className="text-primary">Signal</span> into Structure
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            In the beginning, we charted stars. Today, we chart data. 
            Welcome to the future of foresight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="#features" className="btn-outline text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Information alone is not wisdom.
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Dashboards without direction waste time. SignalCraft transforms 
                noise into navigable insight.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>No more scattered data across multiple tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>AI-powered insights, not just pretty charts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Privacy-first approach to your business data</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-lg">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-primary/20 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">A Tool for Decision‑Makers</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Not just another dashboard. SignalCraft unites news, trends, and your KPIs 
            in one private, AI‑powered workspace—so you can act with certainty.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="card p-8">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Local Signals</h3>
              <p className="text-muted-foreground">
                Hyperlocal insights with worldwide reach. Track what matters in your market.
              </p>
            </div>
            
            <div className="card p-8">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Predictive Foresight</h3>
              <p className="text-muted-foreground">
                AI-powered forecasting helps you stay ahead of changes, big or small.
              </p>
            </div>
            
            <div className="card p-8">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Privacy by Design</h3>
              <p className="text-muted-foreground">
                Your data, your rules—encrypted end‑to‑end with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold mb-6">
            Build your future—<span className="italic">signal by signal.</span>
          </h2>
          <Link to="/register" className="btn bg-background text-foreground hover:bg-background/90 text-lg px-8 py-3">
            Create Your Free Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-6 w-6" />
                <span className="font-bold">SignalCraft</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Privacy-first business intelligence for the modern entrepreneur.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
                <li><a href="#" className="hover:text-foreground">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SignalCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}