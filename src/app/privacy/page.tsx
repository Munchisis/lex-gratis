import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function PrivacyPage(): React.JSX.Element {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">Last Updated: June 29, 2026</p>

          <p className="leading-relaxed">
            Welcome to HUMRI. We respect your privacy and want to protect your
            personal data. This Privacy Policy explains how we collect, use, and
            share your information when you apply and volunteer on our platform.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p>
              We collect information to review your volunteer lawyer application
              and maintain account security. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Personal details:</strong> Your full name, email
                address, and security password.
              </li>
              <li>
                <strong>Professional details:</strong> Your Supreme Court of
                Nigeria (SCN) enrollment number, primary legal specialisation,
                and jurisdiction state.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p>We use your data strictly to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Verify your status as a registered legal practitioner in
                Nigeria.
              </li>
              <li>
                Review and approve your application to access the HUMRI
                platform.
              </li>
              <li>
                Send you administrative account updates and review status
                notifications via email.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Sharing and Data Security
            </h2>
            <p>
              We do not sell, rent, or distribute your personal details to
              outside companies. Your database details are protected by modern
              encryption standards, and are only accessible by authorised
              platform administrators during the verification loop.
            </p>
          </section>

          <section className="space-y-3 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. Contact Admin
            </h2>
            <p>
              If you have questions regarding your data validation, data erasure
              requests, or account verification loops, please contact our
              support desk directly at{" "}
              <span className="text-brand-600 underline font-medium">
                support@humri.org
              </span>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
