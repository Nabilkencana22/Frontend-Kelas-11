import { getCookies } from "@/helper/cookies"
import { Shield, User, Phone, AtSign, Calendar, Clock, Contact } from "lucide-react"

export interface ResponAdminProfile {
    success: boolean
    message: string
    data: Admin
}

export interface Admin {
    id: number
    user_id: number
    name: string
    phone: string
    owner_token: string
    createdAt: string
    updatedAt: string
    user: UserType
}

export interface UserType {
    id: number
    username: string
    password: string
    role: string
    owner_token: string
    createdAt: string
    updatedAt: string
}

async function getAdminProfile(): Promise<Admin | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins/me`
        const response = await fetch(
            url , {
                method: `GET` ,
                headers : {
                    "APP-KEY" : process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization" : `Bearer ${await getCookies(`token`)}` 
                }
            }
        )

        const responseData : ResponAdminProfile = await response.json();
        if (!response.ok) {
            return null;
        }

        return responseData.data
        
    }catch (error) {
        console.log(error);
        return null 
    }
}

export default async function ProfilePage () {
    const adminProfile = await getAdminProfile();

    if(adminProfile == null) {
        return (
            <div className="w-full flex justify-center items-center h-[60vh]">
                <div className="glass-card border-red-100 p-8 flex flex-col items-center gap-4 text-center max-w-md animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Access Denied</h2>
                        <p className="text-slate-500 font-medium">Sorry, Admin profile does not exist or your session has expired. Please sign in again.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in p-5 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Shield size={20} />
                        </div>
                        Administrator Profile
                    </h1>
                    <p className="text-slate-400 font-bold text-sm mt-1 indent-14 italic">
                        Manage your administrative account details
                    </p>
                </div>
            </div>

            {/* Profile Card View */}
            <div className="glass-card overflow-hidden rounded-2xl">
                {/* Cover & Avatar Header */}
                <div className="h-32 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 relative">
                    <div className="absolute -bottom-12 left-10">
                        <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-xl shadow-slate-200/50 flex transition-transform hover:scale-105">
                            <div className="w-full h-full gradient-blue rounded-xl flex items-center justify-center text-white text-3xl font-black">
                                {adminProfile.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-10">
                    <h2 className="text-2xl font-black text-slate-800">{adminProfile.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            {adminProfile.user.role}
                        </span>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                                    <Contact size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                                    <p className="font-bold text-slate-700">{adminProfile.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                    <AtSign size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Username</p>
                                    <p className="font-bold text-slate-700">{adminProfile.user.username}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                    <p className="font-bold text-slate-700">{adminProfile.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Account Created</p>
                                    <p className="font-bold text-slate-700">
                                        {new Date(adminProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}