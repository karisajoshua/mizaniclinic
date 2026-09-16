import { errorMessage } from '@/lib/reporting';
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Loader2, RotateCcw, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import IrisReport from "./IrisReport";

export interface ClientInfo {
  fullName: string;
  region: string;
  ambassadorId: string;
  email: string;
  phone: string;
}

interface IrisAnalysisProps {
  clientInfo: ClientInfo;
}

const IrisAnalysis = ({ clientInfo }: IrisAnalysisProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      // Show the preview first so the <video> element is mounted,
      // then attach the stream in the effect below.
      setIsCameraOpen(true);
    } catch {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please use the upload option instead.",
        variant: "destructive",
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  // Attach the stream once the video element exists, and start playback.
  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!isCameraOpen || !video || !stream) return;

    video.srcObject = stream;
    video.muted = true;
    video.setAttribute("playsinline", "true");
    const play = async () => {
      try {
        await video.play();
      } catch {
        /* autoplay can be interrupted; the user can retry */
      }
    };
    if (video.readyState >= 1) {
      play();
    } else {
      video.onloadedmetadata = play;
    }

    return () => {
      video.onloadedmetadata = null;
    };
  }, [isCameraOpen]);

  // Always release the camera when leaving the screen.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setImageBase64(dataUrl.split(",")[1]);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCapturedImage(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyzeIris = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-iris", {
        body: { imageBase64 },
      });

      if (error) throw new Error(error.message || "Analysis failed");
      if (data?.error) throw new Error(data.error);

      setAnalysisResult(data.analysis);

      // Save to database
      const { error: saveError } = await supabase.from("iris_analyses").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        client_name: clientInfo.fullName,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_region: clientInfo.region,
        ambassador_id: clientInfo.ambassadorId,
        image_url: capturedImage,
        analysis_text: data.analysis,
      });
      if (saveError) console.error("Failed to save iris analysis:", saveError);

      toast({ title: "Analysis Complete", description: "Your iris analysis report is ready." });
    } catch (err: unknown) {
      console.error("Iris analysis error:", err);
      toast({
        title: "Analysis Failed",
        description: errorMessage(err, "Could not analyze the image. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setImageBase64(null);
    setAnalysisResult(null);
    stopCamera();
  };

  if (analysisResult && capturedImage) {
    return <IrisReport analysis={analysisResult} imageUrl={capturedImage} onReset={reset} clientInfo={clientInfo} />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Eye className="w-6 h-6 text-green-600" />
            Iris Health Analysis
          </CardTitle>
          <CardDescription>
            Capture or upload a high-definition photo of your eye's iris for AI-powered health analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!capturedImage ? (
            <>
              {isCameraOpen ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-4 border-green-400/60 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="h-32 flex flex-col items-center gap-3 border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50"
                  >
                    <Camera className="w-10 h-10 text-green-600" />
                    <span className="text-sm font-medium">Open Camera</span>
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="h-32 flex flex-col items-center gap-3 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <Upload className="w-10 h-10 text-blue-600" />
                    <span className="text-sm font-medium">Upload Photo</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 text-sm mb-1">📸 Tips for best results:</h4>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Use good lighting — natural light works best</li>
                  <li>• Hold the camera 10-15cm from your eye</li>
                  <li>• Keep your eye wide open and focused</li>
                  <li>• Ensure the iris fills most of the frame</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <img src={capturedImage} alt="Captured iris" className="w-full max-h-80 object-contain" />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={analyzeIris}
                  disabled={isAnalyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Analyze Iris
                    </>
                  )}
                </Button>
                <Button onClick={reset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

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

export default IrisAnalysis;
