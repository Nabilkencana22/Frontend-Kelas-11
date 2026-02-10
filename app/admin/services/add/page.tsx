"use client";

import { getCookies } from "@/helper/cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ServiceAddResponse {
    success: boolean;
    message: string;
    data: AddServiceType;
}

export interface AddServiceType {
    id: number;
    name: string;
    min_usage: number;
    max_usage: number;
    price: number;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
}

export default function AddServicePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        min_usage: "",
        max_usage: "",
        price: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        Authorization: `Bearer ${await getCookies("token")}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        min_usage: Number(formData.min_usage),
                        max_usage: Number(formData.max_usage),
                        price: Number(formData.price),
                    }),
                }
            );

            const responseData: ServiceAddResponse = await response.json();

            if (!response.ok) {
                setError(responseData.message || "Gagal membuat layanan.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setFormData({
                name: "",
                min_usage: "",
                max_usage: "",
                price: "",
            });

            setTimeout(() => {
                router.push("/admin/services");
            }, 1500);

        } catch (error) {
            setError("Server error. Silahkan coba lagi.");
            setLoading(false);
        }
    };

    const isFormValid =
        formData.name &&
        formData.min_usage &&
        formData.max_usage &&
        formData.price;

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow p-6">

                <h1 className="text-2xl font-semibold text-slate-700 mb-1">
                    Add New Service
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    Create a new service for customers
                </p>

                {/* ALERT */}
                {error && (
                    <div className="mb-4 rounded bg-red-100 text-red-700 p-3 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded bg-green-100 text-green-700 p-3 text-sm">
                        Service created successfully. Redirecting...
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600">
                            Service Name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">
                                Min Usage
                            </label>
                            <input
                                type="number"
                                name="min_usage"
                                value={formData.min_usage}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-md p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600">
                                Max Usage
                            </label>
                            <input
                                type="number"
                                name="max_usage"
                                value={formData.max_usage}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-md p-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600  disabled:opacity-50 transition"
                    >
                        {loading ? "Saving..." : "Save Service"}
                    </button>
                </form>
            </div>
        </div>
    );
}