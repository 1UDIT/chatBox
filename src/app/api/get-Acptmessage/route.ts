import { User, getServerSession } from "next-auth";
import { NextResponse } from "next/server"; 
import UserModel from "@/Model/User";
import dbConnect from "@/lib/dbConfig/dbConfig";
import { authOptions } from "../[auth]/[...nextauth]/route";

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
        const dataServe = await UserModel.findById(userId);
        // console.log("dataServe", dataServe)

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