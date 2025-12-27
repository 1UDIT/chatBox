import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from "sonner"
import { ApiResponse } from '@/types/ApiResponse';

interface Message {
    _id: string;
    content: string;
    createdAt: string; // or Date
}

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};



export default function DisplayMesCard({ message, onMessageDelete }: MessageCardProps) {  

    const handleDeleteConfirm = async () => {
        // console.log(message._id, "message._id");

        try {
            const response = await axios.delete<ApiResponse>(
                `/api/deleteMessage/${message._id}` // ✅ FIXED
            );

            toast.info(  response.data.message );

            onMessageDelete(message._id); // optimistic UI update
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(  "Error");
        }
    };
    return (
        <Card className="card-bordered break-words text-wrap">
            <CardHeader>
                <div className="flex justify-between items-center ">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm my-6">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    )
}
