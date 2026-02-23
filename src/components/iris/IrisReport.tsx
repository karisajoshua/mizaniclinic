import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RotateCcw, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface IrisReportProps {
  analysis: string;
  imageUrl: string;
  onReset: () => void;
}

const IrisReport = ({ analysis, imageUrl, onReset }: IrisReportProps) => {
  const sections = parseAnalysis(analysis);

  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = 15;

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 100, 0);
      pdf.text("Mizani Clinic", margin, y);
      y += 8;
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      pdf.text("Iris Health Analysis Report", margin, y);
      y += 6;
      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 10;

      // Iris image
      try {
        pdf.addImage(imageUrl, "JPEG", margin, y, 50, 50);
        y += 55;
      } catch {
        y += 5;
      }

      // Analysis sections
      pdf.setTextColor(30, 30, 30);
      const lines = analysis.split("\n");
      for (const line of lines) {
        if (y > 270) {
          pdf.addPage();
          y = 15;
        }
        if (line.startsWith("## ")) {
          y += 4;
          pdf.setFontSize(13);
          pdf.setTextColor(0, 100, 0);
          pdf.text(line.replace("## ", ""), margin, y);
          y += 7;
          pdf.setFontSize(10);
          pdf.setTextColor(30, 30, 30);
        } else if (line.trim()) {
          const wrapped = pdf.splitTextToSize(line, contentW);
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
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      const disclaimer = "DISCLAIMER: This AI-powered iris analysis is for educational and wellness purposes only. It is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice.";
      const dLines = pdf.splitTextToSize(disclaimer, contentW);
      for (const dl of dLines) {
        pdf.text(dl, margin, y);
        y += 4;
      }

      pdf.save(`Mizani_Iris_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({ title: "PDF Downloaded", description: "Your iris analysis report has been saved." });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast({ title: "Download Failed", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-green-600" />
            Iris Analysis Report
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={downloadPDF} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button onClick={onReset} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              New Scan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Iris image thumbnail */}
          <div className="flex justify-center">
            <img src={imageUrl} alt="Analyzed iris" className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md" />
          </div>

          {/* Analysis sections */}
          {sections.map((section, i) => (
            <div key={i} className="space-y-2">
              {section.title && (
                <h3 className="text-lg font-semibold text-green-800 border-b border-green-100 pb-1">
                  {section.title}
                </h3>
              )}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
