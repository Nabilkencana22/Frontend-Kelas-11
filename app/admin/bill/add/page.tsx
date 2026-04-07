import { getCookies } from "@/helper/cookies"
import FormBill from "./form"

interface ServiceResponse {
    success: boolean
    message: string
    data: Service[]
}

interface Service {
    id: number
    name: string
    price: number
}

interface CustomerResponse {
    success: boolean
    message: string
    data: Customer[]
    count: number
}

interface Customer {
    id: number
    name: string
    customer_number: string
    service_id: number
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

        const result: ServiceResponse = await response.json()

        if (!response.ok) return []

        return result.data
    } catch (error) {
        console.log(error)
        return []
    }
}

async function getAllCustomers(): Promise<Customer[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers`

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies("token")}`
            }
        })

        const result: CustomerResponse = await response.json()

        if (!response.ok) return []

        return result.data
    } catch (error) {
        console.log(error)
        return []
    }
}

export default async function AddBillPage() {
    const [services, customers] = await Promise.all([
        getAllService(),
        getAllCustomers()
    ])

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">
                Add Bill
            </h1>

            <FormBill services={services} customers={customers} />
        </div>
    )
}
