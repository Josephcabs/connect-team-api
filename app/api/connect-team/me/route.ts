// example usage
import { connecteamFetch } from "@/lib/connecteam";
import { NextResponse } from "next/server";

type MeResponse = {
  companyId: string;
  companyName: string;
  // ...etc – shape from /me endpoint
};

export async function GET() {
  const response = await connecteamFetch<MeResponse>("/me");
  return NextResponse.json(response);
}
