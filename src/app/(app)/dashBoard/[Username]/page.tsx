"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import DisplayMesCard from "@/components/DisplayMesCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/Schema/AcceptMessageSchema"; 
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export interface Message {
    _id: string;
    content: string;
    createdAt: string; // or Date
}


export default function page() {
    const { data: session } = useSession();
    const user: Session["user"] = session?.user;
    const username = user?.name || user?.email?.split("@")[0];
    const [AcptMsg, setAcptMsg] = useState<boolean>();
    const CopyUrl = typeof window !== "undefined" ? (`${window.location.origin}/chatBox/${username}`) : '';
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const passwordRef = useRef(null)
    // console.log("parms", params, user?.username , user?.name)

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
        defaultValues: {
            acceptValue: false,
        },
    });


    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptValue');



    const copyPasswordToClipboard = () => {
        window.navigator.clipboard.writeText(CopyUrl);
        toast.info("Copy")
    }

    const handleDeleteMessage = (messageId: string) => {
        console.log("messageId", messageId);

        setMessages((prevMessages) =>
            prevMessages.filter((message) => message._id !== messageId)
        );
    };


    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setAcptMsg(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-message');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast.info('Refreshed Messages');
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error('Error');
            } finally {
                setIsLoading(false);
                setAcptMsg(false);
            }
        },
        [setIsLoading, setMessages]
    );

    const FetchAcceptMessage = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-Acptmessage');
            setValue("acceptValue", response.data.isAcceptingMessages);
            // console.log(response.data.isAcceptingMessages, "FetchAcceptMessage")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error');
        } finally {
            setIsLoading(false);
        }
    },
        [setIsLoading, setMessages]
    );

    const handleAcceptMessage = async () => {
        // console.log(!acceptMessages, "handleAcceptMessage", acceptMessages)
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/get-Acptmessage', {
                acceptMessages: !acceptMessages,
            });
            setValue("acceptValue", !acceptMessages);
            toast.info(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        FetchAcceptMessage();
        fetchMessages();
    }, [setValue, fetchMessages, FetchAcceptMessage])

    return (
        <main className="mx-auto my-8 px-6 bg-white rounded w-full max-w-5xl flex-1">
            <div className='flex flex-wrap flex-col py-6'>
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
                        <span className="pl-2">
                            <Button variant="destructive" onClick={() => copyPasswordToClipboard()}>copy</Button>
                        </span>
                    </div>
                </div>
                <span className="text-xl">
                    <Switch checked={acceptMessages} onCheckedChange={() => handleAcceptMessage()} />
                    <Label className="pl-2"> Accept Messages: {acceptMessages ? 'On' : 'Off'}</Label>
                </span>
            </div>
            <Card className='  h-45 sm:h-64 lg:h-66 xl:h-88 flex-1 overflow-auto'>
                <CardHeader>
                    <CardTitle>Message</CardTitle>
                </CardHeader>
                <div className="mx-2 my-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <DisplayMesCard
                                key={message?._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <p>No messages to display.</p>
                    )}
                </div>
            </Card>
        </main>
    );
}
