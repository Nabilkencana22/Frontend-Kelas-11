"use client"
import { storeCookies } from "@/helper/cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { LogIn, User, Lock, Droplets } from "lucide-react";

export interface LoginResponse {
    success?: boolean
    message?: string
    token?: string
    role?: string
    error?: string
    statusCode?: number
}

export default function SignIn() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [pending, startTransition] = useTransition()
    const router = useRouter()

    async function handleSignIn(event: FormEvent) {
        try {
            event.preventDefault()
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`
            const requestData = { username, password }
            const response = await fetch(
                url,
                {
                    method: `POST`,
                    body: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || ""
                    }
                }
            )

            const responseData: LoginResponse = await response.json();
            const message = responseData.message || ""
            if (!response.ok) {
                toast.error(message, { containerId: `toastLogin` })
                return;
            }

            if (responseData?.success == true) {
                toast.success(message, { containerId: `toastLogin` })
                startTransition(async function () {
                    await storeCookies(`token`, responseData?.token || "")
                    if (responseData.role == `ADMIN`)
                        setTimeout(() => router.push(`/admin/bill`), 1000)
                    if (responseData.role == `CUSTOMER`)
                        setTimeout(() => router.push(`/customer/bill`), 1000)
                })
            } else {
                toast.warning(message, { containerId: `toastLogin` })
            }

        } catch (error) {
            console.log(error)
            toast.error("Process failed, please try again", { containerId: `toastLogin` })
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#f8fafc] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 rounded-full blur-3xl opacity-50" />

            <ToastContainer containerId={`toastLogin`} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] w-full max-w-[440px] p-10 rounded-[2rem] border border-blue-50/50"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                        <Droplets size={32} />
                    </div>
                    <h1 className="font-bold text-slate-800 text-3xl tracking-tight mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Securely sign in to your accounts
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSignIn}>
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-semibold text-slate-700 ml-1">
                            Username
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium" 
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full py-4 gradient-blue text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {pending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-slate-400 font-medium">
                        Don't have an account?{" "}
                        <Link className="text-blue-600 font-bold hover:underline underline-offset-4"
                            href={`/sign-up`}
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
