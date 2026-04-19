"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Scan,
  Users,
  Clock,
  AlertTriangle,
  LogOut,
  RefreshCw,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  Loader2,
  Keyboard,
} from "lucide-react";

interface ActiveVisitor {
  visitId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  checkedInAt: string;
  expectedOut: string | null;
  isOverstayed: boolean;
  status: string;
}

export default function GuardDashboard() {
  const { data: session } = useSession();
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch("/api/visits/active");
      const data = await res.json();
      setActiveVisitors(data.activeVisitors || []);
      setCount(data.count || 0);
      setLastRefresh(new Date());
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActive();
    const interval = setInterval(fetchActive, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [fetchActive]);

  const overstayedCount = activeVisitors.filter((v) => v.isOverstayed).length;

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTimeInside = (checkedInAt: string) => {
    const diff = Date.now() - new Date(checkedInAt).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Guard Portal</h1>
              <p className="text-xs text-slate-500">
                {session?.user?.name || "Guard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchActive}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/guard/login" })}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/guard/scan"
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Scan className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Scan QR</span>
          </Link>
          <Link
            href="/guard/manual"
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Keyboard className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Manual Entry</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-xs text-slate-500">Inside Now</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-400">{overstayedCount}</p>
            <p className="text-xs text-slate-500">Overstayed</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Activity className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {lastRefresh.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-slate-500">Last Sync</p>
          </div>
        </div>

        {/* Active Visitors List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Active Visitors
            </h2>
            <span className="text-xs text-slate-500">
              Auto-refreshes every 10s
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
          ) : activeVisitors.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-medium">No Active Visitors</p>
              <p className="text-sm text-slate-500">Campus is clear</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeVisitors.map((visitor) => (
                <div
                  key={visitor.visitId}
                  className={`p-4 rounded-2xl border transition-all ${
                    visitor.isOverstayed
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">
                        {visitor.visitorName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {visitor.visitorPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {visitor.isOverstayed && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-amber-400 bg-amber-500/10 rounded-full">
                          OVERSTAY
                        </span>
                      )}
                      <Link
                        href={`/guard/checkout/${visitor.visitId}`}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-600">Host: </span>
                      {visitor.hostName}
                    </div>
                    <div>
                      <span className="text-slate-600">Purpose: </span>
                      {visitor.purpose}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      In at {formatTime(visitor.checkedInAt)}
                    </div>
                    <div>
                      <span className="text-slate-600">Inside: </span>
                      <span
                        className={
                          visitor.isOverstayed
                            ? "text-amber-400 font-semibold"
                            : "text-emerald-400"
                        }
                      >
                        {getTimeInside(visitor.checkedInAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
