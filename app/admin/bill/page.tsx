import Link from "next/link"
import { getCookies } from "@/helper/cookies"
import Search from "../services/search"
import DropServiceButton from "../services/drop"

export interface BillResponse {
    success: boolean
    message: string
    data: BillType[]
    count: number
}

export interface BillType {
    id: number
    customer_id: number
    admin_id: number
    month: number
    year: number
    measurement_number: string
    usage_value: number
    price: number
    service_id: number
    paid: boolean
    owner_token: string
    createdAt: string
    updatedAt: string
    customer?: {
        id: number
        name: string
        customer_number: string
    }
}

type SearchParams = {
    [key: string]:
    string | boolean | number | undefined
}

async function getBills(params?: SearchParams): Promise<BillResponse> {
    try {
        const queryParams = params ?
            Object.keys(params).filter(p => typeof params[p] !== 'undefined').map(p => `${p}=${params[p]}`).join('&') : '';
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/bills?${queryParams}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                Authorization: `Bearer ${await getCookies("token")}`,
            }
        });
        const responseData: BillResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to fetch bills",
                data: [],
                count: 0,
            };
        }
        return responseData;
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch bills",
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

export default async function BillPage(props: Props) {
    const { search } = await props.searchParams;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const { message, success, data, count } = await getBills({ search });

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
                            <h4 className="text-xl font-bold">Bill Management</h4>
                            <p className="text-sm text-gray-600">Bill List ({count} Bills)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Search search={search || ""} />
                            <Link href="/admin/bill/add">
                                <button type="button" className="bg-emerald-500 text-white px-3 py-2 rounded-sm font-semibold cursor-pointer">+ Add Bill</button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full rounded-md overflow-hidden shadow border">
                            <thead>
                                <tr>
                                    <th className="p-2 bg-sky-100 text-left">Customer</th>
                                    <th className="p-2 bg-sky-100 text-center">Month/Year</th>
                                    <th className="p-2 bg-sky-100 text-center">Measurement</th>
                                    <th className="p-2 bg-sky-100 text-center">Usage</th>
                                    <th className="p-2 bg-sky-100 text-center">Price</th>
                                    <th className="p-2 bg-sky-100 text-center">Status</th>
                                    <th className="p-2 bg-sky-100 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(bill => (
                                    <tr key={`KeyBill${bill.id}`} className="hover:bg-sky-50 border-b border-gray-200">
                                        <td className="p-2">
                                            <div className="text-sm font-semibold">{bill.customer?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{bill.customer?.customer_number}</div>
                                        </td>
                                        <td className="text-center p-2">{months[bill.month - 1]}/{bill.year}</td>
                                        <td className="text-center p-2 text-sm">{bill.measurement_number}</td>
                                        <td className="text-center p-2">{bill.usage_value}</td>
                                        <td className="text-center p-2 font-semibold">Rp.{bill.price.toLocaleString()}</td>
                                        <td className="text-center p-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bill.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {bill.paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="text-center p-2">
                                            <Link href={`/admin/bill/edit/${bill.id}`}>
                                                <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded-sm font-semibold mr-2 hover:bg-blue-600">Edit</button>
                                            </Link>
                                            <DropServiceButton
                                                selectedData={bill.id}
                                                serviceName={`Bill ${bill.id}`}
                                                endpoint="bills"
                                                redirectUrl="/admin/bill"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}