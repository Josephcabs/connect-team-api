// app/api/connect-team/time/time-clocks/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.CONNECTTEAM_API_BASE_URL}/time-clock/v1/time-clocks`,
    {
      headers: {
        "X-API-KEY": process.env.CONNECTTEAM_API_KEY!,
        Accept: "application/json",
      },
    }
  );

  const json = await res.json();
  return NextResponse.json(json.data.timeClocks);
}
