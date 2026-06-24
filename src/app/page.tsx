import Link from "next/link";
import { Scale, ShieldCheck, ArrowRight, FileText, UserCheck, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-brand-100" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none text-gray-900">
                HUMRI
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                legal aid
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Track matter
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/submit"
              className="btn btn-primary text-sm py-1.5 px-4"
            >
              Get legal help
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-brand-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600 text-brand-100 text-xs px-4 py-1.5 rounded-full mb-6 font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            Free · Confidential · Professional
          </div>
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-5 text-white">
            Justice should not depend on
            <br className="hidden md:block" /> what you can afford
          </h1>
          <p className="text-brand-200 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            HUMRI connects people facing legal challenges with qualified
            Nigerian volunteer lawyers — completely free of charge.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-brand-100 text-brand-900 font-medium px-6 py-3 rounded-lg hover:bg-white transition-colors text-sm"
            >
              Submit your matter <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 border border-brand-600 text-brand-200 px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors text-sm"
            >
              Track existing matter
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 gap-8 text-center">
          {[
            ["1,240+", "Matters resolved"],
            ["86", "Volunteer lawyers"],
            ["28", "States covered"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-semibold text-brand-700">{v}</div>
              <div className="text-sm text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-3">
            How it works
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Three simple steps between you and qualified legal help.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              step: "01",
              title: "Describe your matter",
              desc: "Fill in a short form explaining your situation. No legal jargon needed — just tell us what happened.",
            },
            {
              icon: UserCheck,
              step: "02",
              title: "Get matched to a lawyer",
              desc: "Our team reviews your submission and assigns a qualified lawyer suited to your matter within 72 hours.",
            },
            {
              icon: Scale,
              step: "03",
              title: "Receive free legal help",
              desc: "Your assigned lawyer contacts you and handles your matter — completely free of charge.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step}>
              <div className="text-xs font-mono text-brand-400 font-medium mb-3">
                {step}
              </div>
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-base font-medium mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matter types */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-xl font-medium mb-8">
            We handle matters including
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Employment disputes",
              "Wrongful termination",
              "Tenancy & landlord issues",
              "Family law & divorce",
              "Child custody",
              "Criminal defence",
              "Land & property rights",
              "Contract disputes",
              "Human rights violations",
              "Debt recovery",
              "Immigration matters",
            ].map((t) => (
              <span
                key={t}
                className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-brand-800 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-white/70" />
              <span className="text-white/60 text-sm font-medium">
                For lawyers
              </span>
            </div>
            <h2 className="text-2xl font-medium text-white mb-2">
              Volunteer your expertise
            </h2>
            <p className="text-brand-200 text-sm max-w-md leading-relaxed">
              Join our growing network of Nigerian lawyers giving back through
              pro bono work. Cases are matched to your specialisation and
              managed through a clean dashboard.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-brand-900 font-medium px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors text-sm whitespace-nowrap"
          >
            Apply to join <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>HUMRI — Pro Bono Legal Aid Nigeria</span>
          </div>
          <div className="flex gap-4">
            <Link href="/submit" className="hover:text-gray-600">
              Submit matter
            </Link>
            <Link href="/track" className="hover:text-gray-600">
              Track matter
            </Link>
            <Link href="/auth/login" className="hover:text-gray-600">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
