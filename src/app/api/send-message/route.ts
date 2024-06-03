import { NextResponse } from "next/server";
import UserModel, { Message } from "@/Model/User";
import dbConnect from "@/lib/dbConfig/dbConfig";

export async function POST(request: Request) {
    // const session = await getServerSession(authOptions);
    // const user: User = session?.user;
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "not login" },
                { status: 404 }
            )
        }

        if (!user.isAcceptingMessages) {
            return NextResponse.json(
                { success: false, message: "User not AcceptingMessages" },
                { status: 404 }
            )
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
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