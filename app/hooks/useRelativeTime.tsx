"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RELATIVE_TIME_REFRESH_MS } from "@/app/lib/constants";

export function useRelativeTime(lastUpdated: Date | null): string {
  const { t } = useTranslation();
  const [relativeTime, setRelativeTime] = useState("");

  function format(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return t("updated.relative.seconds", { count: seconds });

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t("updated.relative.minutes", { count: minutes });

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("updated.relative.hours", { count: hours });

    return t("updated.relative.days", { count: Math.floor(hours / 24) });
  }

  useEffect(() => {
    if (!lastUpdated) {
      setRelativeTime("");
      return;
    }

    setRelativeTime(format(lastUpdated));
    const interval = setInterval(
      () => setRelativeTime(format(lastUpdated)),
      RELATIVE_TIME_REFRESH_MS,
    );
    return () => clearInterval(interval);
  }, [lastUpdated, t]);

  return relativeTime;
}
