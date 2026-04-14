import Link from "next/link"
import { getCookies } from "@/helper/cookies"
import Search from "../../admin/services/search"
import DropServiceButton from "../../admin/services/drop"

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
    payments?: any
}

export interface ResponCustomerProfile {
    success: boolean
    message: string
    data: Customer
    count: number
}

export interface Customer {
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

type SearchParams = {
    [key: string]:
    string | boolean | number | undefined
}

async function getCustomerProfile(): Promise<Customer | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/me`
        const response = await fetch(
            url, {
            method: `GET`,
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies(`token`)}`
            }
        }
        )

        const responseData: ResponCustomerProfile = await response.json()
        if (!response.ok) {
            return null;
        }
        return responseData.data;
    } catch (error) {
        return null;
    }
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
        search?: string;
        status?: string;
        billId?: string;
    }>;
}

export default async function CustomerBillPage(props: Props) {
    const { search, status, billId } = await props.searchParams;
    const customer = await getCustomerProfile();
    if (!customer) {
        return (
            <div className="w-full p-5">
                <div className="w-full rounded p-5 bg-red-200 text-red-600 font-semibold">Failed to load customer profile</div>
            </div>
        )
    }
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let { message, success, data, count } = await getBills({ search, owner_token: customer.owner_token });

    if (success && data) {
        data = data.filter((bill: any) => bill.customer_id === customer.id);
        count = data.length;
    }

    if (!success) {
        return (
            <div className="w-full p-5">
                <div className="w-full rounded p-5 bg-red-200 text-red-600 font-semibold">{message}</div>
            </div>
        )
    }

    const unpaidBills = data.filter((bill: any) => !bill.paid);
    const paidBills = data.filter((bill: any) => bill.paid);
    const paymentSuccess = status === "success";

    return (
        <div className="w-full p-5">
            {paymentSuccess && (
                <div className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-emerald-700 font-medium shadow-sm">
                    ✅ Success! Payment for bill #{billId ? billId : ""} has been successfully submitted and is being processed.
                </div>
            )}

            {/* Bagian Tagihan Aktif / Belum Dibayar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-xl font-bold">Unpaid Bills</h4>
                        <p className="text-sm text-gray-600">You have {unpaidBills.length} bill(s) that require payment</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search search={search || ""} />
                    </div>
                </div>

                {unpaidBills.length === 0 ? (
                    <div className="w-full rounded p-5 bg-sky-100 text-sky-700 font-semibold border border-sky-300">
                        🎉 Yay! All your bills have been paid.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full rounded-md overflow-hidden shadow border bg-white">
                            <thead>
                                <tr>
                                    <th className="p-3 bg-sky-100 text-center">Month/Year</th>
                                    <th className="p-3 bg-sky-100 text-center">Measurement</th>
                                    <th className="p-3 bg-sky-100 text-center">Usage</th>
                                    <th className="p-3 bg-sky-100 text-center">Price</th>
                                    <th className="p-3 bg-sky-100 text-center">Status</th>
                                    <th className="p-3 bg-sky-100 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unpaidBills.map(bill => (
                                    <tr key={`KeyBillUnpaid${bill.id}`} className="hover:bg-sky-50 border-b border-gray-200">
                                        <td className="text-center p-3 font-medium">{months[bill.month - 1]} {bill.year}</td>
                                        <td className="text-center p-3 text-sm text-gray-600">{bill.measurement_number}</td>
                                        <td className="text-center p-3">{bill.usage_value} m³</td>
                                        <td className="text-center p-3 font-bold text-gray-800">Rp.{bill.price.toLocaleString()}</td>
                                        <td className="text-center p-3">
                                            {bill.payments ? (
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700`}>
                                                    Processing
                                                </span>
                                            ) : (
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700`}>
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center p-3">
                                            {bill.payments ? (
                                                <span className="text-sm font-medium text-gray-500 italic">Pending Verification</span>
                                            ) : (
                                                <Link href={`/customer/payment?billId=${bill.id}`} className="inline-flex rounded-md bg-emerald-500 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-600 transition shadow-sm">
                                                    Pay Now
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bagian Riwayat Pembayaran */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-xl font-bold">Payment History</h4>
                        <p className="text-sm text-gray-600">List of paid bills</p>
                    </div>
                </div>

                {paidBills.length === 0 ? (
                    <div className="w-full rounded p-5 bg-gray-100 text-gray-500 font-semibold border border-gray-300">
                        You don't have any payment history yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full rounded-md overflow-hidden shadow border bg-gray-50 opacity-90">
                            <thead>
                                <tr>
                                    <th className="p-3 bg-gray-200 text-center text-gray-700">Month/Year</th>
                                    <th className="p-3 bg-gray-200 text-center text-gray-700">Measurement</th>
                                    <th className="p-3 bg-gray-200 text-center text-gray-700">Usage</th>
                                    <th className="p-3 bg-gray-200 text-center text-gray-700">Price</th>
                                    <th className="p-3 bg-gray-200 text-center text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paidBills.map(bill => (
                                    <tr key={`KeyBillPaid${bill.id}`} className="hover:bg-gray-100 border-b border-gray-200">
                                        <td className="text-center p-3 text-gray-600 font-medium">{months[bill.month - 1]} {bill.year}</td>
                                        <td className="text-center p-3 text-sm text-gray-500">{bill.measurement_number}</td>
                                        <td className="text-center p-3 text-gray-600">{bill.usage_value} m³</td>
                                        <td className="text-center p-3 font-semibold text-gray-600">Rp.{bill.price.toLocaleString()}</td>
                                        <td className="text-center p-3">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700`}>
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}