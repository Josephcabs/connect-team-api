import { connecteamFetch } from "@/lib/connecteam";
import { NextResponse } from "next/server";

export async function GET() {
  const timeSheets = await connecteamFetch("/time-clock/v1/time-clocks/timeClockId/timesheet");
  return NextResponse.json(timeSheets);
}