"use server";

import { db } from "@/lib/supabase";

export type ContactState = { ok: boolean; error?: string };

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const topic = String(form.get("topic") ?? "general");
  const message = String(form.get("message") ?? "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return { ok: false, error: "Add your name, a valid email and a message of at least 10 characters." };
  }
  const { error } = await db().from("contact_messages").insert({ name, email, topic, message: message.slice(0, 5000) });
  if (error) return { ok: false, error: "Your message didn't send. Try again in a minute." };
  return { ok: true };
}
