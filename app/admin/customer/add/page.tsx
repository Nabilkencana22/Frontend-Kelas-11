import { getCookies } from "@/helper/cookies"
import FormCustomer from "./form"

interface Root {
    success: boolean
    message: string
    data: Service[]
}

interface Service {
    id: number
    name: string
    price: number
}

async function getAllService(): Promise<Service[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies("token")}`
            }
        })

        const result: Root = await response.json()

        if (!response.ok) return []

        return result.data
    } catch (error) {
        console.log(error)
        return []
    }
}

// Define params URL to get service id
type PageProp = {
    params: Promise<{
        id: string
    }>
}
export default async function AddCustomerPage() {

    const services = await getAllService()

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">
                Add Customer
            </h1>

            <FormCustomer services={services} />
        </div>
    )
}