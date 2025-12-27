import { User, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig/dbConfig";
import mongoose from "mongoose";
import { authOptions } from "../[auth]/[...nextauth]/route";
import UserModel from "../[auth]/[...nextauth]/UserModel";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await UserModel.findOne({
        email: session.user.email,
    });
    if (!dbUser) {
        return NextResponse.json(
            { message: "Not Login" },
            { status: 404 }
        )
    }
    const userId = dbUser._id;

    try {
        const userMsg = await UserModel.aggregate([
            { $match: { _id: userId } },
            {
                $unwind: {
                    path: "$messages",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" },
                },
            },
        ]);

        // console.log("msgUSER", userMsg, "user", userId);

        return NextResponse.json(
            {
                messages: userMsg[0]?.messages.filter(Boolean) || [],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get Message error", error);
        return NextResponse.json(
            { message: "error" },
            { status: 500 }
        );
    }
} 