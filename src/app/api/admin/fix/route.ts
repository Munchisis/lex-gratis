import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Matter from "@/models/Matter";

export async function GET() {
  await connectDB();
  const result = await Matter.updateMany(
    { status: "unassigned", assignedLawyer: { $exists: true } },
    { $unset: { assignedLawyer: "" } },
  );
  return NextResponse.json({ fixed: result.modifiedCount });
}
