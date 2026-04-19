"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Camera,
  Scan,
  User,
  Building2,
  Clock,
} from "lucide-react";

type ScanResult =
  | { type: "success"; data: Record<string, unknown> }
  | { type: "error"; message: string; code?: number }
  | null;

export default function GuardScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<unknown>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const handleScan = useCallback(
    async (token: string) => {
      if (processing) return;
      setProcessing(true);

      try {
        const res = await fetch("/api/visits/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok) {
          setResult({ type: "success", data });
          // Stop scanner on success
          if (scannerRef.current) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (scannerRef.current as any).stop();
            } catch {
              // ignore
            }
          }
          setScanning(false);
        } else {
          setResult({
            type: "error",
            message: data.message || data.error || "Check-in failed",
            code: res.status,
          });
        }
      } catch {
        setResult({ type: "error", message: "Network error. Please try again." });
      }
      setProcessing(false);
    },
    [processing]
  );

  const startScanner = useCallback(async () => {
    setResult(null);
    setCameraError("");
    setScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {
          // ignore scan failures (normal during scanning)
        }
      );
    } catch (err) {
      setCameraError(
        "Camera access denied or not available. Please allow camera permission."
      );
      setScanning(false);
      console.error("Scanner error:", err);
    }
  }, [handleScan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (scannerRef.current as any).stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const resetAndScanAgain = async () => {
    setResult(null);
    setCameraError("");
    startScanner();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/guard/dashboard"
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            QR Scanner
          </h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Scanner Area */}
        {!result && (
          <div className="space-y-4">
            {!scanning ? (
              <div className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center">
                  <Camera className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-6">
                    Point camera at visitor&apos;s QR code
                  </p>
                  <button
                    onClick={startScanner}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    Start Camera
                  </button>
                </div>

                {cameraError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {cameraError}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div
                  id="qr-reader"
                  ref={videoRef}
                  className="rounded-2xl overflow-hidden border-2 border-emerald-500/30"
                />
                {processing && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm">Processing...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Success Result */}
        {result?.type === "success" && (
          <div className="animate-in fade-in space-y-4">
            <div className="text-center p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Check-in Successful! ✅
              </h2>
              <p className="text-emerald-300/80">Visitor has been checked in</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Visitor</p>
                  <p className="text-white font-medium">
                    {result.data.visitorName as string}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Host</p>
                  <p className="text-white font-medium">
                    {result.data.hostName as string} — {result.data.hostDepartment as string}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Expected Out</p>
                  <p className="text-white font-medium">
                    {result.data.expectedOut
                      ? new Date(
                          result.data.expectedOut as string
                        ).toLocaleTimeString("en-IN")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={resetAndScanAgain}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-medium"
              >
                <Scan className="w-4 h-4" />
                Scan Next
              </button>
              <Link
                href="/guard/dashboard"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Error Result */}
        {result?.type === "error" && (
          <div className="animate-in fade-in space-y-4">
            <div className="text-center p-8 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                {result.code === 403 ? (
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {result.code === 403
                  ? "⛔ Access Denied"
                  : result.code === 409
                  ? "⚠️ Already Checked In"
                  : "❌ Check-in Failed"}
              </h2>
              <p className="text-red-300/80">{result.message}</p>
            </div>

            <button
              onClick={resetAndScanAgain}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Scan className="w-5 h-5" />
              Scan Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
