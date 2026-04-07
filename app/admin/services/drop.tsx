"use client";

import { getCookies } from "@/helper/cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    const router = useRouter();

    const handleDelete = async (e: FormEvent) => {
        if (!confirm("Apakah anda yakin ingin menghapus data ini?")) {
            return;
        }

        setIsLoading(true);

        try {
            e.preventDefault();
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
                throw new Error("Gagal menghapus data.");
            }
            router.push(redirectUrl);
        } catch (error) {
            console.error("Error menghapus data:", error);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-3 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 shadow shadow-red-300"
        >
            {isLoading ? "Menghapus..." : "Delete"}
        </button>
    )
}