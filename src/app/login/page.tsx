"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "não foi possível entrar.");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-stage">
      <div className="login-card">
        <div className="tape" style={{ background: "var(--tape-lilac)" }}>
          meus desejos
        </div>
        <h1>oi, Lori ✨</h1>
        <p className="tagline" style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 4 }}>
          só você entra aqui
        </p>
        <form onSubmit={handleSubmit} className="field" style={{ marginTop: 24 }}>
          <label htmlFor="password">senha</label>
          <input
            id="password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: 10 }}>
            {submitting ? "entrando…" : "entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
