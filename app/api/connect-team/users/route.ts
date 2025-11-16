// app/api/connecteam/users/route.ts (Next.js App Router)
import { NextResponse } from "next/server";
import { connecteamFetch } from "@/lib/connecteam";

export async function GET() {
  try {
    const users = await connecteamFetch("/users/v1/users");
    // NOTE - Retrieves all users from the Connecteam API
    return NextResponse.json(users);
  } catch (err: any) {
    console.error("Connecteam users error:", err);
    return new NextResponse("Error fetching users", { status: 500 });
  }
}
