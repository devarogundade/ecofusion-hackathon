import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import VERRAProgress from "@/components/VERRAProgress";
import SellTokenDialog from "@/components/SellTokenDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Leaf, Activity, ArrowUpRight, CheckCircle2, DollarSign } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type CarbonAction = {
  id: string;
  action_type: string;
  co2_impact: number;
  verification_status: string;
  created_at: string;
  tokens_minted: number;
};

type Profile = {
  carbon_tokens: number;
  hbar_balance: number;
};

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [actions, setActions] = useState<CarbonAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    const [profileData, actionsData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('carbon_actions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    if (profileData.data) setProfile(profileData.data);
    if (actionsData.data) setActions(actionsData.data);
    setIsLoading(false);
  };

  const verifiedActions = actions.filter(a => a.verification_status === 'verified').length;
  const totalCO2 = actions.reduce((sum, a) => sum + Number(a.co2_impact), 0);

  const stats = [
    { title: "Total Carbon Tokens", value: profile?.carbon_tokens?.toFixed(2) || "0", change: "+12.5% this month", icon: Coins, trend: "up" as const },
    { title: "HBAR Balance", value: `${profile?.hbar_balance?.toFixed(2) || "0"} ℏ`, change: "+8.3% this month", icon: TrendingUp, trend: "up" as const },
    { title: "Actions Verified", value: verifiedActions.toString(), change: `${actions.length - verifiedActions} pending`, icon: CheckCircle2, trend: "neutral" as const },
    { title: "CO₂ Offset", value: `${(totalCO2 / 1000).toFixed(2)} tons`, change: "+0.4 tons this week", icon: Leaf, trend: "up" as const },
  ];

  const chartData = [
    { month: "Jan", tokens: 120, value: 280 },
    { month: "Feb", tokens: 250, value: 580 },
    { month: "Mar", tokens: 380, value: 880 },
    { month: "Apr", tokens: 520, value: 1200 },
    { month: "May", tokens: 780, value: 1800 },
    { month: "Jun", tokens: profile?.carbon_tokens || 1234, value: profile?.hbar_balance || 2847 },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto space-y-8">
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Track your carbon credits and sustainable impact</p>
            </div>
            <Link to="/upload-action">
              <Button variant="gradient" size="lg">
                Upload New Action
                <ArrowUpRight className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload-action" className="flex-1">
                  <Button variant="gradient" className="w-full">
                    <Leaf className="w-4 h-4 mr-2" />
                    Upload Action
                  </Button>
                </Link>
                <SellTokenDialog 
                  availableTokens={profile?.carbon_tokens || 0}
                  trigger={
                    <Button variant="outline" className="flex-1 w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Sell Tokens
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* VERRA Progress */}
          <VERRAProgress />

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Balance Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(95, 60%, 45%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(95, 60%, 45%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tokens" 
                      stroke="hsl(95, 60%, 45%)" 
                      fill="url(#tokenGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value (HBAR)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(95, 60%, 45%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(95, 60%, 45%)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No actions yet. Upload your first sustainable action!</p>
              ) : (
                <div className="space-y-4">
                  {actions.map((action) => (
                    <div 
                      key={action.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-smooth"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Activity className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold">{action.action_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {action.co2_impact} kg CO₂ • {new Date(action.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {action.tokens_minted > 0 ? `+${action.tokens_minted}` : '—'} tokens
                          </p>
                          <p className={`text-sm ${
                            action.verification_status === "verified" ? "text-accent" : "text-muted-foreground"
                          }`}>
                            {action.verification_status.charAt(0).toUpperCase() + action.verification_status.slice(1)}
                          </p>
                        </div>
                        {action.verification_status === "verified" && (
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;