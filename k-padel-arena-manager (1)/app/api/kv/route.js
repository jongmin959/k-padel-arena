import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the
// environment automatically. These are injected by Vercel when you
// connect an Upstash Redis store from the Marketplace to this project.
const redis = Redis.fromEnv();

// A soft cap so one bad upload can't blow past Upstash's per-value limits.
const MAX_VALUE_BYTES = 3_000_000;

export async function GET(request) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "missing key" }, { status: 400 });
  }
  try {
    const value = await redis.get(key);
    if (value === null || value === undefined) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ key, value });
  } catch (e) {
    return NextResponse.json({ error: "storage error" }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { key, value } = body || {};
  if (!key || typeof value !== "string") {
    return NextResponse.json({ error: "missing key or value" }, { status: 400 });
  }
  if (value.length > MAX_VALUE_BYTES) {
    return NextResponse.json({ error: "value too large" }, { status: 413 });
  }
  try {
    await redis.set(key, value);
    return NextResponse.json({ key, value });
  } catch (e) {
    return NextResponse.json({ error: "storage error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "missing key" }, { status: 400 });
  }
  try {
    await redis.del(key);
    return NextResponse.json({ key, deleted: true });
  } catch (e) {
    return NextResponse.json({ error: "storage error" }, { status: 500 });
  }
}
