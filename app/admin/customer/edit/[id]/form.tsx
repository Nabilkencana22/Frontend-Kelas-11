"use client"

import { getCookies } from "@/helper/cookies"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
    services: {
        id: number
        name: string
    }[]
    customer: {
        id: number
        user_id: number
        customer_number: string
        name: string
        phone: string
        address: string
        service_id: number
        user: {
            username: string
        }
    }
    customerId: string
}

export default function FormCustomerEdit({ services, customer, customerId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        customer_number: customer.customer_number,
        address: customer.address,
        service_id: String(customer.service_id),
        name: customer.name,
        phone: customer.phone
    });

    const validateForm = () => {
        if (!form.name.trim()) {
            setError("Full name is required.");
            return false;
        }
        if (!form.customer_number.trim()) {
            setError("Customer number is required.");
            return false;
        }
        if (!form.address.trim()) {
            setError("Address is required.");
            return false;
        }
        if (!form.phone.trim()) {
            setError("Phone number is required.");
            return false;
        }
        if (!form.service_id) {
            setError("Please select a service.");
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
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${customerId}`
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${await getCookies("token")}`,
                },
                body: JSON.stringify({
                    customer_number: form.customer_number.trim(),
                    address: form.address.trim(),
                    service_id: Number(form.service_id),
                    name: form.name.trim(),
                    phone: form.phone.trim()
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update customer.");
            }

            setSuccess(true);
            setTimeout(() => router.push("/admin/customer"), 1500);
        } catch (error: any) {
            console.error("Error updating customer:", error);
            setError(error.message || "An error occurred while updating the customer.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Customer</h2>
            <p className="text-sm text-gray-600 mb-6">Username: <span className="font-semibold">{customer.user.username}</span></p>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Customer updated successfully! Redirecting...
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Customer Number</label>
                        <input
                            type="text"
                            name="customer_number"
                            value={form.customer_number}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter customer number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Service</label>
                        <select
                            name="service_id"
                            value={form.service_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter address"
                        required
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Updating..." : "Update Customer"}
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
