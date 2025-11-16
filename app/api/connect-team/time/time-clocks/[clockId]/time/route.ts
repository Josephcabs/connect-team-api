import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ clockId: string }> }
) {
  const { clockId } = await ctx.params;

  const searchParams = req.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing startDate or endDate" },
      { status: 400 }
    );
  }

  const url = `${process.env.CONNECTTEAM_API_BASE_URL}/time-clock/v1/time-clocks/${clockId}/time-activities?startDate=${startDate}&endDate=${endDate}`;

  const res = await fetch(url, {
    headers: {
      "X-API-KEY": process.env.CONNECTTEAM_API_KEY!,
      Accept: "application/json",
    },
  });

  const json = await res.json();

  // json.data.timeActivitiesByUsers is the real payload
  const byUsers = json.data?.timeActivitiesByUsers ?? [];

  // Flatten to one row per shift
  const flat = byUsers.flatMap(
    (u: any) =>
      (u.shifts || []).map((shift: any) => ({
        id: shift.id,
        userId: u.userId,
        // raw timestamps in seconds from API
        startTimestamp: shift.start?.timestamp ?? null,
        endTimestamp: shift.end?.timestamp ?? null,
        timezone: shift.start?.timezone ?? null,
        isAutoClockOut: shift.isAutoClockOut ?? false,
      }))
  );

  return NextResponse.json(flat);
}
