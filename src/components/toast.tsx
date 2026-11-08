"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TOAST_MESSAGES: Record<string, string> = {
  added: "desejo pregado no mural ✨",
  updated: "alterações salvas ✎",
  purchased: "aí sim! marcado como comprado 🎉",
  gaveup: "arquivado como \"desisti\" 💭",
  wanted: "de volta pra \"quero\" ✨",
  deleted: "removido da vitrine",
};

export function Toast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const code = searchParams.get("toast");

  const [lastCode, setLastCode] = useState(code);
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  if (code !== lastCode) {
    setLastCode(code);
    if (code && TOAST_MESSAGES[code]) {
      setMessage(TOAST_MESSAGES[code]);
      setVisible(true);
    }
  }

  useEffect(() => {
    if (!code || !TOAST_MESSAGES[code]) return;

    const params = new URLSearchParams(searchParams);
    params.delete("toast");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    const hideTimer = setTimeout(() => setVisible(false), 2600);
    const clearTimer = setTimeout(() => setMessage(null), 2900);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!message) return null;

  return (
    <div className={`toast${visible ? " toast-visible" : ""}`} role="status">
      {message}
    </div>
  );
}
