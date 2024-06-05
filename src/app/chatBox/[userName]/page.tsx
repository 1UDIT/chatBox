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
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/Schema/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { getAnswer } from '@/app/chat/action';
import { useChat, useCompletion } from 'ai/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function page({ params }: { params: { Username: string } }) {
    const username = params.Username;
    const [isLoading, setIsLoading] = useState(false);
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({
        api: '/api/suggestMessages',
        initialCompletion: initialMessageString,
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
            complete('hello');
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Handle error appropriately
        }
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to sent message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
                <h1 className="text-4xl font-bold mb-6 text-center">
                    Public Profile Link
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your message here."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            {isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isLoading || !messageContent} variant={"destructive"}>
                                    Send It
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="my-4"
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {error ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            parseStringMessages(completion).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </>
    )
}
