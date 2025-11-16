import { connecteamFetch } from "@/lib/connecteam";
import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await connecteamFetch("/jobs/v1/jobs");
  return NextResponse.json(jobs);
}