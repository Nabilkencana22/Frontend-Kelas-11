import Link from "next/link"
import Search from "../services/search"
import DropServiceButton from "../services/drop"
import { getCookies } from "@/helper/cookies"
import { 
    User, 
    Phone, 
    MapPin, 
    Calendar, 
    Plus, 
    Users, 
    LayoutGrid,
    ChevronRight,
    Edit3
} from "lucide-react"

export interface CustomerResponse {
    success: boolean
    message: string
    data: CustomerType[]
    count: number
}

// ... interfaces remain the same ...
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
            <div className="w-full">
                <div className="glass-card border-red-100 p-6 flex items-center gap-4 text-red-600 font-bold animate-shake">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <Users className="text-red-500" />
                    </div>
                    {message}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Users size={20} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Customer Management</h1>
                    </div>
                    <p className="text-slate-400 font-bold text-sm ml-13 italic">
                        Managing {count} valued customers in your network
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                    <Search search={search || ""} />
                    <Link href="/admin/customer/add">
                        <button className="gradient-emerald text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add Customer</span>
                        </button>
                    </Link>
                </div>
            </div>

            {count == 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <LayoutGrid size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-400">No Customers Found</h3>
                    <p className="text-slate-300 font-medium max-w-xs mt-2">
                        Try adjusting your search or add a new customer to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 round">
                    {data.map((customer, idx) => (
                        <div 
                            key={`KeyCustomer${customer.id}`} 
                            className="glass-card p-6 group hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 animate-stagger rounded-2xl"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 gradient-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform ">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{customer.name}</h4>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded-md w-fit mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                            ID: {customer.customer_number}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-600 transition-colors font-medium text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="truncate">{customer.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-600 transition-colors font-medium text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-600 transition-colors font-medium text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                                        <Calendar size={16} />
                                    </div>
                                    <span>Joined {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm shadow-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {customer.service.name}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/customer/edit/${customer.id}`}>
                                        <button 
                                            type="button" 
                                            className="p-2.5 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all duration-300 group/btn"
                                            title="Edit Customer"
                                        >
                                            <Edit3 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
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
            )}
        </div>
    )
}
