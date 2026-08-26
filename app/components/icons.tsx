import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function DesktopIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

// export function MobileIcon(props: IconProps) {
//   return (
//     <svg {...baseProps} {...props}>
//       <rect x="7" y="2.5" width="10" height="19" rx="2" />
//       <path d="M10.5 5h3" />
//       <path d="M11 18.5h2" />
//     </svg>
//   );
// }

export function MobileIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M10 5h4" />
      <path d="M10 19h4" />
    </svg>
  );
}

export function TranslateIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Abstract character/grammar lines on the left */}
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />

      {/* Latin 'A' on the right */}
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="9.5" cy="8.5" r="6" />
      <path d="M3.5 8.5h12" />
      <path d="M9.5 2.5c1.7 1.6 2.6 3.6 2.6 6s-.9 4.4-2.6 6" />
      <path d="M9.5 14.5V19" />
      <path d="M6.5 21h6" />
    </svg>
  );
}

// export function GlobeIcon(props: IconProps) {
//   return (
//     <svg {...baseProps} {...props}>
//       <circle cx="12" cy="12" r="10" />
//       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//       <path d="M2 12h20" />
//     </svg>
//   );
// }

export function ChartSplineIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M6 15c2.3-5.5 4.7-5.5 7-2s4.7 3.5 7-2" />
    </svg>
  );
}

export function InstallIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3v11" />
      <path d="m7 9 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function RightLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Left Arrow: Points UP */}
      <path d="M7 20 L7 4" />
      <path d="M3 8 L7 4 L11 8" />

      {/* Right Arrow: Points DOWN */}
      <path d="M17 4 L17 20" />
      <path d="M13 16 L17 20 L21 16" />
    </svg>
  );
}

export function XLogoIcon(props: IconProps) {
  return (
    <svg {...baseProps} fill="currentColor" stroke="none" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
