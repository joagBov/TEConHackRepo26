import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { generatePersonalityProfile } from "../api/gemini";
import { getSummary, onThreshold } from "./useTracker";

export function useProfiler() {
  useEffect(() => {
    const stopListening = onThreshold(async () => {
      try {
        console.log("Profiler threshold reached");

        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user) {
          console.log("No user logged in. Profiler skipped.");
          return;
        }

        const summary = getSummary();

        const profile = await generatePersonalityProfile(summary);

        await supabase.from("personality_profiles").upsert({
          user_id: userData.user.id,
          title: profile.title,
          roast: profile.roast,
          rage_clicks: summary.rageClicks,
          mash_events: summary.mashEvents,
          avg_page_ms: summary.timeOnSiteSeconds * 1000,
          generated_at: new Date().toISOString(),
        });

        window.dispatchEvent(
          new CustomEvent("profileReady", {
            detail: {
              ...profile,
              summary,
            },
          })
        );

        console.log("Personality profile generated:", profile);
      } catch (error) {
        console.error("Profiler failed:", error);
      }
    });

    return stopListening;
  }, []);
}