import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Search, Download, User, MapPin, Mail, Phone, Hash, Calendar, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface IrisRecord {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_region: string | null;
  ambassador_id: string | null;
  image_url: string | null;
  analysis_text: string;
  created_at: string;
}

const AdminIrisReports = () => {
  const [records, setRecords] = useState<IrisRecord[]>([]);
  const [filtered, setFiltered] = useState<IrisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IrisRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(records);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        records.filter(
          (r) =>
            r.client_name.toLowerCase().includes(q) ||
            r.client_email?.toLowerCase().includes(q) ||
            r.ambassador_id?.toLowerCase().includes(q) ||
            r.client_region?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, records]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("iris_analyses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching iris analyses:", error);
      toast({ title: "Error", description: "Failed to load iris reports.", variant: "destructive" });
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const downloadPDF = (record: IrisRecord) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = 15;

      // Header
      pdf.setFillColor(0, 100, 0);
      pdf.rect(0, 0, pageW, 28, "F");
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Mizani Clinic", margin, 14);
      pdf.setFontSize(11);
      pdf.text("Iris Health Analysis Report — Admin Copy", margin, 22);
      y = 36;

      // Client info
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
      pdf.text(`Name: ${record.client_name}`, col1, y);
      pdf.text(`Email: ${record.client_email || "N/A"}`, col2, y);
      y += 6;
      pdf.text(`Region: ${record.client_region || "N/A"}`, col1, y);
      pdf.text(`Phone: ${record.client_phone || "N/A"}`, col2, y);
      y += 6;
      pdf.text(`Ambassador ID: ${record.ambassador_id || "N/A"}`, col1, y);
      pdf.text(`Date: ${new Date(record.created_at).toLocaleDateString()}`, col2, y);
      y += 15;

      // Iris image
      if (record.image_url) {
        try {
          pdf.addImage(record.image_url, "JPEG", pageW / 2 - 20, y, 40, 40);
          y += 45;
        } catch {
          y += 5;
        }
      }

      // Analysis
      pdf.setTextColor(30, 30, 30);
      const lines = record.analysis_text.split("\n");
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

      pdf.save(`Mizani_Iris_${record.client_name.replace(/\s+/g, "_")}_${new Date(record.created_at).toISOString().split("T")[0]}.pdf`);
      toast({ title: "PDF Downloaded" });
    } catch (err) {
      console.error("PDF error:", err);
      toast({ title: "Download Failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-green-400" />
            Iris Analysis Reports
          </h2>
          <p className="text-slate-400 text-sm">{records.length} total reports</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Region</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Ambassador ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No iris reports found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.image_url ? (
                          <img src={r.image_url} alt="" className="w-8 h-8 rounded-full object-cover border border-green-500/40" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <span className="text-white font-medium">{r.client_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{r.client_email || "—"}</td>
                    <td className="px-4 py-3 text-slate-300 hidden lg:table-cell">{r.client_region || "—"}</td>
                    <td className="px-4 py-3 text-slate-300 hidden lg:table-cell font-mono text-xs">{r.ambassador_id || "—"}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={() => setSelected(r)}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-slate-700" onClick={() => downloadPDF(r)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5 text-green-400" />
                  Iris Report — {selected.client_name}
                </DialogTitle>
              </DialogHeader>

              {/* Client info grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <InfoCell icon={<User className="w-4 h-4" />} label="Full Name" value={selected.client_name} />
                <InfoCell icon={<Mail className="w-4 h-4" />} label="Email" value={selected.client_email || "N/A"} />
                <InfoCell icon={<MapPin className="w-4 h-4" />} label="Region" value={selected.client_region || "N/A"} />
                <InfoCell icon={<Phone className="w-4 h-4" />} label="Phone" value={selected.client_phone || "N/A"} />
                <InfoCell icon={<Hash className="w-4 h-4" />} label="Ambassador ID" value={selected.ambassador_id || "N/A"} />
                <InfoCell icon={<Calendar className="w-4 h-4" />} label="Date" value={new Date(selected.created_at).toLocaleString()} />
              </div>

              {/* Iris image */}
              {selected.image_url && (
                <div className="flex justify-center my-4">
                  <img src={selected.image_url} alt="Iris" className="w-32 h-32 rounded-full object-cover border-4 border-green-500/30" />
                </div>
              )}

              {/* Analysis text - properly rendered */}
              <div className="space-y-3 mt-2">
                {parseAnalysis(selected.analysis_text).map((section, i) => (
                  <div key={i}>
                    {section.title && (
                      <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-1">{section.title}</h3>
                    )}
                    <div className="text-sm text-slate-300 leading-relaxed space-y-1">
                      {renderMarkdown(section.content)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => downloadPDF(selected)}>
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
      <span className="text-green-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase">{label}</p>
        <p className="text-sm text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function parseAnalysis(text: string) {
  const sections: { title: string; content: string }[] = [];
  const parts = text.split(/^## /m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const nl = trimmed.indexOf("\n");
    if (nl === -1) sections.push({ title: trimmed, content: "" });
    else sections.push({ title: trimmed.slice(0, nl).trim(), content: trimmed.slice(nl + 1).trim() });
  }
  return sections;
}

function renderMarkdown(text: string) {
  if (!text) return null;
  return text.split("\n").filter(Boolean).map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <div key={i} className="flex items-start gap-2 pl-1">
          <span className="text-green-400 mt-0.5 shrink-0">•</span>
          <span>{formatInline(trimmed.slice(2))}</span>
        </div>
      );
    }
    return <p key={i}>{formatInline(trimmed)}</p>;
  });
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    return part;
  });
}

export default AdminIrisReports;
