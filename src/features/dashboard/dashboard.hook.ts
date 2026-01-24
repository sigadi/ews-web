"use client";

import { useEffect, useState } from "react";
import { subscribeDashboard } from "./dashboard.firebase";

export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeDashboard(d => {
      setData(d);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { data, loading };
}
