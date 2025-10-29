import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface SellTokenDialogProps {
  availableTokens: number;
  trigger?: React.ReactNode;
}

const SellTokenDialog = ({ availableTokens, trigger }: SellTokenDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState("");
  const [pricePerToken, setPricePerToken] = useState("2.42");
  const { toast } = useToast();

  const handleSell = () => {
    const tokenAmount = parseFloat(tokens);
    if (!tokenAmount || tokenAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid token amount",
        variant: "destructive",
      });
      return;
    }

    if (tokenAmount > availableTokens) {
      toast({
        title: "Insufficient tokens",
        description: `You only have ${availableTokens} tokens available`,
        variant: "destructive",
      });
      return;
    }

    const totalHBAR = tokenAmount * parseFloat(pricePerToken);
    
    toast({
      title: "Listing created!",
      description: `${tokenAmount} tokens listed for ${totalHBAR.toFixed(2)} HBAR`,
    });
    
    setOpen(false);
    setTokens("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <DollarSign className="w-4 h-4 mr-2" />
            Sell Tokens
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell Carbon Tokens</DialogTitle>
          <DialogDescription>
            List your fractionalized carbon tokens on the marketplace to receive HBAR
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Available Tokens</Label>
            <div className="text-2xl font-bold">{availableTokens.toLocaleString()}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokens">Tokens to Sell</Label>
            <Input
              id="tokens"
              type="number"
              placeholder="Enter amount"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              max={availableTokens}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Token (HBAR)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={pricePerToken}
              onChange={(e) => setPricePerToken(e.target.value)}
            />
          </div>

          {tokens && parseFloat(tokens) > 0 && (
            <div className="p-4 rounded-lg bg-accent/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="text-xl font-bold">
                  {(parseFloat(tokens) * parseFloat(pricePerToken)).toFixed(2)} HBAR
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSell} className="flex-1" variant="gradient">
              List for Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellTokenDialog;
