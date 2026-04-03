"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStep("otp");
    setMessage("Check your email for the code.");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/members");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-semibold">Member login</h1>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-6 space-y-4">
          <input
            type="text"
            required
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  );
}