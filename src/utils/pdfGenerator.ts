import jsPDF from "jspdf";

interface CertificateData {
  buyerName: string;
  tokensAmount: number;
  co2Offset: number;
  transactionHash: string;
  certificateId: string;
  purchaseDate: string;
}

export const generateCertificate = (data: CertificateData) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Background
  doc.setFillColor(2, 16, 7);
  doc.rect(0, 0, 297, 210, "F");

  // Border
  doc.setDrawColor(90, 164, 39);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Title
  doc.setTextColor(248, 248, 248);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("CARBON OFFSET CERTIFICATE", 148.5, 40, { align: "center" });

  // EcoFusion Logo Text
  doc.setFontSize(24);
  doc.text("EcoFusion", 148.5, 55, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("Hedera Blockchain Verified Carbon Credit", 148.5, 65, { align: "center" });

  // Certificate Body
  doc.setFontSize(12);
  doc.setTextColor(248, 248, 248);
  
  // Recipient
  doc.setFont("helvetica", "normal");
  doc.text("This certificate is awarded to:", 148.5, 85, { align: "center" });
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.buyerName, 148.5, 95, { align: "center" });

  // Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("for offsetting:", 148.5, 110, { align: "center" });
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(90, 164, 39);
  doc.text(`${data.co2Offset.toFixed(2)} tons CO₂`, 148.5, 122, { align: "center" });

  // Token Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(`Carbon Tokens: ${data.tokensAmount.toLocaleString()}`, 148.5, 135, { align: "center" });

  // Certificate Details Box
  doc.setDrawColor(65, 76, 68);
  doc.setLineWidth(0.5);
  doc.rect(30, 145, 237, 35);

  doc.setFontSize(9);
  doc.setTextColor(248, 248, 248);
  
  const leftCol = 40;
  const rightCol = 160;
  const row1 = 155;
  const row2 = 165;
  const row3 = 175;

  doc.setFont("helvetica", "bold");
  doc.text("Certificate ID:", leftCol, row1);
  doc.text("Transaction Hash:", leftCol, row2);
  doc.text("Issue Date:", leftCol, row3);

  doc.setFont("helvetica", "normal");
  doc.text(data.certificateId, leftCol + 35, row1);
  doc.text(data.transactionHash.substring(0, 40) + "...", leftCol + 35, row2);
  doc.text(data.purchaseDate, leftCol + 35, row3);

  doc.setFont("helvetica", "bold");
  doc.text("Blockchain:", rightCol, row1);
  doc.text("Standard:", rightCol, row2);
  doc.text("Status:", rightCol, row3);

  doc.setFont("helvetica", "normal");
  doc.text("Hedera Hashgraph", rightCol + 25, row1);
  doc.text("VERRA Certified", rightCol + 25, row2);
  doc.setTextColor(90, 164, 39);
  doc.text("VERIFIED", rightCol + 25, row3);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text("This certificate represents verified carbon offset tokens on the Hedera blockchain.", 148.5, 195, { align: "center" });
  doc.text("Visit ecofusion.app to verify authenticity", 148.5, 200, { align: "center" });

  // Save
  doc.save(`EcoFusion_Certificate_${data.certificateId}.pdf`);
};
