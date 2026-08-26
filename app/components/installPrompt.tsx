"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PH_EVENTS } from "@/app/lib/constants";
import { readCache, writeCache } from "@/app/lib/cache";
import { InstallIcon, XIcon } from "@/app/components/icons";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const INSTALL_DISMISS_CACHE_KEY = "install_prompt_dismissed_at";
const INSTALL_DISMISS_COOLDOWN_MINUTES = 60 * 24 * 7;

function persistDismissal() {
  writeCache<boolean>(INSTALL_DISMISS_CACHE_KEY, true);
}

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Determine platform states locally to prevent dependency loops
    const iosCheck = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsIOS(iosCheck);

    if (isStandalone) return;

    // Respect a recent dismissal instead of re-prompting on every load.
    const recentlyDismissed = readCache<boolean>(
      INSTALL_DISMISS_CACHE_KEY,
      INSTALL_DISMISS_COOLDOWN_MINUTES,
    );
    if (recentlyDismissed) return;

    // 2. Define the tracking callback using local 'iosCheck' to bypass stale state bugs
    const handleAppInstalled = () => {
      posthog.capture(PH_EVENTS.pwaInstalled, {
        platform: iosCheck ? "ios" : "web_or_android",
      });
      persistDismissal();
      setVisible(false);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 3. Evaluation logic without breaking early function cleanups
    if (iosCheck) {
      setVisible(true);
    } else {
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    }

    // 4. Guaranteed single cleanup point for all conditions
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []); // Empty dependency array ensures this setup runs exactly once on mount

  function dismiss() {
    persistDismissal();
    setVisible(false);
  }

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const choice = await prompt.userChoice;

    if (choice.outcome === "accepted") {
      setVisible(false);
    } else {
      persistDismissal();
      setVisible(false);
    }
    setPrompt(null);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
                 flex items-center gap-3 rounded-none border-2 border-black/10 dark:border-white/10
                 bg-white dark:bg-[#242424] shadow-lg px-4 py-3"
    >
      <InstallIcon className="size-7 text-[#256F5C] shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-bold leading-tight">Install Exchango</p>
        <p className="text-sm text-black/55 dark:text-gray-300 leading-tight mt-1">
          {isIOS
            ? "Tap Share → Add to Home Screen"
            : "Quick access, right from your home screen"}
        </p>
      </div>

      {!isIOS && (
        <button
          onClick={install}
          className="text-sm font-bold text-white bg-[#256F5C] px-3 py-1.5 rounded-none shrink-0
                     hover:opacity-90 transition-opacity cursor-pointer"
        >
          Install
        </button>
      )}

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-black/40 dark:text-gray-500 hover:text-black/70 dark:hover:text-gray-300 shrink-0 cursor-pointer"
      >
        <XIcon className="size-6" />
      </button>
    </div>
  );
}
