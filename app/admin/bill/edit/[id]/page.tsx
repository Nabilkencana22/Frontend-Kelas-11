import { getCookies } from "@/helper/cookies"
import FormBillEdit from "./form"

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

interface BillData {
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
    createdAt: string
    updatedAt: string
}

interface BillResponse {
    success: boolean
    message: string
    data: BillData
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

async function getBillById(id: string): Promise<BillData | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/bills/${id}`

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${await getCookies("token")}`
            }
        })

        const result: BillResponse = await response.json()

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

export default async function EditBillPage(props: PageProp) {
    const params = await props.params
    const { id } = params

    const [services, customers, bill] = await Promise.all([
        getAllService(),
        getAllCustomers(),
        getBillById(id)
    ])

    if (!bill) {
        return (
            <div className="w-full p-5">
                <div className="w-full rounded p-5 bg-red-200 text-red-600 font-semibold">Bill not found</div>
            </div>
        )
    }

    return (
        <div className="w-full p-5">
            <h1 className="text-2xl font-bold mb-5">
                Edit Bill
            </h1>

            <FormBillEdit
                services={services}
                customers={customers}
                bill={bill}
                billId={id}
            />
        </div>
    )
}
