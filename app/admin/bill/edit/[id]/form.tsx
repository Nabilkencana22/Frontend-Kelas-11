"use client"

import { getCookies } from "@/helper/cookies"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
    services: {
        id: number
        name: string
        price: number
    }[]
    customers: {
        id: number
        name: string
        customer_number: string
        service_id: number
    }[]
    bill: {
        id: number
        customer_id: number
        month: number
        year: number
        measurement_number: string
        usage_value: number
        price: number
        service_id: number
        paid: boolean
    }
    billId: string
}

export default function FormBillEdit({ services, customers, bill, billId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        customer_id: String(bill.customer_id),
        month: bill.month,
        year: bill.year,
        measurement_number: bill.measurement_number,
        usage_value: String(bill.usage_value),
        price: String(bill.price),
        paid: bill.paid
    });

    const validateForm = () => {
        if (!form.customer_id) {
            setError("Customer is required.");
            return false;
        }
        if (!form.measurement_number.trim()) {
            setError("Measurement number is required.");
            return false;
        }
        if (!form.usage_value || Number(form.usage_value) <= 0) {
            setError("Usage value must be greater than 0.");
            return false;
        }
        if (!form.price || Number(form.price) <= 0) {
            setError("Price must be greater than 0.");
            return false;
        }
        if (!form.month || form.month < 1 || form.month > 12) {
            setError("Month must be between 1 and 12.");
            return false;
        }
        if (!form.year || form.year < 2000) {
            setError("Year must be valid.");
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
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/bills/${billId}`
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${await getCookies("token")}`,
                },
                body: JSON.stringify({
                    customer_id: Number(form.customer_id),
                    month: Number(form.month),
                    year: Number(form.year),
                    measurement_number: form.measurement_number.trim(),
                    usage_value: Number(form.usage_value),
                    price: Number(form.price),
                    paid: form.paid
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update bill.");
            }

            setSuccess(true);
            setTimeout(() => router.push("/admin/bill"), 1500);
        } catch (error: any) {
            console.error("Error updating bill:", error);
            setError(error.message || "An error occurred while updating the bill.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, type, value } = e.target;

        if (type === "checkbox") {
            setForm({
                ...form,
                [name]: (e.target as HTMLInputElement).checked
            })
        } else {
            setForm({
                ...form,
                [name]: value
            })
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Bill</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Bill updated successfully! Redirecting...
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Customer</label>
                        <select
                            name="customer_id"
                            value={form.customer_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.customer_number})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Measurement Number</label>
                        <input
                            type="text"
                            name="measurement_number"
                            value={form.measurement_number}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter measurement number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Month</label>
                        <input
                            type="number"
                            name="month"
                            min="1"
                            max="12"
                            value={form.month}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            name="year"
                            min="2000"
                            value={form.year}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Usage Value</label>
                        <input
                            type="number"
                            name="usage_value"
                            value={form.usage_value}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter usage value"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter price"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="paid"
                        name="paid"
                        checked={form.paid}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="paid" className="ml-2 font-medium text-gray-700">Mark as Paid</label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Updating..." : "Update Bill"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
