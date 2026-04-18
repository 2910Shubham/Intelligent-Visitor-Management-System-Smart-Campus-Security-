import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Auth route placeholder. Wire this to NextAuth once auth dependencies are installed.",
    },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Auth route placeholder. Wire this to NextAuth once auth dependencies are installed.",
    },
    { status: 501 },
  );
}
