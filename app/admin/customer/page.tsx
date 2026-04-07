import Link from "next/link"
import Search from "../services/search"
import DropServiceButton from "../services/drop"
import { getCookies } from "@/helper/cookies"

export interface CustomerResponse {
    success: boolean
    message: string
    data: CustomerType[]
    count: number
}

export interface CustomerType {
    id: number
    user_id: number
    customer_number: string
    name: string
    phone: string
    address: string
    service_id: number
    owner_token: string
    createdAt: string
    updatedAt: string
    user: User
    service: Service
}

export interface User {
    id: number
    username: string
    password: string
    role: string
    owner_token: string
    createdAt: string
    updatedAt: string
}

export interface Service {
    id: number
    name: string
    min_usage: number
    max_usage: number
    price: number
    owner_token: string
    createdAt: string
    updatedAt: string
}

type SearchParams = {
    [key: string]:
    string | boolean | number | undefined
}

async function getCustomers(params?: SearchParams): Promise<CustomerResponse> {
    try {
        const queryParams = params ?
            Object.keys(params).filter(p => typeof params[p] !== 'undefined').map(p => `${p}=${params[p]}`).join('&') : '';
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers?${queryParams}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                Authorization: `Bearer ${await getCookies("token")}`,
            }
        });
        const responseData: CustomerResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to fetch customers",
                data: [],
                count: 0,
            };
        }
        return responseData;
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch customers",
            data: [],
            count: 0,
        };
    }
}

type Props = {
    searchParams: Promise<{
        search?: string
    }>
}


export default async function CustomerPage(props: Props) {
    const { search } = await props.searchParams;
    const { message, success, data, count } = await getCustomers({ search });

    if (!success) {
        return (
            <div className="w-full p-5">
                <div className="w-full rounded p-5 bg-red-200 text-red-600 font-semibold">{message}</div>
            </div>
        )
    }

    return (
        <div className="w-full p-5">
            {count == 0 ? (
                <div className="w-full rounded p-5 bg-sky-200 text-sky-600 font-semibold">Sorry, there are no data to display.</div>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-xl font-bold">Customer Management</h4>
                            <p className="text-sm text-gray-600">Customer List ({count} Customers)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Search search={search || ""} />
                            <Link href="/admin/customer/add">
                                <button type="button" className="bg-emerald-500 text-white px-3 py-2 rounded-sm font-semibold cursor-pointer">+ Add Customer</button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((customer) => (
                            <div key={`KeyCustomer${customer.id}`} className="border rounded-md p-4 shadow-sm hover:shadow-md transition hover:scale-[1.02] duration-200 hover:bg-sky-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-lg font-semibold">{customer.name}</div>
                                        <div className="text-xs text-gray-500">{customer.customer_number}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">Since {new Date(customer.createdAt).toLocaleDateString()}</div>
                                </div>
                                <p className="mt-3 text-sm text-gray-700">{customer.address}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-sm">{customer.service.name}</span>
                                    <div className="flex items-center">
                                        <Link href={`/admin/customer/edit/${customer.id}`}>
                                            <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded-sm font-semibold mr-2">Edit</button>
                                        </Link>
                                        <DropServiceButton
                                            selectedData={customer.id}
                                            serviceName={customer.name}
                                            endpoint="customers"
                                            redirectUrl="/admin/customer"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}