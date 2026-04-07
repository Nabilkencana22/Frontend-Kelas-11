'use client';

import { useState } from "react";
import { Service } from "./page";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";

// we create a custom component that name "Form Service Edit"
type Props = {
    service: Service
}

export default function FormService(props: Props) {
    const [name, setName] = useState<string>(props.service.name);
    const [min_usage, setMinUsage] = useState<number>(props.service.min_usage);
    const [max_usage, setMaxUsage] = useState<number>(props.service.max_usage);
    const [price, setPrice] = useState<number>(props.service.price);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (!name.trim()) {
            setError("Service name is required.");
            return false;
        }
        if (min_usage >= max_usage) {
            setError("Min usage must be less than max usage.");
            return false;
        }
        if (price <= 0) {
            setError("Price must be greater than 0.");
            return false;
        }
        return true;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${props.service.id}`;
            const response = await fetch(
                url,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        Authorization: `Bearer ${await getCookies("token")}`,
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        min_usage: min_usage,
                        max_usage: max_usage,
                        price: price,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update service.");
            }

            setSuccess(true);
            setTimeout(() => router.push("/admin/services"), 1500);
        } catch (error: any) {
            console.error("Error updating service:", error);
            setError(error.message || "An error occurred while updating the service.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Service</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Service updated successfully! Redirecting...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Service Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter service name"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Min Usage</label>
                        <input
                            type="number"
                            value={min_usage}
                            onChange={(e) => setMinUsage(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Max Usage</label>
                        <input
                            type="number"
                            value={max_usage}
                            onChange={(e) => setMaxUsage(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {loading ? "Updating..." : "Update Service"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}