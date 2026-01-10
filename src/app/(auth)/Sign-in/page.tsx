"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signInSchema } from "@/Schema/SigninSchema"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner"
import { drawAnimatedLine, useCreateEdgeToEdgeLine } from "@/components/useCreateEdgeToEdgeLine";

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dots: number[];
};

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const linesRef = useRef<Line[]>([]);
    const count = 9;

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

    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast(`Login Failed  Incorrect username or password`);
            } else {
                toast(`Login Failed ${result.error}`);
            }
        }

        if (result?.url) {
            router.replace(`/chatBox/${data.identifier}`);
        }
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-90 sm:w-full max-w-md p-[6px]  rounded-lg animated-border">
                    <div className="w-full h-full p-8 bg-[#f9fafb] rounded-lg inset-shadow-2xs">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                Welcome Back to True Feedback
                            </h1>
                            <p className="mb-4">Sign in to continue your secret conversations</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="identifier"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email/Username</FormLabel>
                                            <Input {...field} placeholder="admin123" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <Input type="password" {...field} placeholder="admin123" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className='w-full bg-blue-600 text-white hover:bg-blue-300 hover:text-slate-200 animated-border' type="submit">Sign In</Button>
                            </form>
                        </Form>
                        <div className="text-slate-600 flex justify-center py-2">Log in to your account</div>
                        <div className="text-slate-600 flex justify-center px-2">
                            <Button onClick={() =>
                                signIn("google", {
                                    callbackUrl: "/chatBox/feedback",
                                })

                            } className="bg-white text-white hover:bg-blue-300 hover:text-black shadow3xl">
                                <div className="flex items-center h-auto flex-row h-14">
                                    <FcGoogle size={25} />
                                    <div className="text-[#5c6c75] px-2 text-md">Google</div>
                                </div>
                            </Button></div>
                        {/* <h6>Sign-In using other method</h6>
                <div className="text-center flex justify-center "> <Button variant={'ghost'}><AiFillGoogleCircle className="h-10 w-10 text-[#0f172a]"/></Button></div> */}
                        <div className="text-center mt-4">
                            <p>
                                Not a member yet?{' '}
                                <Link href="/Sign-up" className="text-blue-600 hover:text-blue-800">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="absolute inset-0" />


        </div>
    );
}

