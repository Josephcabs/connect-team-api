// app/api/connect-team/time/time-clocks/[clockId]/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.CONNECTTEAM_API_BASE_URL}/users/v1/users?limit=100&userStatus=active`,
    {
      headers: {
        "X-API-KEY": process.env.CONNECTTEAM_API_KEY!,
        Accept: "application/json",
      },
    }
  );

  const json = await res.json();
  return NextResponse.json(json.data.users);
}
