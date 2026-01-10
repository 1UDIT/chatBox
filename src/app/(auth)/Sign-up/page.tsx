'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/Schema/SignupSchema';
import { useDebounceCallback } from 'usehooks-ts'
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import { drawAnimatedLine, useCreateEdgeToEdgeLine } from '@/components/useCreateEdgeToEdgeLine';


type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dots: number[];
};

export default function page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUsername = useDebounceCallback(setUsername, 300);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const linesRef = useRef<Line[]>([]);
    const count = 9;

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setUsernameMessage(''); // Reset message
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username-unique?username=${debouncedUsername}`
                    );
                    setIsCheckingUsername(true);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'Server Error'
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        console.log("CLicked...")
        setIsSubmitting(true);
        try {
            await axios.post<ApiResponse>('/api/sign-up', data);
            // console.log('Sign-up response:', response.data);

            // toast.info('Success', response?.data?.message);

            router.replace(`/verify/${username}`);

            setIsSubmitting(false);
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;
            ('There was a problem with your sign-up. Please try again.');

            toast.error(`Sign Up Failed${errorMessage}`);

            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateLines();
        };

        const generateLines = () => {
            linesRef.current = Array.from({ length: count }, () =>
                useCreateEdgeToEdgeLine(canvas.width, canvas.height, count)
            );
        };

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = "#0b0f19";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            linesRef.current.forEach((line) => drawAnimatedLine(ctx, line));

            animationId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, [count]);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-90 sm:w-full max-w-md p-[6px]  rounded-lg animated-border">
                    <div className="w-full h-full px-3 py-2 sm:p-8 bg-[#f9fafb] rounded-lg inset-shadow-2xs">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                Join True Feedback
                            </h1>
                            <p className="mb-4">Sign up to start your anonymous adventure</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    name="username"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setUsername(e.target.value);
                                                }}
                                            />
                                            {isCheckingUsername && <Loader2 className="animate-spin" />}
                                            <FormMessage className='text-red-500' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Input {...field} name="email" />
                                            <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                                            <FormMessage className='text-red-500'/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <Input type="password" {...field} name="password" />
                                            <FormMessage className='text-red-500'/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className='w-full bg-blue-400 text-white hover:bg-blue-300 hover:text-black animated-border' disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center mt-4">
                            <p>
                                Already a member?{' '}
                                <Link href="/Sign-in" className="text-blue-600 hover:text-blue-800">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="absolute inset-0" />
        </div >
    );
}
