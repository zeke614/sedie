"use client";

import { useTranslation } from "react-i18next";
import { XLogoIcon, InstagramIcon, GithubIcon } from "@/app/components/icons";

type SocialLink = {
  label: string;
  href: string;
  Icon: React.ElementType;
};

const socialLinks: SocialLink[] = [
  { label: "X / Twitter", href: "https://x.com/devZeke146", Icon: XLogoIcon },
  {
    label: "Instagram",
    href: "https://instagram.com/zeke.146/",
    Icon: InstagramIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/zeke614/exchango.git",
    Icon: GithubIcon,
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-0">
        <div className="border-t border-[1.5px] border-black/6 dark:border-white/6"></div>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr] gap-10 sm:gap-4 py-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h2 className="text-lg font-bold leading-none">
              exchan<span className="text-[#256F5C]">go</span>
            </h2>
            <p className="text-black/60 dark:text-gray-300 leading-relaxed whitespace-pre-line max-w-[22ch] md:max-w-none">
              {t("footer.value")}
            </p>
          </div>

          <div className="flex flex-col text-center items-center space-y-2">
            <h3 className="font-bold text-[17px]">{t("footer.links.title")}</h3>
            <ul className="space-y-1.5 text-black/60 dark:text-gray-300">
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-[#256F5C] transition-colors duration-150"
                >
                  {t("footer.links.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#converter"
                  className="hover:text-[#256F5C] transition-colors duration-150"
                >
                  {t("footer.links.converter")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:ezekielarkohamissah@gmail.com"
                  className="hover:text-[#256F5C] transition-colors duration-150"
                >
                  {t("footer.links.contact")}
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden sm:flex ml-4 text-black/60 dark:text-gray-300 whitespace-pre-line">
            {t("footer.disclaimer")}
          </div>
        </div>

        <div className="flex sm:hidden items-center justify-center text-center pb-10 text-black/60 dark:text-gray-300 px-4 whitespace-pre-line">
          {t("footer.disclaimer")}
        </div>

        <div className="border-t border-[1.5px] border-black/6 dark:border-white/6"></div>

        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-black/60 dark:text-gray-300">
          <div className="flex sm:hidden items-center gap-0">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label} page`}
                className="w-10 h-10 flex items-center justify-center text-black/50 dark:text-gray-400 hover:text-[#256F5C] hover:bg-[#256F5C]/8 transition-all duration-200 ease-out
                 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg hover:rotate-[-4deg]
                 active:translate-x-0 active:translate-y-0 active:shadow-none active:rotate-0"
              >
                <Icon className="size-[1.1875rem]" />
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <p className="flex items-center gap-1.5">
              <span className="text-[15px] text-black/60 dark:text-gray-300">
                &copy; {new Date().getFullYear()}
              </span>
              <span className="font-bold text-black dark:text-white">
                exchan<span className="text-[#256F5C]">go</span>
              </span>
            </p>
            ·
            <p>
              {t("footer.builder")}
              <a
                href="https://github.com/zeke614"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-black dark:text-white ml-1 underline underline-offset-2"
              >
                Ezekiel
              </a>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-0">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label} page`}
                className="w-10 h-10 flex items-center justify-center text-black/50 dark:text-gray-400 hover:text-[#256F5C] hover:bg-[#256F5C]/8 transition-all duration-200 ease-out
                 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg hover:rotate-[-4deg]
                 active:translate-x-0 active:translate-y-0 active:shadow-none active:rotate-0"
              >
                <Icon className="size-[1.1875rem]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
