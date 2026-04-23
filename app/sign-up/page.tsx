"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    User,
    Lock,
    Phone,
    UserCircle,
    MapPin,
    CreditCard,
    Zap,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Shield
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

 

export default function SignUpPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        try {
            const request = JSON.stringify({
                username,
                password,
                phone,
                name
            })
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })

            const responseData = await response.json();

            if (!response.ok) {
                toast.error(responseData.message || "Failed to register", { containerId: 'toastSignUp' });
                return;
            }

            toast.success("Account created successfully!", { containerId: 'toastSignUp' });
            setTimeout(() => router.push("/sign-in"), 1500);
        } catch (error) {
            console.error("Error during sign up:", error)
            toast.error("Internal server error", { containerId: 'toastSignUp' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

            <ToastContainer containerId="toastSignUp" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-white/80 backdrop-blur-xl p-8 md:p-12 w-full max-w-[700px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)] border border-white/50"
            >
                <Link href="/sign-in" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    </div>
                    <span className="text-sm font-bold">Back to Login</span>
                </Link>

                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-200"
                    >
                        <Shield size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">
                        Secure <span className="text-transparent bg-clip-text gradient-blue">Admin</span> Access
                    </h1>
                    <p className="text-slate-400 font-medium text-center mt-2">
                        Register a new administrator account
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSignUp}>
                    {/* Auth Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock size={14} className="text-blue-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60">Account Security</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Username</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-semibold text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-semibold text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCircle size={14} className="text-emerald-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Profile Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-semibold text-sm"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your legal name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="tel"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-semibold text-sm"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4.5 gradient-blue text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 mt-4 relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"
                                />
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2"
                                >
                                    <span>Create My Account</span>
                                    <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </form>

                <p className="mt-10 text-center text-slate-400 text-sm font-semibold">
                    Step into clarity. Already have an account?{" "}
                    <Link href="/sign-in" className="text-blue-600 font-black hover:underline underline-offset-4 decoration-blue-200">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
