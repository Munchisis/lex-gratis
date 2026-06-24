"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SPECIALISATIONS = [
  "Employment & Labour",
  "Family Law",
  "Criminal Defence",
  "Property & Land",
  "Contract Law",
  "Human Rights",
  "Debt Recovery",
  "Immigration",
  "General Practice",
];

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    barNumber: "", specialisation: "", state: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:           form.name,
        email:          form.email,
        password:       form.password,
        barNumber:      form.barNumber,
        specialisation: form.specialisation,
        state:          form.state,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md card text-center">
          <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-xl font-medium mb-2">Application submitted</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Thank you for applying to volunteer with HUMRI. Your account is
            pending review by an admin. You will receive an email once your
            account is approved.
          </p>
          <Link
            href="/auth/login"
            className="btn btn-primary inline-flex justify-center w-full py-2.5"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-brand-800 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-brand-100" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-none">HUMRI</div>
            <div className="text-xs text-gray-400 tracking-wide uppercase mt-0.5">
              Volunteer lawyer registration
            </div>
          </div>
        </div>

        <div className="card">
          <h1 className="text-xl font-medium mb-1">
            Join as a volunteer lawyer
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your application will be reviewed by an admin before you can access
            the platform.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Full name</label>
                <input
                  className="input"
                  placeholder="Chidi Okoro"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="label">Email address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="chidi@example.com"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Min. 8 characters"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Repeat password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Professional details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">NBA bar number</label>
                  <input
                    className="input"
                    placeholder="e.g. NBA/2018/1234"
                    required
                    value={form.barNumber}
                    onChange={(e) => update("barNumber", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <select
                    className="input"
                    required
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  >
                    <option value="">Select state…</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Area of specialisation</label>
                  <select
                    className="input"
                    required
                    value={form.specialisation}
                    onChange={(e) => update("specialisation", e.target.value)}
                  >
                    <option value="">Select specialisation…</option>
                    {SPECIALISATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting
                  application…
                </>
              ) : (
                "Submit application"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-brand-600 hover:underline font-medium"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
