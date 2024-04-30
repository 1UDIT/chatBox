"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function page({ params }: { params: { Username: string } }) {
    const [AcptMsg, setAcptMsg] = useState<boolean>(false);
    const CopyUrl = typeof window !== "undefined" ? (`${window.location.origin}/${params.Username}`) : '';
    const pathname = usePathname();
    const passwordRef = useRef(null)

    const toggle = () => {
        switch (AcptMsg) {
            case false:
                return (
                    "Off"
                )
            case true:
                return (
                    "On"
                )
            default:
                break;
        }
    }

    const copyPasswordToClipboard = () => {
        window.navigator.clipboard.writeText(CopyUrl)
    }

    return (
        <main className="flex min-h-screen flex-col justify-between py-5 px-5">
            <div className="grid grid-rows-4">
                <span className="text-2xl font-bold">User Dashbord</span>
                <div className="grid grid-rows-2 px-2 py-2">
                    <span className="text-xl">Copy Your Unique Link</span>
                    <div className="grid grid-cols-2">
                        <span>
                            <Input
                                value={CopyUrl}
                                ref={passwordRef}
                                readOnly
                            />
                        </span>
                        <span className="pl-2"><Button variant="destructive" onClick={() => copyPasswordToClipboard()}>copy</Button></span>
                    </div>
                </div>
                <span className="text-xl"><Switch checked={AcptMsg} onCheckedChange={() => setAcptMsg((value) => !value)} /><Label className="pl-2">Accept Msg {`${toggle()}`}</Label></span>

                <Card className="mx-7 my-7">
                    <div className="grid grid-cols-1 md:grid-cols-2   z-[1]  dark:text-white">

                    </div>
                </Card>
            </div>
        </main>
    );
}
