import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RotateCcw, FileText, User, MapPin, Mail, Phone, Hash, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import type { ClientInfo } from "./IrisAnalysis";

interface IrisReportProps {
  analysis: string;
  imageUrl: string;
  onReset: () => void;
  clientInfo: ClientInfo;
}

const IrisReport = ({ analysis, imageUrl, onReset, clientInfo }: IrisReportProps) => {
  const sections = parseAnalysis(analysis);
  const reportDate = new Date().toLocaleString();

  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = 15;

      // Header bar
      pdf.setFillColor(0, 100, 0);
      pdf.rect(0, 0, pageW, 28, "F");
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Mizani Clinic", margin, 14);
      pdf.setFontSize(11);
      pdf.text("Iris Health Analysis Report", margin, 22);
      y = 36;

      // Client info box
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(245, 250, 245);
      pdf.roundedRect(margin, y, contentW, 38, 3, 3, "FD");
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      const col1 = margin + 4;
      const col2 = margin + contentW / 2 + 4;
      y += 8;
      pdf.setFont(undefined!, "bold");
      pdf.text("Client Information", col1, y);
      y += 7;
      pdf.setFont(undefined!, "normal");
      pdf.text(`Name: ${clientInfo.fullName}`, col1, y);
      pdf.text(`Email: ${clientInfo.email}`, col2, y);
      y += 6;
      pdf.text(`Region: ${clientInfo.region}`, col1, y);
      pdf.text(`Phone: ${clientInfo.phone || "N/A"}`, col2, y);
      y += 6;
      pdf.text(`Ambassador ID: ${clientInfo.ambassadorId}`, col1, y);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, col2, y);
      y += 15;

      // Iris image
      try {
        pdf.addImage(imageUrl, "JPEG", pageW / 2 - 20, y, 40, 40);
        y += 45;
      } catch {
        y += 5;
      }

      // Analysis sections
      pdf.setTextColor(30, 30, 30);
      const lines = analysis.split("\n");
      for (const line of lines) {
        if (y > 270) { pdf.addPage(); y = 15; }

        const clean = line.replace(/\*\*/g, "").replace(/\*/g, "");

        if (line.startsWith("## ")) {
          y += 4;
          pdf.setFontSize(13);
          pdf.setTextColor(0, 100, 0);
          pdf.setFont(undefined!, "bold");
          pdf.text(clean.replace("## ", ""), margin, y);
          y += 7;
          pdf.setFontSize(10);
          pdf.setTextColor(30, 30, 30);
          pdf.setFont(undefined!, "normal");
        } else if (clean.trim().startsWith("- ")) {
          const bullet = `  •  ${clean.trim().slice(2)}`;
          const wrapped = pdf.splitTextToSize(bullet, contentW - 6);
          for (const wl of wrapped) {
            if (y > 270) { pdf.addPage(); y = 15; }
            pdf.text(wl, margin + 3, y);
            y += 5;
          }
        } else if (clean.trim()) {
          const wrapped = pdf.splitTextToSize(clean, contentW);
          for (const wl of wrapped) {
            if (y > 270) { pdf.addPage(); y = 15; }
            pdf.text(wl, margin, y);
            y += 5;
          }
        } else {
          y += 3;
        }
      }

      // Disclaimer
      if (y > 250) { pdf.addPage(); y = 15; }
      y += 8;
      pdf.setFillColor(240, 245, 255);
      pdf.roundedRect(margin, y - 4, contentW, 18, 2, 2, "F");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 150);
      const disclaimer = "DISCLAIMER: This AI-powered iris analysis is for educational and wellness purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.";
      const dLines = pdf.splitTextToSize(disclaimer, contentW - 8);
      for (const dl of dLines) {
        pdf.text(dl, margin + 4, y);
        y += 3.5;
      }

      pdf.save(`Mizani_Iris_Report_${clientInfo.fullName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({ title: "PDF Downloaded", description: "Your iris analysis report has been saved." });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast({ title: "Download Failed", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Iris Analysis Report</h2>
              <p className="text-green-100 text-xs">{reportDate}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadPDF} size="sm" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
            <Button onClick={onReset} size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <RotateCcw className="w-4 h-4 mr-1" />
              New Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Client Info + Iris Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-0 bg-white/90 backdrop-blur-sm shadow-md">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Client Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={clientInfo.fullName} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={clientInfo.email} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Region" value={clientInfo.region} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={clientInfo.phone || "N/A"} />
              <InfoRow icon={<Hash className="w-4 h-4" />} label="Ambassador ID" value={clientInfo.ambassadorId} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Report Date" value={new Date().toLocaleDateString()} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center p-4">
          <div className="text-center">
            <img
              src={imageUrl}
              alt="Analyzed iris"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow-md mx-auto"
            />
            <p className="text-xs text-muted-foreground mt-2">Captured Iris Image</p>
          </div>
        </Card>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <Card key={i} className="border-0 bg-white/90 backdrop-blur-sm shadow-md overflow-hidden">
            {section.title && (
              <div className="bg-green-50 border-b border-green-100 px-5 py-3">
                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            <CardContent className="p-5">
              <div className="text-sm text-foreground leading-relaxed space-y-1.5">
                {renderMarkdown(section.content)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="border-0 bg-blue-50/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <p className="text-xs text-blue-700">
            <strong>⚕️ Medical Disclaimer:</strong> This AI-powered iris analysis is for educational and wellness
            purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional for
            medical advice, diagnosis, or treatment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-muted/50">
      <span className="text-green-600 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.slice(2);
      elements.push(
        <div key={i} className="flex items-start gap-2 pl-1">
          <span className="text-green-500 mt-1 shrink-0">•</span>
          <span>{formatInline(content)}</span>
        </div>
      );
    } else {
      elements.push(<p key={i}>{formatInline(line)}</p>);
    }
  }
  return elements;
}

function formatInline(text: string): React.ReactNode {
  // Split by **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function parseAnalysis(text: string) {
  const sections: { title: string; content: string }[] = [];
  const parts = text.split(/^## /m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const newlineIdx = trimmed.indexOf("\n");
    if (newlineIdx === -1) {
      sections.push({ title: trimmed, content: "" });
    } else {
      sections.push({
        title: trimmed.slice(0, newlineIdx).trim(),
        content: trimmed.slice(newlineIdx + 1).trim(),
      });
    }
  }
  return sections;
}

export default IrisReport;
