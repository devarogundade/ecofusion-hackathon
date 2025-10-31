/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import { testnetClient } from "@/services/hederaclient";
import { ethers } from "ethers";

interface ApproveActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: any;
  onSuccess: () => void;
}

export const ApproveActionDialog = ({
  open,
  onOpenChange,
  action,
  onSuccess,
}: ApproveActionDialogProps) => {
  const [co2Impact, setCo2Impact] = useState(
    action?.co2_impact?.toString() || ""
  );
  const [tokensMinted, setTokensMinted] = useState(
    action?.tokens_minted?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const tx = new ContractExecuteTransaction()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_ID)
        )
        .setFunction(
          "approve",
          new ContractFunctionParameters()
            .addInt64(action.action_id)
            .addInt64(Number(ethers.parseUnits(tokensMinted, 8)))
        )
        .setGas(5_000_000);

      const client = testnetClient();

      const txResponse = await tx.execute(client);
      const txReceipt = await txResponse.getReceipt(client);

      const topicTx = new TopicMessageSubmitTransaction()
        .setTopicId(action.topic_id)
        .setMessage(
          JSON.stringify({
            verification_status: "verified",
            co2Impact,
            tokensMinted,
            serialNumbers: txReceipt.serials,
          })
        );

      await topicTx.execute(client);

      const latestSerialNumberCallQuery = new ContractCallQuery()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_ID)
        )
        .setFunction("latestSerialNumber")
        .setGas(5_000_000);

      const latestSerialNumberCall = await latestSerialNumberCallQuery.execute(
        client
      );
      const latestSerialNumber = Number(latestSerialNumberCall.getUint64(0));

      const { error } = await supabase
        .from("carbon_actions")
        .update({
          verification_status: "verified",
          co2_impact: Number(co2Impact),
          tokens_minted: Number(tokensMinted),
          serial_number: latestSerialNumber,
        })
        .eq("id", action.id);

      if (error) throw error;

      toast.success("Action approved successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error approving action:", error);
      toast.error("Failed to approve action");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const tx = new ContractExecuteTransaction()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_ID)
        )
        .setFunction(
          "reject",
          new ContractFunctionParameters().addInt64(action.action_id)
        )
        .setGas(5_000_000);

      const client = testnetClient();
      await tx.execute(client);

      const topicTx = new TopicMessageSubmitTransaction()
        .setTopicId(action.topic_id)
        .setMessage(
          JSON.stringify({
            verification_status: "rejected",
          })
        );

      await topicTx.execute(client);

      const { error } = await supabase
        .from("carbon_actions")
        .update({
          verification_status: "rejected",
          serial_number: 0,
        })
        .eq("id", action.id);

      if (error) throw error;

      toast.success("Action rejected");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error rejecting action:", error);
      toast.error("Failed to reject action");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Action</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Action Type: {action?.action_type}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Description: {action?.description}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Location: {action?.location || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Action Date: {action?.action_date}
            </p>
            {action?.proof_url && (
              <a
                href={action.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Proof
              </a>
            )}
          </div>
          <div>
            <Label htmlFor="co2Impact">CO2 Offset (kg)</Label>
            <Input
              id="co2Impact"
              type="number"
              step="0.01"
              value={co2Impact}
              onChange={(e) => setCo2Impact(e.target.value)}
              placeholder="Enter CO2 offset amount"
            />
          </div>
          <div>
            <Label htmlFor="tokensMinted">Tokens Minted</Label>
            <Input
              id="tokensMinted"
              type="number"
              step="0.01"
              value={tokensMinted}
              onChange={(e) => setTokensMinted(e.target.value)}
              placeholder="Enter tokens to mint"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReject} disabled={isLoading}>
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading || !co2Impact || !tokensMinted}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
