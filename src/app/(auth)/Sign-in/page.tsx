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
    const [count, setCount] = useState(9);

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
                createEdgeToEdgeLine(canvas.width, canvas.height, count)
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
        <main className="relative h-screen w-screen overflow-hidden">
            {/* Input */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">

                {/* <input
                    type="number"
                    min={1}
                    max={30}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="px-3 py-2 rounded bg-black text-white border border-gray-600"
                /> */}

                <div className="relative w-full max-w-md p-[6px]  rounded-lg animated-border">
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


        </main>
    );
}

function createEdgeToEdgeLine(
    width: number,
    height: number,
    dotCount: number
) {
    const edge = Math.floor(Math.random() * 40); 

    let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;

    if (edge === 0) {
        x1 = Math.random() * width;
        y1 = 0;
        x2 = Math.random() * width;
        y2 = height;
    } else if (edge === 1) {
        x1 = width;
        y1 = Math.random() * height;
        x2 = 0;
        y2 = Math.random() * height;
    } else if (edge === 2) {
        x1 = Math.random() * width;
        y1 = height;
        x2 = Math.random() * width;
        y2 = 0;
    } else {
        x1 = 0;
        y1 = Math.random() * height;
        x2 = width;
        y2 = Math.random() * height;
    }

    return {
        x1,
        y1,
        x2,
        y2,
        dots: Array.from({ length: dotCount }, (_, i) => i / dotCount),
    };
}

function drawAnimatedLine(
    ctx: CanvasRenderingContext2D,
    line: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        dots: number[];
    }
) {
    const { x1, y1, x2, y2, dots } = line;

    // Draw line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Animate dots
    ctx.fillStyle = "#4f8cff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#4f8cff";

    for (let i = 0; i < dots.length; i++) {
        dots[i] += 0.0012; // speed
        if (dots[i] > 1) dots[i] = 0;

        const t = dots[i];
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.shadowBlur = 0;
}
