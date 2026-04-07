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
        <div className="w-full p-5">

            {
                count == 0 ?
                    <div className="w-full rounded p-5 bg-sky-200 text-sky-600 font-semibold">Sorry, there are no data to display.</div> :
                    <div>
                        <h3>
                            <Link href="/admin/services/add">
                                <button type="button" className="bg-sky-500 text-white px-3 py-2 rounded-sm font-semibold mb-3 cursor-pointer">+ Add New Service</button>
                            </Link>
                        </h3>
                        <h4 className="text-xl font-bold  ">
                            Service Management
                        </h4>
                        <h1>
                            Service List ({count} Services)
                        </h1>
                        <Search search={search || ""} />
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
            }
        </div>
    )
}