"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import countriesData from "@/app/lib/data";
import {
  CheckIcon,
  ChevronDownIcon,
  DesktopIcon,
  GlobeIcon,
  MobileIcon,
  MoonIcon,
  SunIcon,
  TranslateIcon,
} from "@/app/components/icons";

const themes = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System" },
];

export default function Header() {
  const { t, i18n } = useTranslation();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageOverlay, setShowLanguageOverlay] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Safely tell the component we are on the client — also gates the
  // language-overlay portal below, since document.body isn't available
  // during SSR and createPortal would throw if called too early.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const updateDeviceIcon = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mobileQuery.matches);
    };

    updateDeviceIcon();
    mobileQuery.addEventListener("change", updateDeviceIcon);

    // Keep the System icon synchronized if the viewport changes after mount.
    return () => mobileQuery.removeEventListener("change", updateDeviceIcon);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowThemeDropdown(false);
      }
    }

    if (showDropdown || showThemeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showThemeDropdown]);

  useEffect(() => {
    return () => {
      if (languageTimerRef.current) {
        clearTimeout(languageTimerRef.current);
      }
    };
  }, []);

  const changeLanguage = (lang: string) => {
    if (languageTimerRef.current) {
      clearTimeout(languageTimerRef.current);
    }

    setShowLanguageOverlay(true);

    languageTimerRef.current = setTimeout(() => {
      i18n.changeLanguage(lang);
      setShowLanguageOverlay(false);
      setShowDropdown(false);
      languageTimerRef.current = null;
    }, 1000);
  };

  const CurrentThemeIcon = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case "light":
        return SunIcon;
      case "dark":
        return MoonIcon;
      default:
        return isMobile ? MobileIcon : DesktopIcon;
    }
  };

  const ThemeIcon = CurrentThemeIcon(theme);

  return (
    <>
      {/* Language Overlay — portaled to document.body, NOT rendered
          inline in the header tree. page.tsx's sticky wrapper carries
          `backdrop-blur-lg`, and `backdrop-filter` on an ancestor
          creates a new containing block for any `fixed` descendant —
          so a fixed inset-0 overlay left inline here would resolve
          against that wrapper's box (header-height only) instead of
          the viewport. Portaling escapes that ancestor chain entirely,
          so this stays correct regardless of what styling the wrapper
          picks up in the future. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showLanguageOverlay && (
              <motion.div
                key="language-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 z-100 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md"
              >
                <TranslateIcon className="size-9 text-[#256F5C] animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <header className="w-full mx-auto max-w-3xl px-5 sm:px-8 lg:px-0">
        <div className="flex items-center justify-between h-15">
          <a href="/" className="text-lg font-bold leading-none">
            exchan<span className="text-[#256F5C]">go</span>
          </a>

          <div className="flex items-center gap-4">
            <div className="relative" ref={themeDropdownRef}>
              {mounted ? (
                <button
                  aria-label="Change Theme"
                  className="flex items-center gap-1 font-bold uppercase cursor-pointer transition-colors duration-150"
                  onClick={() => {
                    setShowThemeDropdown(!showThemeDropdown);
                    setShowDropdown(false);
                  }}
                >
                  <ThemeIcon className="size-4" />
                  <ChevronDownIcon
                    className={`size-4 transition-transform duration-200 ${showThemeDropdown ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <div className="w-8.5 h-5 rounded-none bg-black/5 dark:bg-white/5 animate-pulse"></div>
              )}

              <AnimatePresence>
                {showThemeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute right-0 top-8 w-38 border-2 border-black/8 dark:border-white/8 bg-white dark:bg-[#242424] rounded-none p-1.5 shadow-lg z-10"
                  >
                    <ul className="text-[0.9375rem] space-y-0.5">
                      {themes.map(({ value, label, Icon }) => {
                        const ThemeOptionIcon =
                          value === "system"
                            ? isMobile
                              ? MobileIcon
                              : DesktopIcon
                            : Icon;

                        return (
                          <li key={value}>
                            <button
                              onClick={() => {
                                setTheme(value);
                                setShowThemeDropdown(false);
                              }}
                              className="w-full flex items-center justify-between px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-none transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                {ThemeOptionIcon && (
                                  <ThemeOptionIcon className="size-4" />
                                )}
                                <span>{label}</span>
                              </div>
                              {mounted && theme === value && (
                                <CheckIcon className="size-4 text-[#256F5C]" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                aria-label={t("aria.changeLanguage")}
                className="flex items-center gap-1 text-sm font-bold uppercase cursor-pointer transition-colors duration-150"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowThemeDropdown(false);
                }}
              >
                <GlobeIcon className="size-4" />
                <span>{i18n.language}</span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute right-0 top-8 w-42 border-2 border-black/8 dark:border-white/8 bg-white dark:bg-[#242424] rounded-none py-3 px-1.5 shadow-lg z-10"
                  >
                    <p className="font-bold text-[0.9375rem] mb-2 px-1">
                      {t("language.title")}
                    </p>
                    <ul className="text-[0.9375rem] space-y-0.5">
                      {countriesData.languages.map(({ code, label }) => (
                        <li key={code}>
                          <button
                            onClick={() => changeLanguage(code)}
                            className="w-full flex items-center justify-between px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-none transition-colors cursor-pointer"
                          >
                            <span>{label}</span>
                            {i18n.language === code && (
                              <CheckIcon className="size-4 text-[#256F5C]" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="border-t border-[1.5px] border-black/6 dark:border-white/6"></div>
      </header>
    </>
  );
}
