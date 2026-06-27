"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Scale, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;
      
      router.push(role === "admin" ? "/admin" : "/lawyer");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <Link
            href="/"
            className="w-10 h-10 bg-brand-800 rounded-xl flex items-center justify-center"
          >
            <Scale className="w-5 h-5 text-brand-100" />
          </Link>
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 leading-none"
            >
              HumRi
            </Link>
            <div className="text-xs text-gray-400 tracking-wide uppercase mt-0.5">
              legal aid
            </div>
          </div>
        </div>

        <div className="card">
          <h1 className="text-xl font-medium text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">
            Lawyer and admin access only.{" "}
            <Link href="/submit" className="text-brand-600 hover:underline">
              Submit a matter instead →
            </Link>
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Volunteer lawyer?{" "}
          <Link
            href="/auth/register"
            className="text-brand-600 hover:underline font-medium"
          >
            Apply to join →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
