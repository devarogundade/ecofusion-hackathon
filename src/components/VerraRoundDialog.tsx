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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerraRoundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  round?: any;
  onSuccess: () => void;
}

export const VerraRoundDialog = ({
  open,
  onOpenChange,
  round,
  onSuccess,
}: VerraRoundDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    round_number: round?.round_number || "",
    target_amount: round?.target_amount || "",
    achieved_amount: round?.achieved_amount || 0,
    status: round?.status || "active",
    start_date: round?.start_date
      ? new Date(round.start_date).toISOString().split("T")[0]
      : "",
    end_date: round?.end_date
      ? new Date(round.end_date).toISOString().split("T")[0]
      : "",
    is_certified: round?.is_certified || false,
    topic_id: round?.topic_id || "",
  });

  console.log(round);
  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        round_number: parseInt(formData.round_number),
        target_amount: parseFloat(formData.target_amount),
        achieved_amount: parseFloat(formData.achieved_amount.toString()),
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_certified: formData.is_certified,
        topic_id: formData.topic_id || null,
      };

      if (round) {
        const { error } = await supabase
          .from("verra_rounds")
          .update(dataToSubmit)
          .eq("id", round.id);

        if (error) throw error;
        toast.success("VERRA round updated successfully");
      } else {
        const { error } = await supabase
          .from("verra_rounds")
          .insert([dataToSubmit]);

        if (error) throw error;
        toast.success("VERRA round created successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving VERRA round:", error);
      toast.error(error.message || "Failed to save VERRA round");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {round ? "Edit VERRA Round" : "Create VERRA Round"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="round_number">Round Number *</Label>
            <Input
              id="round_number"
              type="number"
              required
              value={formData.round_number}
              onChange={(e) =>
                setFormData({ ...formData, round_number: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">Target Amount (kg CO2) *</Label>
            <Input
              id="target_amount"
              type="number"
              step="0.01"
              required
              value={formData.target_amount}
              onChange={(e) =>
                setFormData({ ...formData, target_amount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achieved_amount">Achieved Amount (kg CO2)</Label>
            <Input
              id="achieved_amount"
              type="number"
              step="0.01"
              value={formData.achieved_amount}
              onChange={(e) =>
                setFormData({ ...formData, achieved_amount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic_id">Topic ID</Label>
            <Input
              id="topic_id"
              value={formData.topic_id}
              onChange={(e) =>
                setFormData({ ...formData, topic_id: e.target.value })
              }
              placeholder="Optional Hedera topic ID"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_certified"
              checked={formData.is_certified}
              onChange={(e) =>
                setFormData({ ...formData, is_certified: e.target.checked })
              }
              className="rounded border-border"
            />
            <Label htmlFor="is_certified" className="cursor-pointer">
              Is Certified
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : round ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
