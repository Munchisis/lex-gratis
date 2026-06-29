import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Head */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <Link
            href="/auth/register"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to registration</span>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-600" />
            <span className="font-semibold text-sm tracking-wide">HUMRI</span>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
            Terms of Use
          </h1>
          <p className="text-sm text-gray-400">Last Updated: June 29, 2026</p>

          <p className="leading-relaxed">
            Welcome to HUMRI. By creating an account and applying as a volunteer
            lawyer, you agree to comply with and be bound by the following terms
            and conditions rules.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Volunteer Account Verification
            </h2>
            <p>
              Submitting this registration form does not guarantee instant
              platform access. All accounts remain strictly deactivated until
              system administrators independently verify your{" "}
              <strong>SCN Number</strong> and credentials against official
              records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Acceptable Conduct
            </h2>
            <p>As a professional user on HUMRI, you agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Provide false, inaccurate, or misleading credential identifiers.
              </li>
              <li>Share account access profiles with third-party operators.</li>
              <li>
                Use the system database infrastructure to engage in unlawful
                activities or harvest confidential data.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Limitation of Liability
            </h2>
            <p>
              HUMRI provides this network layout platform as an intermediary
              system tool. We are not liable for direct, indirect, or accidental
              damages resulting from account delays, server maintenance
              downtime, or administrative application rejection decisions.
            </p>
          </section>

          <section className="space-y-3 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these operational terms at any
              point. Continued attempts to sign in or access backend dashboards
              following updates confirms your active compliance with the
              adjusted rules.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
