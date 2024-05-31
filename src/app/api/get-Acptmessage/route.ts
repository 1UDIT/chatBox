import { User, getServerSession } from "next-auth";
import { authOptions } from "../[auth]/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/Model/User";
import dbConnect from "@/lib/dbConfig/dbConfig";

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
        const dataServe = await UserModel.findById(userId);

        if (!dataServe) {
            return NextResponse.json(
                { message: "Data Not Found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { isAcceptingMessages: dataServe?.isAcceptingMessages },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Data Not Found" },
            { status: 500 }
        )
    }
}
export async function POST(request: Request) {
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
    const { acceptMessages } = await request.json();

    try {
        const UpdatedataServe = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages }
        );

        if (!UpdatedataServe) {
            return NextResponse.json(
                { message: "Data Not Found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { UpdatedataServe },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Data Not Found" },
            { status: 500 }
        )
    }
}