"use client"
import { storeCookies } from "@/helper/cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";

export interface LoginResponse {
    success?: boolean
    message?: string
    token?: string
    role?: string
    error?: string
    statusCode?: number
}


export default function SignIn() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [pending , startTransition] = useTransition()
    const router = useRouter()

    async function handleSignIn(event: FormEvent) {
        try {
            event.preventDefault()
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`
            const requestData = { username, password }
            const response = await fetch(
                url,
                {
                    method: `POST`,
                    body: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || ""
                    }
                }
            )

            const responseData : LoginResponse = await response.json();
            const message = responseData.message
            if (!response.ok) {
                // if status code not 200 , 201, 204 etc 
                toast.error(message , {containerId: `toastLogin`})
                return;
            }

            if (responseData?.success == true) {
                // Assume that login success
                toast.success(message , {containerId : `toastLogin`})
                startTransition (async function () {
                    await storeCookies (`token` , responseData?.token || "")
                    if (responseData.role == `ADMIN` ) 
                        setTimeout(() => router.push(`/admin`) , 1000)
                    if (responseData.role == `CUSTOMER `)
                        setTimeout(() => router.push(`/customer`) , 1000)
                })
            }else {
                // Assume that login invalid
                toast.warning(message , {containerId:`toastLogin`})
            }
            
        } catch (error) {
            console.log(error)
            alert(`Something Wrong`)
        }
    }

    return (
        <div className="w-full h-dvh flex justify-center items-center bg-blue-50">
            <ToastContainer containerId={`toastLogin`}/>
            <div className="bg-white w-full md:w-1/2 lg:w-1/3 p-10 rounded-xl flex flex-col items-center">
                <h1 className="font-bold text-blue-500 text-2xl text-center">
                    Sign In to PDAM
                </h1>
                <small className="text-sm text-slate-500 text-center mt-5">
                    Use your credential to sign in
                </small>

                <form className="w-full my-5" onSubmit={handleSignIn}>
                    <label htmlFor="username" className="text-blue-500 font-semibold ">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Masukkan username"
                        className="w-full p-2 rounded-lg border border-gray-300  focus:outline-blue-500" />



                    <label htmlFor="password" className="text-blue-500 font-semibold ">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Isikan password disini"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-blue-500" />

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-medium p-2 rounded-lg hover:bg-blue-600  mt-10">
                        Sing In
                    </button>
                </form>
                <small className="text-sm text-slate-500 text-center mt-5 ">
                    If you dont have an account , you can register
                    <Link className="font-semibold text-blue-500"
                        href={`/sign-up`}
                    > here
                    </Link>
                </small>

            </div>
        </div >
    )
}