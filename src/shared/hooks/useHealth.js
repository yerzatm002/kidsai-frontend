import React from "react";
import { getHealth } from "../api/health";

export function useHealth(pollMs = 20000) {
  const [health, setHealth] = React.useState({
    loading: true,
    ok: true,
    lastCheckedAt: null
  });

  const check = React.useCallback(async () => {
    try {
      const data = await getHealth();
      const ok = data?.status === "ok";
      setHealth({ loading: false, ok, lastCheckedAt: new Date() });
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setHealth({ loading: false, ok: false, lastCheckedAt: new Date() });
    }
  }, []);

  React.useEffect(() => {
    check();
    const id = setInterval(check, pollMs);
    return () => clearInterval(id);
  }, [check, pollMs]);

  return { ...health, recheck: check };
}