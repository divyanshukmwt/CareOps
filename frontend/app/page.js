import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-neutral-900 tracking-tight">
            CareOps
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-4">
            One platform for service operations
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
            Bookings, forms, inbox, and inventory — finally in one place
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            CareOps replaces scattered tools with a single workspace. Your team stays in sync, customers get a smooth experience, and you stay in control.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/30 transition-all"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-4">
            How CareOps works
          </h2>
          <p className="text-neutral-600 text-center max-w-xl mx-auto mb-14">
            You set up once. Customers book and message. Your team runs everything from one dashboard.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">You create your workspace</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Add your business details, set availability, and connect email or SMS. One workspace per business.</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Customers book and message</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">They use your public booking link and contact form. No login required. Confirmations and chat links go by email.</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">You run everything from one dashboard</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Inbox, bookings, forms, inventory, and alerts in one view. Add staff with clear permissions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-4">
            Everything you need to operate
          </h2>
          <p className="text-neutral-600 text-center max-w-xl mx-auto mb-14">
            No more switching between tools. One login, one workspace, one source of truth.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Bookings", desc: "Public booking page, availability, and confirmations. Link forms to appointments.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { title: "Forms", desc: "Intake and post-booking forms. Track completion and send reminders.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { title: "Inbox", desc: "All customer messages in one thread per contact. Email, SMS, and chat in one place.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { title: "Staff", desc: "Invite team members with role-based permissions. They get an email with workspace ID.", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
              { title: "Inventory", desc: "Track items and usage per booking. Low-stock alerts so you never run out.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { title: "Alerts", desc: "Missed messages, unconfirmed bookings, overdue forms. Each alert links to the right place.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
            ].map((f) => (
              <div key={f.title} className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
                <svg className="w-8 h-8 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                <h3 className="text-lg font-semibold text-neutral-900">{f.title}</h3>
                <p className="mt-2 text-neutral-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / workflow */}
      <section className="py-20 px-6 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Built for teams that care about clarity
          </h2>
          <p className="text-neutral-300 text-lg mb-10">
            One workspace per business. Clear roles for owners and staff. Customers never need to log in — they book, fill forms, and chat via links and email.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-neutral-400">
            <li>Secure & private</li>
            <li>Workspace-based</li>
            <li>No customer login</li>
            <li>Email + chat support</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Ready to simplify operations?
          </h2>
          <p className="text-neutral-600 mb-8">
            Create your workspace in minutes. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-neutral-500">© CareOps. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">Log in</Link>
            <Link href="/register" className="text-sm text-neutral-600 hover:text-neutral-900">Get started</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
