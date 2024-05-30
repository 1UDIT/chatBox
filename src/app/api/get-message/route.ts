import { User, getServerSession } from "next-auth";
import { authOptions } from "../[auth]/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig/dbConfig";
import mongoose from "mongoose";
import UserModel from "@/Model/User";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!user || !session) {
        return NextResponse.json(
            { message: "Not Login" },
            { status: 404 }
        )
    }
    const userId = new mongoose.Types.ObjectId(user?._id);

    try {
        const userMsg = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!userMsg || userMsg.length === 0) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: userMsg[0].messages },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.log("Get Message error", error);
        return NextResponse.json(
            { message: "error" },
            { status: 500 }
        )
    }
}