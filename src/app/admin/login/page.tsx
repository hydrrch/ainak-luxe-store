"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Glasses } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Authentication failed.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-gray-950 p-8 rounded-3xl border border-gray-800 text-white shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-xs text-gray-400">
            Sign in with administrative privileges to manage inventory, catalog & customer orders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ainakluxe.pk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Access Control Center"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-[11px] text-gray-400 space-y-1">
          <p className="font-semibold text-gold-400">Default Seeded Admin Credentials:</p>
          <p>Email: <code>admin@ainakluxe.pk</code></p>
          <p>Password: <code>Admin123!@#</code></p>
        </div>
      </div>
    </div>
  );
}
