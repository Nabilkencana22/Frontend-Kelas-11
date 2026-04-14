"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getCookies } from "@/helper/cookies"

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
            className="bg-emerald-500 text-white px-2 py-1 rounded-sm font-semibold mr-2 hover:bg-emerald-600 disabled:opacity-50"
            onClick={handleVerify}
            disabled={isLoading}
        >
            {isLoading ? "Verifying..." : "Verify"}
        </button>
    )
}
