/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Info,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { generateCertificate } from "@/utils/pdfGenerator";

const Marketplace = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [buyAmount, setBuyAmount] = useState("");
  const [certificateData, setCertificateData] = useState<any>(null);
  const { toast } = useToast();

  const itemsPerPage = 9;

  const allListings = [
    {
      id: 1,
      seller: "0x742d...4A9E",
      tokens: 500,
      price: 2.45,
      total: 1225,
      change: 12.5,
      trend: "up" as const,
      sparkline: [2.1, 2.2, 2.15, 2.3, 2.4, 2.45],
      co2Offset: 0.5,
      round: 2,
      certified: true,
    },
    {
      id: 2,
      seller: "0x8F3C...12BD",
      tokens: 1200,
      price: 2.38,
      total: 2856,
      change: -3.2,
      trend: "down" as const,
      sparkline: [2.5, 2.45, 2.42, 2.4, 2.39, 2.38],
      co2Offset: 1.2,
      round: 2,
      certified: true,
    },
    {
      id: 3,
      seller: "0x5A92...7E3F",
      tokens: 850,
      price: 2.5,
      total: 2125,
      change: 8.7,
      trend: "up" as const,
      sparkline: [2.3, 2.35, 2.4, 2.42, 2.48, 2.5],
      co2Offset: 0.85,
      round: 1,
      certified: true,
    },
    {
      id: 4,
      seller: "0xB1C4...93A2",
      tokens: 300,
      price: 2.42,
      total: 726,
      change: 5.2,
      trend: "up" as const,
      sparkline: [2.3, 2.32, 2.36, 2.38, 2.4, 2.42],
      co2Offset: 0.3,
      round: 2,
      certified: true,
    },
    {
      id: 5,
      seller: "0x3E7A...5B1C",
      tokens: 2000,
      price: 2.35,
      total: 4700,
      change: -1.8,
      trend: "down" as const,
      sparkline: [2.4, 2.38, 2.37, 2.36, 2.35, 2.35],
      co2Offset: 2.0,
      round: 1,
      certified: true,
    },
    {
      id: 6,
      seller: "0x9D2F...8C4E",
      tokens: 750,
      price: 2.48,
      total: 1860,
      change: 6.3,
      trend: "up" as const,
      sparkline: [2.3, 2.34, 2.38, 2.42, 2.45, 2.48],
      co2Offset: 0.75,
      round: 2,
      certified: true,
    },
    {
      id: 7,
      seller: "0x4C8B...2F9A",
      tokens: 1500,
      price: 2.4,
      total: 3600,
      change: 2.1,
      trend: "up" as const,
      sparkline: [2.35, 2.36, 2.37, 2.38, 2.39, 2.4],
      co2Offset: 1.5,
      round: 1,
      certified: true,
    },
    {
      id: 8,
      seller: "0x7A1E...6D3B",
      tokens: 425,
      price: 2.44,
      total: 1037,
      change: 4.8,
      trend: "up" as const,
      sparkline: [2.3, 2.33, 2.37, 2.4, 2.42, 2.44],
      co2Offset: 0.43,
      round: 2,
      certified: true,
    },
    {
      id: 9,
      seller: "0x6E9C...4A7D",
      tokens: 980,
      price: 2.39,
      total: 2342,
      change: -2.4,
      trend: "down" as const,
      sparkline: [2.45, 2.43, 2.42, 2.4, 2.39, 2.39],
      co2Offset: 0.98,
      round: 1,
      certified: true,
    },
    {
      id: 10,
      seller: "0x2B5F...9E1C",
      tokens: 650,
      price: 2.46,
      total: 1599,
      change: 7.2,
      trend: "up" as const,
      sparkline: [2.28, 2.32, 2.37, 2.41, 2.44, 2.46],
      co2Offset: 0.65,
      round: 2,
      certified: true,
    },
  ];

  const totalPages = Math.ceil(allListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = allListings.slice(startIndex, endIndex);

  const handleBuy = (listing: any) => {
    setSelectedListing(listing);
    setBuyDialogOpen(true);
  };

  const handleDetails = (listing: any) => {
    setSelectedListing(listing);
    setDetailsDialogOpen(true);
  };

  const handleConfirmBuy = () => {
    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid token amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > selectedListing.tokens) {
      toast({
        title: "Insufficient tokens",
        description: `Only ${selectedListing.tokens} tokens available`,
        variant: "destructive",
      });
      return;
    }

    const totalCost = amount * selectedListing.price;

    // Prepare certificate data
    const certData = {
      buyerName: "Carbon Offset Buyer",
      tokensAmount: amount,
      co2Offset: (amount / 1000) * selectedListing.co2Offset,
      transactionHash: `0x${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      certificateId: `ECF-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      purchaseDate: new Date().toLocaleDateString(),
    };

    setCertificateData(certData);

    toast({
      title: "Purchase successful!",
      description: `Bought ${amount} tokens for ${totalCost.toFixed(2)} HBAR`,
    });

    setBuyDialogOpen(false);
    setBuyAmount("");
    setCertificateDialogOpen(true);
  };

  const handleDownloadCertificate = () => {
    if (certificateData) {
      generateCertificate(certificateData);
      toast({
        title: "Certificate downloaded!",
        description: "Your carbon offset certificate has been saved",
      });
    }
  };

  const marketStats = [
    { label: "24h Volume", value: "125,400 HBAR", change: "+15.3%" },
    { label: "Avg. Price", value: "2.42 HBAR", change: "+3.8%" },
    { label: "Total Listings", value: "1,247", change: "+8.2%" },
    { label: "Active Traders", value: "342", change: "+12.1%" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Carbon Token Marketplace
            </h1>
            <p className="text-muted-foreground">
              Buy and sell fractionalized carbon credits on Hedera. Receive HBAR
              for your tokens.
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {marketStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span className="text-sm text-accent">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by seller address..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="md:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Listings Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Active Listings ({allListings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="border-border hover:border-accent/50 transition-smooth"
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-semibold truncate">
                            {listing.seller}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {listing.tokens.toLocaleString()} tokens
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
                          {listing.trend === "up" ? (
                            <TrendingUp className="w-5 h-5 text-accent" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="h-16 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={listing.sparkline.map((value, i) => ({
                              value,
                              index: i,
                            }))}
                          >
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={
                                listing.trend === "up"
                                  ? "hsl(95, 60%, 45%)"
                                  : "hsl(0, 40%, 55%)"
                              }
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Price Info */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">
                            {listing.price} HBAR
                          </span>
                          <Badge
                            variant={
                              listing.trend === "up" ? "default" : "destructive"
                            }
                          >
                            {listing.change > 0 ? "+" : ""}
                            {listing.change}%
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Value
                          </span>
                          <span className="font-semibold">
                            {listing.total.toLocaleString()} HBAR
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            CO₂ Offset
                          </span>
                          <span className="font-semibold">
                            {listing.co2Offset} tons
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Round {listing.round}
                        </Badge>
                        {listing.certified && (
                          <Badge variant="default" className="text-xs">
                            VERRA Certified
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="gradient"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleBuy(listing)}
                        >
                          Buy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetails(listing)}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="bg-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Market Information</h3>
                  <p className="text-sm text-muted-foreground">
                    All tokens are backed by VERRA-certified carbon credits and
                    traded on the Hedera blockchain. Sell your fractionalized
                    tokens to receive HBAR instantly. Transactions are secured
                    with instant settlement. Every token represents verified CO₂
                    offset with downloadable certificates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Carbon Tokens</DialogTitle>
            <DialogDescription>
              Purchase fractionalized carbon credits and receive a certificate
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Seller</p>
                  <p className="font-mono font-semibold">
                    {selectedListing.seller}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price per Token</p>
                  <p className="font-semibold">{selectedListing.price} HBAR</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-semibold">
                    {selectedListing.tokens.toLocaleString()} tokens
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">CO₂ Offset</p>
                  <p className="font-semibold">
                    {selectedListing.co2Offset} tons
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount to Buy</label>
                <Input
                  type="number"
                  placeholder="Enter token amount"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  max={selectedListing.tokens}
                />
              </div>

              {buyAmount && parseFloat(buyAmount) > 0 && (
                <div className="p-4 rounded-lg bg-accent/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-bold">
                      {(parseFloat(buyAmount) * selectedListing.price).toFixed(
                        2
                      )}{" "}
                      HBAR
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CO₂ Offset</span>
                    <span className="font-semibold">
                      {(
                        (parseFloat(buyAmount) / 1000) *
                        selectedListing.co2Offset
                      ).toFixed(3)}{" "}
                      tons
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <Download className="w-3 h-3" />
                    <span>Certificate will be automatically downloaded</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBuyDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBuy}
                  className="flex-1"
                  variant="gradient"
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>
              Complete information about this carbon token listing
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Seller Address
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {selectedListing.seller}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Price per Token
                    </p>
                    <p className="text-lg font-bold">
                      {selectedListing.price} HBAR
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">24h Change</p>
                    <Badge
                      variant={
                        selectedListing.trend === "up"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedListing.change > 0 ? "+" : ""}
                      {selectedListing.change}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Available Tokens
                    </p>
                    <p className="text-lg font-bold">
                      {selectedListing.tokens.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold">
                      {selectedListing.total.toLocaleString()} HBAR
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CO₂ Offset</p>
                    <p className="text-lg font-bold">
                      {selectedListing.co2Offset} tons
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Certification Round
                  </span>
                  <Badge variant="outline">Round {selectedListing.round}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Blockchain
                  </span>
                  <span className="text-sm font-semibold">
                    Hedera Hashgraph
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Standard
                  </span>
                  <Badge variant="default">VERRA Certified</Badge>
                </div>
              </div>

              <div className="h-24 w-full">
                <p className="text-xs text-muted-foreground mb-2">
                  Price History (7 days)
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedListing.sparkline.map(
                      (value: number, i: number) => ({ value, index: i })
                    )}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={
                        selectedListing.trend === "up"
                          ? "hsl(95, 60%, 45%)"
                          : "hsl(0, 40%, 55%)"
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Button
                onClick={() => {
                  setDetailsDialogOpen(false);
                  handleBuy(selectedListing);
                }}
                className="w-full"
                variant="gradient"
              >
                Buy Tokens
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog
        open={certificateDialogOpen}
        onOpenChange={setCertificateDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              🎉 Purchase Complete!
            </DialogTitle>
            <DialogDescription>
              Your carbon offset certificate is ready
            </DialogDescription>
          </DialogHeader>
          {certificateData && (
            <div className="space-y-6 py-4">
              {/* Certificate Preview */}
              <div className="relative p-8 rounded-lg border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10">
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="text-xs">
                    VERIFIED
                  </Badge>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-block p-3 rounded-full bg-accent/20">
                    <Download className="w-8 h-8 text-accent" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Carbon Offset Certificate
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      EcoFusion - Hedera Blockchain
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">
                        Certificate ID
                      </span>
                      <span className="font-mono text-sm font-semibold">
                        {certificateData.certificateId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">
                        Carbon Tokens
                      </span>
                      <span className="font-bold">
                        {certificateData.tokensAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">
                        CO₂ Offset
                      </span>
                      <span className="font-bold text-accent">
                        {certificateData.co2Offset.toFixed(3)} tons
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">
                        Issue Date
                      </span>
                      <span className="font-semibold">
                        {certificateData.purchaseDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">
                        Blockchain
                      </span>
                      <span className="font-semibold">Hedera Hashgraph</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCertificateDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleDownloadCertificate}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This certificate represents verified carbon offset tokens on the
                Hedera blockchain
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
