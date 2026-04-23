import Link from "next/link";
import { getCookies } from "../../../helper/cookies";
import Search from "./search";
import DropServiceButton from "./drop";

export interface ServiceResponse {
    success: boolean;
    message: string;
    data: ServiceType[];
    count: number;
}

export interface ServiceType {
    id: number;
    name: string;
    min_usage: number;
    max_usage: number;
    price: number;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeleteResponse {
    success: boolean
    message: string
    data: DeleteType
}

export interface DeleteType {
    id: number
    name: string
    min_usage: number
    max_usage: number
    price: number
    owner_token: string
    createdAt: string
    updatedAt: string
}

// Creaete function to get services from API
type SearchParams = {
    [key: string]:
    string | boolean | number | undefined
}

async function getServices(params?: SearchParams): Promise<ServiceResponse> {
    try {
        const queryParams = params ?
            Object.keys(params).filter(p => typeof params[p] !== 'undefined').map(p => `${p}=${params[p]}`).join('&') : '';
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services?${queryParams}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                Authorization: `Bearer ${await getCookies("token")}`,
            }
        });



        const responseData: ServiceResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to fetch services",
                data: [],
                count: 0,
            };
        }
        return responseData;



    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch services",
            data: [],
            count: 0,
        };
    }
}

type Props = {
    searchParams: Promise<{
        search: string
    }>
}

export default async function ServicePage(props: Props) {
    const { search } = await props.searchParams;
    const { message, success, data, count } = await getServices({ search });

    if (!success) {
        return (
            <div className="w-full p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <h1 className="font-bold text-xl">Warning</h1>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in p-5">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Service Management</h1>
                    <p className="text-slate-400 font-bold text-sm mt-1 italic">
                        Managing {count} available services
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                    <Search search={search || ""} />
                    <Link href="/admin/services/add">
                        <button className="gradient-blue text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group">
                            <span className="text-xl leading-none font-medium mb-0.5 group-hover:rotate-90 transition-transform duration-300">+</span>
                            <span>Add Service</span>
                        </button>
                    </Link>
                </div>
            </div>

            {count == 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 mt-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-400">No Services Found</h3>
                    <p className="text-slate-300 font-medium max-w-xs mt-2">
                        Try adjusting your search or add a new service to get started.
                    </p>
                </div>
            ) : (
                <div className="glass-card mt-8 overflow-hidden">
                        <table className="w-full rounded-md overflow-hidden shadow border ">
                            <thead>
                                <tr>
                                    <th className="p-2 bg-sky-100">Name</th>
                                    <th className="p-2 bg-sky-100">Min Usage</th>
                                    <th className="p-2 bg-sky-100">Max Usage</th>
                                    <th className="p-2 bg-sky-100">Price</th>
                                    <th className="p-2 bg-sky-100">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(service => (
                                    <tr key={`KeyService${service.id}`} className="hover:bg-sky-50 border-b border-gray-200">
                                        <td className=" p-2">{service.name}</td>
                                        <td className="text-center p-2">{service.min_usage}</td>
                                        <td className="text-center p-2">{service.max_usage}</td>
                                        <td className="text-center p-2">{service.price}</td>
                                        <td className="text-center p-2">

                                            <Link href={`/admin/services/edit/${service.id}`}>
                                                <button type="button" className="bg-sky-500 text-white px-2 py-2 rounded-sm font-semibold cursor-pointer mr-4 shadow shadow-sky-300 hover:bg-sky-600">Edit</button>
                                            </Link>

                                            <DropServiceButton selectedData={service.id} serviceName={service.name} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>
            )}
        </div>
    )
}