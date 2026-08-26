import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.IPINFO_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Configuration missing" },
      { status: 500 },
    );
  }

  // 1. Extract the actual user's IP from headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  let clientIp = forwardedFor?.split(",")[0].trim() || realIp?.trim() || "";

  // 2. Ignore localhost IPs (dev environment)
  if (clientIp === "::1" || clientIp === "127.0.0.1") {
    clientIp = "";
  }

  try {
    // 3. Explicitly pass the user's IP to IPInfo.
    // If clientIp is empty (like on localhost), it defaults to the server's public IP.
    const url = clientIp
      ? `https://ipinfo.io/${encodeURIComponent(clientIp)}/json?token=${token}`
      : `https://ipinfo.io/json?token=${token}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("IPInfo fetch failed");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geo Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geolocation" },
      { status: 502 },
    );
  }
}
