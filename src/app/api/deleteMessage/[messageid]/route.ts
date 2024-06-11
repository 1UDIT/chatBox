import dbConnect from "@/lib/dbConfig/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[auth]/[...nextauth]/options";
import UserModel, { User } from "@/Model/User";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userLogin: User = session?.user
    const messageId = params.messageid;
    if (!userLogin || !session) {
        return NextResponse.json(
            { msg: "Not Login" },
            { status: 401 }
        )
    }

    try {
        const UpdateApi = await UserModel.updateOne(
            { _id: userLogin._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (UpdateApi.modifiedCount === 0) {
            return NextResponse.json(
                { message: "Message not found or already deleted" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "deleted" },
            { status: 202 }
        )

    } catch (error) {
        console.log("Get Message error", error);
        return NextResponse.json(
            { message: "error" },
            { status: 500 }
        )
    }
}