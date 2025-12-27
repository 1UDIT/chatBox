import dbConnect from "@/lib/dbConfig/dbConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../[auth]/[...nextauth]/route";
import User from "@/Model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageid: string }> }
) {
  await dbConnect();

  // ✅ MUST await params (Next 15)
  const { messageid } = await params;
  console.log("messageid:", messageid);

  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { message: "Invalid message ID" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const result = await User.updateOne(
    { _id: dbUser._id },
    { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { message: "Message not found or already deleted" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Message deleted successfully" },
    { status: 200 }
  );
}
