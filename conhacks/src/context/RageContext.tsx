import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type RageContextType = {
  enabled: boolean;
  toggle: () => Promise<void>;
};

const RageContext = createContext<RageContextType | null>(null);

export function RageProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    async function fetchPref() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data } = await supabase
        .from("ragebait_prefs")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (data) {
        setEnabled(data.enabled);
      }
    }

    fetchPref();
  }, []);

  async function toggle() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const newValue = !enabled;

    await supabase.from("ragebait_prefs").upsert({
      user_id: userData.user.id,
      enabled: newValue,
    });

    setEnabled(newValue);
  }

  return (
    <RageContext.Provider value={{ enabled, toggle }}>
      {children}
    </RageContext.Provider>
  );
}

export function useRage() {
  const ctx = useContext(RageContext);
  if (!ctx) throw new Error("useRage must be used inside RageProvider");
  return ctx;
}