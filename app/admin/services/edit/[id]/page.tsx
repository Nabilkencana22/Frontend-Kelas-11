import { getCookies } from "@/helper/cookies"
import FormService from "./form"

export interface Root {
    success: boolean
    message: string
    data: Service
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

// Create a function to grab data service form BE

async function getServiceById(service_id: string): Promise<Service | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${service_id}`
        const response = await fetch(
            url, {
            method: `GET`,
            cache: `no-store`,
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies(`token`)}`
            }
        }
        )
        const responseData: Root = await response.json()
        if (!response.ok) {
            return null;
        }
        return responseData.data
    } catch (error) {
        console.log(error)
        return null
    }
}

// Define params URL to get service id
type PageProp = {
    params: Promise<{
        id: string
    }>
}
export default async function EditServicePage(props: PageProp) {
    // Get id of service from params 
    const { id } = await props.params;

    // call function to get service based on selected id
    const selectedService = await getServiceById(id);

    if (selectedService == null) {
        return <div className="p-5 bg-yellow-50 text-yellow-500 rounded font-semibold">
            Sorry , Service does not exist. please check your URL correctly.
        </div>;
    }

    return (
        <div className="w-full p-5">
            <h1 className="text-2xl font-bold mb-5">Edit Service</h1>
            <FormService service={selectedService} />
        </div>
    )

}