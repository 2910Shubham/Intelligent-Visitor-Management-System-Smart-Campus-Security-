"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  Clock,
  Timer,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface VisitData {
  visitId: string;
  status: string;
  visitorName: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  checkedInAt: string;
  expectedOut: string | null;
}

export default function GuardCheckoutPage({
  params,
}: {
  params: Promise<{ visitId: string }>;
}) {
  const { visitId } = use(params);
  const router = useRouter();
  const [visit, setVisit] = useState<VisitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  const fetchVisit = useCallback(async () => {
    try {
      const res = await fetch(`/api/visitors/${visitId}/pass`);
      const data = await res.json();
      if (res.ok) {
        setVisit(data);
      } else {
        setError(data.error || "Visit not found");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }, [visitId]);

  useEffect(() => {
    fetchVisit();
  }, [fetchVisit]);

  const handleCheckout = async () => {
    setChecking(true);
    setError("");

    try {
      const res = await fetch("/api/visits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId }),
      });
      const data = await res.json();

      if (res.ok) {
        setDone(true);
        setDuration(data.duration);
      } else {
        setError(data.message || "Checkout failed");
      }
    } catch {
      setError("Network error");
    }
    setChecking(false);
  };

  const getTimeInside = () => {
    if (!visit?.checkedInAt) return "—";
    const diff = Date.now() - new Date(visit.checkedInAt).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/guard/dashboard"
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-white">Visitor Checkout</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {!done && visit && (
          <>
            {/* Visitor Info */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {visit.visitorName}
                  </p>
                  <p className="text-xs text-emerald-400">Currently inside</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-xs">Host</span>
                  </div>
                  <p className="text-sm text-white">{visit.hostName}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">Checked In</span>
                  </div>
                  <p className="text-sm text-white">
                    {new Date(visit.checkedInAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <Timer className="w-3.5 h-3.5" />
                    <span className="text-xs">Time Inside</span>
                  </div>
                  <p className="text-sm text-emerald-400 font-semibold">
                    {getTimeInside()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">Expected Out</span>
                  </div>
                  <p className="text-sm text-white">
                    {visit.expectedOut
                      ? new Date(visit.expectedOut).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={checking}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {checking ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Checkout...
                </>
              ) : (
                <>
                  <LogOut className="w-6 h-6" />
                  Confirm Checkout
                </>
              )}
            </button>
          </>
        )}

        {/* Checkout Complete */}
        {done && (
          <div className="animate-in fade-in space-y-4">
            <div className="text-center p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Checkout Complete 👋
              </h2>
              <p className="text-blue-300/80">
                Visit duration: <strong>{duration}</strong>
              </p>
            </div>

            <Link
              href="/guard/dashboard"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
