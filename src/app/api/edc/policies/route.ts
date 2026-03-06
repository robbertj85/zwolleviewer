import { NextRequest, NextResponse } from "next/server";
import { edcPolicies } from "@/lib/edc-client";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    const policies = await edcPolicies.list(offset, limit);
    return NextResponse.json(policies);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list policies";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await edcPolicies.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create policy";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
