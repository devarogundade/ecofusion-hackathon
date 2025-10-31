/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApproveActionDialog } from "@/components/ApproveActionDialog";
import { toast } from "sonner";

const Admin = () => {
  const { isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [actions, setActions] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, authLoading, adminLoading, navigate]);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from("carbon_actions")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error("Error fetching actions:", error);
      toast.error("Failed to load actions");
    }
  };

  useEffect(() => {
    if (isAdmin && !authLoading && !adminLoading) {
      fetchActions();
    }
  }, [isAdmin, authLoading, adminLoading]);

  const handleReviewAction = (action: any) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Review and approve pending carbon actions
            </p>
          </div>

          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No pending actions to review
                    </TableCell>
                  </TableRow>
                ) : (
                  actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        {new Date(action.action_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {action.action_type.replace("_", " ")}
                      </TableCell>
                      <TableCell>{action.description}</TableCell>
                      <TableCell>{action.location || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {action.verification_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleReviewAction(action)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {selectedAction && (
        <ApproveActionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          action={selectedAction}
          onSuccess={fetchActions}
        />
      )}
    </div>
  );
};

export default Admin;
