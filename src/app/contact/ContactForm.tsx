"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const topics = [
  { value: "general", label: "General question" },
  { value: "booking", label: "A booking or payment" },
  { value: "host", label: "I want to host a dinner" },
  { value: "report", label: "Report a listing or impersonation" },
];

export default function ContactForm({ topic, dinner }: { topic?: string; dinner?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false });
  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-line p-6">
        <h2 className="text-2xl">Message sent</h2>
        <p className="text-ink-2 mt-2">We reply within two business days.</p>
      </div>
    );
  }
  const field = "w-full rounded-lg border border-line bg-paper px-3 py-2";
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">What is this about?</span>
        <select name="topic" defaultValue={topics.some((t) => t.value === topic) ? topic : "general"} className={field}>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Your name</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          className={field}
          defaultValue={dinner ? `About dinner /d/${dinner}: ` : ""}
        />
      </label>
      {state.error && <p role="alert" className="text-sm text-wine">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-wine text-wine-ink px-6 py-3 hover:opacity-90 disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
