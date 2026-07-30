"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SessionSnapshot } from "@/lib/game/session-service";
import { createClient } from "@/lib/supabase/client";

type RoomContextValue = {
  snapshot: SessionSnapshot | null;
  loading: boolean;
  submitting: boolean;
  unauthorized: boolean;
  offline: boolean;
  error: string;
  refresh: () => Promise<void>;
  command: (body: Record<string, unknown>) => Promise<boolean>;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ roomCode, children }: { roomCode: string; children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomCode}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401) setUnauthorized(true);
        else setError(payload.error ?? "Não foi possível sincronizar a sala.");
        return;
      }
      if (!mounted.current) return;
      setSnapshot(payload);
      setUnauthorized(false);
      setOffline(false);
      setError("");
    } catch {
      if (mounted.current) setOffline(true);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    mounted.current = true;
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 3_000);
    const onOnline = () => void refresh();
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      mounted.current = false;
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [refresh]);

  useEffect(() => {
    if (!snapshot?.sessionId) return;
    const client = createClient();
    const channel = client
      .channel(`session:${snapshot.sessionId}`)
      .on("broadcast", { event: "state_changed" }, () => void refresh())
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [refresh, snapshot?.sessionId]);

  const command = useCallback(async (body: Record<string, unknown>) => {
    if (!navigator.onLine) {
      setOffline(true);
      setError("Reconecte para confirmar esta ação.");
      return false;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/rooms/${roomCode}/commands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "A ação não foi concluída.");
        if (response.status === 409) await refresh();
        return false;
      }
      await refresh();
      return true;
    } catch {
      setOffline(true);
      setError("A conexão foi interrompida antes da confirmação.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [refresh, roomCode]);

  const value = useMemo(() => ({
    snapshot, loading, submitting, unauthorized, offline, error, refresh, command,
  }), [snapshot, loading, submitting, unauthorized, offline, error, refresh, command]);
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useRoom precisa estar dentro de RoomProvider.");
  return context;
}
