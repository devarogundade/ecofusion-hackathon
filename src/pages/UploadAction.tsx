import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Camera,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useIPFS } from "@/hooks/useIPFS";
import {
  AccountId,
  AccountInfoQuery,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  TokenAssociateTransaction,
  TokenId,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import { executeTransaction } from "@/services/hashconnect";
import useHashConnect from "@/hooks/useHashConnect";
import { supabase } from "@/integrations/supabase/client";
import { generateReview } from "@/services/aiService";
import { useAuth } from "@/hooks/useAuth";
import { testnetClient } from "@/services/hederaclient";

const UploadAction = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [actionType, setActionType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [actionDate, setActionDate] = useState("");

  const { upload, uploadFile } = useIPFS();
  const { accountId } = useHashConnect();
  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onImageSelect = (e: any) => {
    const files: File[] = e.target.files;
    if (files.length == 0) {
      return setFile(null);
    }
    setFile(files[0]);
  };

  const actionTypes = [
    { value: "recycling", label: "Recycling", co2: "15 kg/action" },
    { value: "solar", label: "Solar Energy Usage", co2: "50 kg/day" },
    { value: "public-transport", label: "Public Transport", co2: "8 kg/trip" },
    { value: "tree-planting", label: "Tree Planting", co2: "100 kg/tree" },
    { value: "energy-saving", label: "Energy Savings", co2: "25 kg/action" },
    { value: "composting", label: "Composting", co2: "12 kg/month" },
  ];

  const handleVerify = async () => {
    try {
      setIsVerifying(true);

      if (!accountId)
        return toast.error("Go to dashboard and Connect your wallet!.");
      if (!actionType) return toast.error("Action type must be selected!.");
      if (!description) return toast.error("Description cannot be empty!.");
      if (!location) return toast.error("Location cannot be empty!.");
      if (!file) return toast.error("File must be attached!.");

      const { url: fileUrl, mime_type: fileMimetype } = await uploadFile(file);

      const aiReview = await generateReview(
        JSON.stringify({
          actionType,
          description,
          location,
          fileUrl,
          fileMimetype,
        })
      );

      const metadataJson = JSON.stringify({
        actionType,
        description,
        location,
        aiReview,
        fileUrl,
        fileMimetype,
        accountId,
        timestampMs: Date.now(),
      });
      const metadataBase64 = btoa(unescape(encodeURIComponent(metadataJson)));

      const { url: metadataUrl } = await upload(metadataBase64);

      const accountInfoQuery = new AccountInfoQuery().setAccountId(
        AccountId.fromString(accountId)
      );

      const client = testnetClient();
      const accountInfo = await accountInfoQuery.execute(client);

      const tokenRelationship = accountInfo.tokenRelationships.get(
        TokenId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_TOKEN_ID)
      );

      if (!tokenRelationship) {
        const associateTx = new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(accountId))
          .setTokenIds([
            TokenId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_TOKEN_ID),
          ]);

        await executeTransaction(accountId, associateTx);
      }

      const tx = new ContractExecuteTransaction()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_ID)
        )
        .setFunction(
          "submit",
          new ContractFunctionParameters().addString(metadataUrl)
        )
        .setGas(5_000_000);

      await executeTransaction(accountId, tx);

      const actionIdCallQuery = new ContractCallQuery()
        .setContractId(
          ContractId.fromString(import.meta.env.VITE_ACTION_REPOSITORY_ID)
        )
        .setFunction("actionIdCounter")
        .setGas(5_000_000);

      const actionIdCall = await actionIdCallQuery.execute(client);
      const actionId = Number(actionIdCall.getUint64(0));

      const topicTx = new TopicCreateTransaction()
        .setTopicMemo(`${actionType}:Action Upload`)
        .setAdminKey(import.meta.env.VITE_OPERATOR_ID)
        .setSubmitKey(import.meta.env.VITE_OPERATOR_KEY)
        .setAutoRenewPeriod(2_592_000);

      const txResponse = await topicTx.execute(client);
      const receipt = await txResponse.getReceipt(client);

      const topicMsgTx = new TopicMessageSubmitTransaction()
        .setTopicId(receipt.topicId)
        .setMessage(
          JSON.stringify({
            actionType,
            description,
            location,
            aiReview,
            fileUrl,
            fileMimetype,
            accountId,
          })
        );

      await topicMsgTx.execute(client);

      await supabase.from("carbon_actions").insert({
        co2_impact: 0,
        user_id: user.id,
        verification_status: "pending",
        tokens_minted: 0,
        location,
        action_type: actionType,
        topic_id: receipt.topicId.toString(),
        description,
        action_date: actionDate,
        proof_url: metadataUrl,
        action_id: actionId,
      });

      toast.success(
        `
        Action submitted successfully! 
        Tokens will be minted to your wallet after review is completed. 
        Topic ID: ${receipt.topicId}
        `
      );

      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
      setIsSubmitted(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Upload Sustainable Action
            </h1>
            <p className="text-muted-foreground">
              Submit proof of your eco-friendly activities for AI verification
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Action Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="action-type">Action Type</Label>
                  <Select onValueChange={(value) => setActionType(value)}>
                    <SelectTrigger id="action-type">
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} ({type.co2})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your sustainable action in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter location"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={actionDate}
                        onChange={(e) => setActionDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="space-y-2">
                  <Label>Proof Upload</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-smooth cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex justify-center gap-4">
                        <div className="p-4 rounded-lg bg-accent/10">
                          <Upload className="w-8 h-8 text-accent" />
                        </div>
                        <div className="p-4 rounded-lg bg-accent/10">
                          <Camera className="w-8 h-8 text-accent" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          Upload photo or video proof
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files or click to browse
                        </p>
                      </div>
                      <input type="file" onChange={onImageSelect} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleVerify}
                    disabled={isVerifying || isSubmitted}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" />
                        Verifying with AI...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="mr-2" />
                        Submitted
                      </>
                    ) : (
                      "Submit for Verification"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Upload Proof</p>
                      <p className="text-sm text-muted-foreground">
                        Submit photos, videos, or documents
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">AI Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Automated verification with image recognition
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Token Minting</p>
                      <p className="text-sm text-muted-foreground">
                        Receive carbon credit tokens
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Tips for Verification</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Ensure clear, well-lit photos</li>
                    <li>• Include timestamps when possible</li>
                    <li>• Capture relevant context</li>
                    <li>• Provide accurate location data</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAction;
