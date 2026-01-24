import { getCookies } from "@/helper/cookies"

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

async function getCustomerProfile(): Promise<Customer | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/me`
        const response = await fetch(
            url , {
                method : `GET` , 
                headers : {
                    "APP-KEY" : process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization" : `Bearer ${await getCookies(`token`)}`
                }
            }
        )

        const responseData : ResponCustomerProfile = await response.json()
        if(!response.ok){
            return null;
        }

        return responseData.data

    }catch(error) {
        console.log(error)
        return null
    }
}

export default async function ProfilePage (){
    const customerProfile = await getCustomerProfile();

    if(customerProfile == null) {
        return(
            <div className="w-full p-3 bg-slate-50">
                Sorry , Customer Profile does not exist , you have to Sign In First.
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white shadow rounded-xl p-6 space-y-5">

                <h1 className="text-2xl font-semibold">
                    Customer Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <p className="text-sm text-gray-500">Customer Number</p>
                        <p className="font-medium">
                            {customerProfile.customer_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                            {customerProfile.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                            {customerProfile.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                            {customerProfile.address}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Service ID</p>
                        <p className="font-medium">
                            {customerProfile.service_id}
                        </p>
                    </div>

                </div>

                <hr />

                <div>
                    <h2 className="font-semibold mb-3">Account Info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">
                                {customerProfile.user.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-medium">
                                {customerProfile.user.role}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="text-sm text-gray-400">
                    Created at:{" "}
                    {new Date(customerProfile.createdAt).toLocaleDateString()}
                </div>

            </div>
        </div>
    )
}