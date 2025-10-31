import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Coins,
  TrendingUp,
  Leaf,
  Zap,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-earth.jpg";
import sustainabilityNetwork from "@/assets/sustainability-network.jpg";

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: "Log Sustainable Actions",
      description:
        "Track your eco-friendly activities from recycling to renewable energy usage with AI-powered verification.",
    },
    {
      icon: Shield,
      title: "AI Verification",
      description:
        "Advanced AI agents validate your sustainability claims with photo recognition and metadata analysis.",
    },
    {
      icon: Coins,
      title: "Earn Carbon Tokens",
      description:
        "Receive fractionalized carbon credit tokens for verified sustainable actions, backed by VERRA certificates.",
    },
    {
      icon: TrendingUp,
      title: "Trade in Marketplace",
      description:
        "Convert your carbon tokens to HBAR in our liquid secondary marketplace with transparent pricing on Hedera.",
    },
    {
      icon: Globe2,
      title: "VERRA Certified",
      description:
        "All carbon credits are certified by VERRA, ensuring genuine environmental impact and credibility.",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description:
        "Hedera-powered instant transactions with blockchain transparency, security, and HBAR payments built-in.",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Perform Sustainable Action",
      description:
        "Take eco-friendly actions like recycling, using renewable energy, or reducing emissions.",
    },
    {
      step: "02",
      title: "Upload & Verify",
      description:
        "Submit proof through our platform. AI agents verify authenticity and calculate CO₂ impact.",
    },
    {
      step: "03",
      title: "Receive Tokens",
      description:
        "Get fractionalized carbon credit tokens minted directly to your wallet.",
    },
    {
      step: "04",
      title: "Trade or Hold",
      description:
        "Trade tokens in our marketplace or hold them to support carbon credit certification.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Earth with carbon network"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm">
                AI-Verified Carbon Credits on Web3
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              EcoFusion
            </h1>

            <p className="text-2xl text-foreground max-w-2xl mx-auto">
              Transform your sustainable actions into verified carbon credits on
              Hedera. Log actions, get AI verification, earn tokens backed by
              VERRA certificates, and trade for HBAR.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload-action">
                <Button variant="hero" size="lg" className="group">
                  Start Earning Credits
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
              <div>
                <p className="text-3xl font-bold text-accent">$2.4M</p>
                <p className="text-sm text-muted-foreground">
                  Total Value Locked
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">12,450</p>
                <p className="text-sm text-muted-foreground">
                  Actions Verified
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">847</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Revolutionizing Carbon Credits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining AI verification, Hedera blockchain, and VERRA-certified
              carbon credits to create a transparent, accessible sustainability
              marketplace with instant HBAR payouts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-glow transition-smooth"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 rounded-lg bg-accent/10 w-fit">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to turn your sustainable actions into valuable
              carbon credit tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="text-6xl font-bold text-accent/20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-accent/30" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 relative rounded-2xl overflow-hidden">
            <img
              src={sustainabilityNetwork}
              alt="Sustainability network"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            <CardContent className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Make an Impact?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users earning carbon credits for their
                sustainable actions. Start your journey towards a greener future
                today.
              </p>
              <Link to="/dashboard">
                <Button variant="hero" size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold">EcoFusion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EcoFusion. Carbon credits verified by VERRA • Built on
              Hedera
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
