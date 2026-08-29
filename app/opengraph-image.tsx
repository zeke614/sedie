import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fcfcfc",
        gap: 24,
      }}
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#256F5C"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="rotate(-35 12 12)">
          <path d="M2 12 C2 8 6 4.5 12 4.5 C18 4.5 22 8 22 12 C22 16 18 19.5 12 19.5 C6 19.5 2 16 2 12 Z" />
          <path d="M4 12 L6 10 L8 14 L10 10 L12 14 L14 10 L16 14 L18 10 L20 12" />
        </g>
      </svg>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          color: "#111",
        }}
      >
        sedie
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#666" }}>
        Real-time currency conversion, mobile-first
      </div>
    </div>,
    { ...size },
  );
}
