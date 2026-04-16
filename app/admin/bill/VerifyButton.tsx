"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getCookies } from "@/helper/cookies"

import { CheckCircle, Loader2 } from "lucide-react"

type Props = {
    paymentId: number
}

export default function VerifyPaymentButton({ paymentId }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleVerify = async () => {
        if (!confirm("Are you sure you want to verify this payment?")) return;

        setIsLoading(true)
        try {
            const token = await getCookies("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/${paymentId}`, {
                method: "PATCH",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            if (!response.ok) {
                alert(data.message || "Failed to verify payment")
            } else {
                alert("Payment verified successfully!")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred during verification")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm shadow-emerald-200 active:scale-95 disabled:opacity-50"
            onClick={handleVerify}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <CheckCircle size={14} />
            )}
            {isLoading ? "Verifying..." : "Verify"}
        </button>
    )
}
