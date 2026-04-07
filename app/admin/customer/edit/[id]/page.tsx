import { getCookies } from "@/helper/cookies"
import FormCustomerEdit from "./form"

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

interface CustomerData {
    id: number
    user_id: number
    customer_number: string
    name: string
    phone: string
    address: string
    service_id: number
    createdAt: string
    updatedAt: string
    user: {
        id: number
        username: string
        role: string
    }
}

interface CustomerResponse {
    success: boolean
    message: string
    data: CustomerData
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

async function getCustomerById(id: string): Promise<CustomerData | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}`

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies("token")}`
            }
        })

        const result: CustomerResponse = await response.json()

        if (!response.ok) return null

        return result.data
    } catch (error) {
        console.log(error)
        return null
    }
}

type PageProp = {
    params: Promise<{
        id: string
    }>
}

export default async function EditCustomerPage(props: PageProp) {
    const params = await props.params
    const { id } = params

    const [services, customer] = await Promise.all([
        getAllService(),
        getCustomerById(id)
    ])

    if (!customer) {
        return (
            <div className="w-full p-5">
                <div className="w-full rounded p-5 bg-red-200 text-red-600 font-semibold">Customer not found</div>
            </div>
        )
    }

    return (
        <div className="w-full p-5">
            <FormCustomerEdit
                services={services}
                customer={customer}
                customerId={id}
            />
        </div>
    )
}
