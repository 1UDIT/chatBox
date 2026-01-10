"use client"
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/Schema/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useCompletion } from '@ai-sdk/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Session } from "next-auth";
import { toast } from 'sonner';


const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString
        .split(specialChar)
        .map(msg => msg.trim())
        .filter(Boolean);
};


const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function page() {
    const { data: session } = useSession();
    const user: Session["user"] = session?.user;
    const username = user?.username || user?.email?.split("@")[0];
    const [isLoading, setIsLoading] = useState(false);




    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({
        api: '/api/suggestMessages',
        initialCompletion: initialMessageString,
        streamProtocol: "text"
    });


    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    });

    const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const fetchSuggestedMessages = async () => {
        try {
            complete(
                "Generate casual conversation questions in ONE LINE separated by || only"
            );
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Handle error appropriately
        }
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        console.log(username, "userName")
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast.info(response.data.message);
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(`Error ${axiosError.response?.data.message ?? 'Failed to sent message'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto px-4 bg-white rounded w-full max-w-4xl flex-1">
            <div className='flex flex-wrap flex-col '>
                <h1 className="text-4xl font-bold mb-6 text-center flex-1">
                    Public Profile Link
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your message here."
                                            className="resize-none "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-600'/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center my-2">
                            {isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isLoading || !messageContent} variant={"destructive"} className={`disable:bg-slate-300 
                                w-full md:w-auto bg-slate-100 text-white hover:text-black hover:cursor-pointer hover:bg-blue-300 bg-blue-400`}>
                                    Send It
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
            <div className='flex flex-wrap flex-col'>
                <div className="space-y-2 flex-1">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="w-full md:w-auto bg-slate-100 text-white hover:text-black hover:cursor-pointer hover:bg-blue-300 bg-blue-400"
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
            </div>
            <div className='flex flex-wrap flex-col '>
                <Card className='h-40 sm:h-64 lg:h-60 xl:h-66 overflow-auto'>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4 text-wrap">
                        {error ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            parseStringMessages(completion).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2 h-auto w-full whitespace-normal break-words text-left"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
