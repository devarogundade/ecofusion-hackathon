import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import VERRAProgress from "@/components/VERRAProgress";
import SellTokenDialog from "@/components/SellTokenDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coins,
  TrendingUp,
  Leaf,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import useHashConnect from "@/hooks/useHashConnect";
import {
  AccountAllowanceApproveTransaction,
  AccountBalanceQuery,
  AccountId,
  AccountInfoQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  TokenAssociateTransaction,
  TokenId,
  TokenNftAllowance,
  Long,
} from "@hashgraph/sdk";
import { testnetClient } from "@/services/hederaclient";
import { executeTransaction } from "@/services/hashconnect";
import { toast } from "sonner";

type CarbonAction = {
  id: string;
  action_type: string;
  co2_impact: number;
  verification_status: string;
  created_at: string;
  tokens_minted: number;
  action_id: number;
};

type Profile = {
  carbon_tokens: number;
  hbar_balance: number;
};

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [hbarBalance, setHbarBalance] = useState("0");
  const [carbonOffsets, setCarbonOffsets] = useState("0");
  const [actions, setActions] = useState<CarbonAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  const { accountId, connect, disconnect } = useHashConnect();

  const fetchBalance = useCallback(async () => {
    if (!accountId) return;

    const accountInfoQuery = new AccountInfoQuery().setAccountId(
      AccountId.fromString(accountId)
    );

    const client = testnetClient();
    const accountInfo = await accountInfoQuery.execute(client);

    setHbarBalance(accountInfo?.balance?.toString());
  }, [accountId]);

  const fetchCarbonOffsetBalance = useCallback(async () => {
    if (!accountId) return;

    const accountInfoQuery = new AccountBalanceQuery().setAccountId(
      AccountId.fromString(accountId)
    );

    const client = testnetClient();
    const accountInfo = await accountInfoQuery.execute(client);

    setCarbonOffsets(
      accountInfo?.tokens?.get(
        TokenId.fromString(import.meta.env.VITE_CARBON_CREDIT_TOKEN_ID)
      ) || 0
    );
  }, [accountId]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    const [actionsData] = await Promise.all([
      supabase
        .from("carbon_actions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (actionsData.data) setActions(actionsData.data);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
    fetchCarbonOffsetBalance();
  }, [fetchDashboardData, fetchCarbonOffsetBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const verifiedActions = actions.filter(
    (a) => a.verification_status === "verified"
  ).length;
  const totalCO2 = actions.reduce((sum, a) => sum + Number(a.co2_impact), 0);

  const handleRedeemAction = async (serialNumber: number) => {
    try {
      setIsClaiming(true);

      const approvetx = new AccountAllowanceApproveTransaction({
        nftApprovals: [
          new TokenNftAllowance({
            tokenId: TokenId.fromString(
              import.meta.env.VITE_CARBON_CREDIT_TOKEN_ID
            ),
            spenderAccountId: AccountId.fromString(
              import.meta.env.VITE_CARBON_CREDIT_ID
            ),
            delegatingSpender: AccountId.fromString(
              import.meta.env.VITE_CARBON_CREDIT_ID
            ),
            serialNumbers: [Long.fromNumber(serialNumber)],
            ownerAccountId: AccountId.fromString(accountId),
            allSerials: true,
          }),
        ],
      });

      await executeTransaction(accountId, approvetx);

      const accountInfoQuery = new AccountInfoQuery().setAccountId(
        AccountId.fromString(accountId)
      );

      const client = testnetClient();
      const accountInfo = await accountInfoQuery.execute(client);

      const tokenRelationship = accountInfo.tokenRelationships.get(
        TokenId.fromString(import.meta.env.VITE_CARBON_CREDIT_TOKEN_ID)
      );

      if (!tokenRelationship) {
        const associateTx = new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(accountId))
          .setTokenIds([
            TokenId.fromString(import.meta.env.VITE_CARBON_CREDIT_TOKEN_ID),
          ]);

        await executeTransaction(accountId, associateTx);
      }

      const tx = new ContractExecuteTransaction()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_CARBON_CREDIT_ID)
        )
        .setFunction(
          "reedemAction",
          new ContractFunctionParameters().addInt64(
            Long.fromNumber(serialNumber)
          )
        )
        .setGas(5_000_000);

      await executeTransaction(accountId, tx);
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    } finally {
      setIsClaiming(false);
    }
  };

  const stats = [
    {
      title: "Total Carbon Tokens",
      value: carbonOffsets,
      change: "+12.5% this month",
      icon: Coins,
      trend: "up" as const,
    },
    {
      title: "HBAR Balance",
      value: `${hbarBalance}`,
      change: "+8.3% this month",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Actions Verified",
      value: verifiedActions.toString(),
      change: `${actions.length - verifiedActions} pending`,
      icon: CheckCircle2,
      trend: "neutral" as const,
    },
    {
      title: "CO₂ Offset",
      value: `${(totalCO2 / 1000).toFixed(2)} tons`,
      change: "+0.4 tons this week",
      icon: Leaf,
      trend: "up" as const,
    },
  ];

  const chartData = [
    { month: "Jun", tokens: 0, value: 0 },
    { month: "Jul", tokens: 0, value: 0 },
    { month: "Aug", tokens: 0, value: 0 },
    { month: "Sep", tokens: 0, value: 0 },
    { month: "Oct", tokens: 0, value: 0 },
    {
      month: "Nov",
      tokens: Number(carbonOffsets),
      value: Number(hbarBalance.replace("ℏ", "")),
    },
  ];

  const handleConnect = () => {
    if (accountId) {
      disconnect();
    } else {
      connect();
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto space-y-8">
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
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
              <p className="text-muted-foreground">
                Track your carbon credits and sustainable impact
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/upload-action">
                <Button variant="outline" size="lg">
                  Upload New Action
                  <ArrowUpRight className="ml-2" />
                </Button>
              </Link>

              <Button
                type="button"
                variant="gradient"
                size="lg"
                disabled={isLoading}
                onClick={handleConnect}
              >
                {accountId ? accountId : "Connect Wallet"}
              </Button>
            </div>
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
                  availableTokens={Number(carbonOffsets)}
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
                      <linearGradient
                        id="tokenGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(95, 60%, 45%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(95, 60%, 45%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
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
                <p className="text-muted-foreground text-center py-8">
                  No actions yet. Upload your first sustainable action!
                </p>
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
                            {action.co2_impact} kg CO₂ •{" "}
                            {new Date(action.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {action.tokens_minted > 0
                              ? `+${action.tokens_minted}`
                              : "—"}{" "}
                            tokens
                          </p>
                          <p
                            className={`text-sm ${
                              action.verification_status === "verified"
                                ? "text-accent"
                                : "text-muted-foreground"
                            }`}
                          >
                            {action.verification_status
                              .charAt(0)
                              .toUpperCase() +
                              action.verification_status.slice(1)}
                          </p>
                          <a href="" className="text-accent underline">
                            0.0.7163937
                          </a>
                        </div>
                        {action.verification_status === "verified" && (
                          <Button
                            disabled={isClaiming}
                            onClick={() => handleRedeemAction(action.action_id)}
                          >
                            Claim
                          </Button>
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
