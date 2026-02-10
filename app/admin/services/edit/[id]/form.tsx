'use client';

import { useState } from "react";
import { Service } from "./page";
import { useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";

// we create a custom component that name "Form Service Edit"
type Props ={
    service: Service
}

export default function FormService(props : Props){
    const [name , setName ] = useState<string>(props.service.name)
    const [min_usage , setMinUsage ] = useState<number>(props.service.min_usage)
    const [max_usage , setMaxUsage ] = useState<number>(props.service.max_usage)
    const [price , setPrice ] = useState<number>(props.service.price)
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

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
                        name: name,
                        min_usage: min_usage,
                        max_usage: max_usage,
                        price: price,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update service.");
            }

            router.push("/admin/services");
        } catch (error) {
            console.error("Error updating service:", error);
        }
    }
    return(
        <div className="w-full p-5 bg-white shadow rounded-md">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-semibold">Service Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Min Usage</label>
                    <input 
                        type="number" 
                        value={min_usage}
                        onChange={(e) => setMinUsage(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Max Usage</label>
                    <input 
                        type="number" 
                        value={max_usage}
                        onChange={(e) => setMaxUsage(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Price</label>
                    <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <button 
                        type="submit"
                        className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                    >
                        Update Service
                    </button>
                </div>
                
            </form>
        </div>
    )
}