import { NextResponse } from "next/server"; 
import dbConnect from "@/lib/dbConfig/dbConfig";

export async function GET(req: Request) {
    try {   
        await dbConnect(); 

        // return the posts
        return NextResponse.json(
            {
                totalSeason: "Connected",
            },
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    'cache-control': 'public, max-age=31536000, immutable',
                },

            });
    } catch (error: any) {
        // return the error
        return NextResponse.json({
            message: new Error(error).message,
            success: false,
        }, {
            status: 400,
        });
    }

}