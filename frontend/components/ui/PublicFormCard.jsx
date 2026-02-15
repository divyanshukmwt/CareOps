"use client";

import React from "react";

const FieldIcon = ({ type }) => {
  if (type === "textarea") {
    return (
      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
};

export default function PublicFormCard({ form, onChange, onSubmit, responses = {}, loading = false }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-start justify-center px-4 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 p-6 sm:p-8 md:p-10 transition-shadow hover:shadow-neutral-200/60">
          <div className="flex items-start gap-3">
            <div className="flex-none w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
                {form?.title || "Form"}
              </h1>
              {form?.description && (
                <p className="mt-1.5 text-neutral-600 text-sm leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit && onSubmit();
            }}
          >
            {form?.fields?.map((field) => (
              <div key={field._id}>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                  <FieldIcon type={field.type} />
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y transition-shadow focus:shadow-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={responses[field.label] || ""}
                    onChange={(e) => onChange && onChange(field.label, e.target.value)}
                  />
                ) : (
                  <input
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:shadow-sm"
                    type={field.type || "text"}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={responses[field.label] || ""}
                    onChange={(e) => onChange && onChange(field.label, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all hover:shadow-md active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
