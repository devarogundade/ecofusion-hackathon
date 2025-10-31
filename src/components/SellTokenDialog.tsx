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
import {
  AccountAllowanceApproveTransaction,
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  TokenAllowance,
  TokenId,
} from "@hashgraph/sdk";
import { ethers } from "ethers";
import { executeTransaction } from "@/services/hashconnect";
import useHashConnect from "@/hooks/useHashConnect";
import { supabase } from "@/integrations/supabase/client";

interface SellTokenDialogProps {
  availableTokens: number;
  trigger?: React.ReactNode;
}

const SellTokenDialog = ({
  availableTokens,
  trigger,
}: SellTokenDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState("");
  const [pricePerToken, setPricePerToken] = useState("");
  const [expiresDate, setExpiresDate] = useState("");
  const { toast } = useToast();
  const { accountId } = useHashConnect();

  const handleSell = async () => {
    try {
      if (!Number(tokens) || Number(tokens) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid token amount",
          variant: "destructive",
        });
        return;
      }

      if (Number(tokens) > availableTokens) {
        toast({
          title: "Insufficient tokens",
          description: `You only have ${availableTokens} tokens available`,
          variant: "destructive",
        });
        return;
      }

      const totalPrice = (Number(tokens) * Number(pricePerToken))
        .toFixed(4)
        .toString();
      const expiresAt = new Date(expiresDate);
      const expiresIn = Math.ceil(expiresAt.getTime() / 1000);

      const approvetx =
        new AccountAllowanceApproveTransaction().approveTokenAllowance(
          TokenId.fromString(`${import.meta.env.VITE_CARBON_CREDIT_TOKEN_ID}`),
          AccountId.fromString(accountId),
          ContractId.fromString(import.meta.env.VITE_MARKETPLACE_ID),
          Number(ethers.parseUnits(tokens, 8))
        );

      await executeTransaction(accountId, approvetx);

      const tx = new ContractExecuteTransaction()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_MARKETPLACE_ID)
        )
        .setFunction(
          "list",
          new ContractFunctionParameters()
            .addInt64(Number(ethers.parseUnits(tokens, 8)))
            .addInt64(Number(ethers.parseUnits(totalPrice, 8)))
            .addInt64(expiresIn)
        )
        .setGas(5_000_000);

      await executeTransaction(accountId, tx);

      await supabase.from("marketplace_listings").insert({
        seller_id: accountId,
        expires_at: expiresAt.toISOString(),
        status: "listed",
        co2_offset: Number(tokens),
        price_per_token: Number(pricePerToken),
        total_price: Number(totalPrice),
      });

      toast({
        title: "Listing created!",
        description: `${tokens} tokens listed for ${totalPrice} HBAR`,
      });

      setOpen(false);
      setTokens("");
    } catch (error) {
      console.log(error);
    }
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
            List your fractionalized carbon tokens on the marketplace to receive
            HBAR
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Available Tokens</Label>
            <div className="text-2xl font-bold">
              {availableTokens.toLocaleString()}
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="tokens">Expires At</Label>
            <Input
              id="expiresDate"
              type="date"
              placeholder="Enter expires date"
              value={expiresDate}
              onChange={(e) => setExpiresDate(e.target.value)}
            />
          </div>

          {tokens && parseFloat(tokens) > 0 && (
            <div className="p-4 rounded-lg bg-accent/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Value
                </span>
                <span className="text-xl font-bold">
                  {(parseFloat(tokens) * parseFloat(pricePerToken)).toFixed(2)}{" "}
                  HBAR
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
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
