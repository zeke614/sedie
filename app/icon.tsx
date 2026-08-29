import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#256F5C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(-35 12 12)">
        <path d="M2 12 C2 8 6 4.5 12 4.5 C18 4.5 22 8 22 12 C22 16 18 19.5 12 19.5 C6 19.5 2 16 2 12 Z" />
        <path d="M4 12 L7 10.5 L10 13.5 L13 10.5 L16 13.5 L19 10.5 L20 12" />
      </g>
    </svg>,
    { ...size },
  );
}
