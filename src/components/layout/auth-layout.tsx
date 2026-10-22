import React, { ReactNode } from 'react';
import Link from 'next/link';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="lops-auth relative isolate flex min-h-dvh flex-col bg-slate-50 px-4 py-4 font-sans sm:px-6 sm:py-6">
      {/* Background Ambient Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      {/* Back to Home */}
      <Link href="/" className="relative z-10 inline-flex min-h-[44px] self-start items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white/80 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        ← Kembali ke Beranda
      </Link>

      <section className="relative z-10 my-auto w-full max-w-md self-center py-6 sm:py-8">
        {children}
      </section>
      <style>{`
        .lops-auth {
          --auth-feedback-duration: 150ms;
          --auth-step-duration: 180ms;
        }
        .lops-auth .auth-field {
          width: 100%;
          min-width: 0;
          min-height: 48px;
          font-size: 16px;
          line-height: 1.5;
          color: var(--on-surface);
          background: white;
          transition: border-color var(--auth-feedback-duration) ease-out,
            box-shadow var(--auth-feedback-duration) ease-out;
        }
        .lops-auth .auth-field::placeholder {
          color: var(--text-secondary);
          opacity: 1;
        }
        .lops-auth .auth-field:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .lops-auth a,
        .lops-auth button {
          transition: color var(--auth-feedback-duration) ease-out,
            background-color var(--auth-feedback-duration) ease-out,
            box-shadow var(--auth-feedback-duration) ease-out;
        }
        .lops-auth .glow-button {
          min-height: 48px;
          outline-color: var(--primary);
        }
        .lops-auth .glow-button:active:not(:disabled) {
          box-shadow: 0 2px 8px rgb(83 65 205 / 0.18);
        }
        .lops-auth .auth-step {
          animation: lops-auth-step-enter var(--auth-step-duration) ease-out;
        }
        .lops-auth .auth-feedback {
          overflow-wrap: anywhere;
          animation: lops-auth-feedback-enter var(--auth-feedback-duration) ease-out;
        }
        @keyframes lops-auth-step-enter {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lops-auth-feedback-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lops-auth .auth-step,
          .lops-auth .auth-feedback {
            animation: none;
          }
          .lops-auth .auth-field,
          .lops-auth a,
          .lops-auth button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
