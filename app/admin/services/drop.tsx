"use client";

import { getCookies } from "@/helper/cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface DropButtonProps {
    selectedData: number;
    serviceName: string;
    endpoint?: string;
    redirectUrl?: string;
}

export default function DropServiceButton({
    selectedData,
    serviceName,
    endpoint = "services",
    redirectUrl = "/admin/services"
}: DropButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${endpoint}/${selectedData}`;
            const response = await fetch(
                url,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        Authorization: `Bearer ${await getCookies("token")}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menghapus data.");
            }
            toast.success(`${serviceName} deleted successfully`);
            setShowConfirm(false);
            router.refresh(); 
        } catch (error: any) {
            console.error("Error menghapus data:", error);
            toast.error(error.message || "Failed to delete item");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200 group"
                title={`Delete ${serviceName}`}
            >
                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
            </button>

            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 px-4 sm:px-0">
                        {/* Overlay backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        
                        {/* Confirmation Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
                        >
                            <div className="p-8">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 text-center mb-2">Confirm Delete</h3>
                                <p className="text-slate-500 text-center text-sm font-medium leading-relaxed">
                                    Are you sure you want to delete <span className="text-slate-800 font-bold">"{serviceName}"</span>? This action cannot be undone.
                                </p>
                                
                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        className="flex-1 py-3.5 gradient-red text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Delete</span>
                                                <Trash2 size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
                                <button 
                                    onClick={() => setShowConfirm(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}