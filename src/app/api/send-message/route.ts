import { NextResponse } from "next/server";
import UserModel from "@/Model/User";
import dbConnect from "@/lib/dbConfig/dbConfig";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    console.log(username, "user", content)

    try {
        const user = await UserModel.findOne({ username: username });
        console.log(user, "user", username)
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages) {
            return NextResponse.json(
                { success: false, message: "User not Accepting-Messages go admin pannel" },
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() };
        user?.messages.push(newMessage);
        await user.save();

        return NextResponse.json(
            { success: true, message: "Message send " },
            { status: 201 }
        )



    } catch (error) {
        console.error('Error adding message:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }

}