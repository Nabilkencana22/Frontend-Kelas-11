// use client digunakan untuk menunjukkan halaman tersebut merupakan halaman client side rendering
// client side rendering berarti halaman tersebut dirender di sisi klien (browser) bukan di sisi server

// waktu yang tepat untuk menggunakan "use client":
// 1. ketika halaman tersebut membutuhkan interaksi user secara langsung
// 2. ketika halaman tersebut membutuhkan state management
// 3. ketika halaman tersebut membutuhkan efek samping (side effects) seperti fetching data di sisi klien
"use client"

import { useState } from "react";

export default function SignUpPage() {
    // Define state
    // State adalah variabel yang menyimpan informasi yang dapat berubah selama proses rendering komponen
    // State adalah variabel yang memyimpan data dinamis yang dapat berubah seiring interaksi user atau perubahan data lainnya

    const [username, setUsername] = useState<string>("");
    // Username : nama state yang menyimpan nilai input username
    // setUsername : fungsi untuk mengubah nilai state username
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    async function handleSignUp(e : React.FormEvent) {
        e.preventDefault();
        try{
            const request = JSON.stringify({ //Mengubah data JavaScript menjadi format JSON string
                username,
                password,
                phone,
                name
            })
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins`
            const response = await fetch(url , { //melakukan request ke server 
                method: "POST", 
                headers: {
                    "Content-Type" : "application/json",
                    "app-key" : `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })
            if (!response.ok) { //false
                alert("Gagal melakukan registrasi admin")
            }
            const responseData = await response.json();
            alert(responseData.message);
        }catch (error) {
            console.error("Error during sign up :" , error)
        }
    }

    return (
        <div className="w-full h-dvh bg-blue-50 p-3 flex items-center justify-center ">
            <div className="bg-white p-5 w-full md:w-1/2 lg:w-1/3 rounded-xl shadow-xl">
                <h1 className="text-center font-bold text-blue-500 text-2xl mb-6">
                    Register Admin PDAM
                </h1>

                {/* Username */}
                <form className="my-3" action="username" onSubmit={handleSignUp} >
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="w-full p-2 border border-gray-300 rounded-lg text-slate-900 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Isi username disini"
                        required
                    />
                </form>

                {/* Password */}
                <form className="my-3" action="password" >
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Masukkan Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-slate-900 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Buat password" />
                </form>

                {/* Nama */}
                <form className="my-3" action="nama" >
                    <label className="block text-sm font-medium text-gray-700" htmlFor="nama">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-slate-900 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Nama lengkap anda" />
                </form>

                {/* Phone */}
                <form className="my-3" action="phone" >
                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                        No. Telepon
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-slate-900 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="08xxxxxxxxxxxx" />
                </form>

                <button
                    type="submit"
                    onClick={handleSignUp}
                    className="w-full py-2 bg-blue-500 text-white font-medium p-2 rounded-lg hover:bg-blue-600 transition duration-200  mt-1  ">
                    Sing up
                </button>
            </div>
        </div>
    )
}