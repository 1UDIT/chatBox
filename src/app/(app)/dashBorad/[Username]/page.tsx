"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Message } from "@/Model/User";
import DisplayMesCard from "@/components/DisplayMesCard";

export default function page({ params }: { params: { Username: string } }) {
    const [AcptMsg, setAcptMsg] = useState<boolean>(false);
    const CopyUrl = typeof window !== "undefined" ? (`${window.location.origin}/chatBox/${params.Username}`) : '';
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const passwordRef = useRef(null)
    // const { data: session } = useSession();
    // const user : User = session?.user;

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
        window.navigator.clipboard.writeText(CopyUrl);
        toast({
            title: "Copy",
            description: CopyUrl,
        })
    }

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setAcptMsg(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-message');
                setMessages(response.data.messages || []);
                console.log(response.data.messages)
                if (refresh) {
                    toast({
                        title: 'Refreshed Messages',
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description:
                        axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
                setAcptMsg(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );
    const handleAcceptMessage = useCallback(async () => {
            setIsLoading(true);
            setAcptMsg(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-Acptmessage');
                setMessages(response.data.messages || []);
               
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description:
                        axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
                setAcptMsg(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );

    useEffect(() => {
        fetchMessages();
    }, [])

    return (
        <main className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <div>
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

                <Card className=" mt-2">
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <div className="mx-2 my-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <DisplayMesCard
                                    key={message._id}
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <p>No messages to display.</p>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}
