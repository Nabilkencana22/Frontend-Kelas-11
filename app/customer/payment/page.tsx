import { cookies } from "next/headers";
import PaymentForm from "./PaymentForm";

type Props = {
    searchParams: Promise<{
        billId?: string;
        status?: string;
    }>;
};

export default async function PaymentPage({ searchParams }: Props) {
    const params = await searchParams;
    const paymentSuccess = params?.status === "success";
    const billId = params?.billId;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    return (
        <div className="w-full p-5">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Bayar Tagihan</h1>
                <p className="text-sm text-gray-600">Unggah bukti pembayaran dalam bentuk foto.</p>
            </div>

            {paymentSuccess && (
                <div className="mb-5 rounded-md bg-green-100 p-4 text-green-700">
                    Pembayaran untuk tagihan #{billId ? billId : ""} berhasil terkirim.
                </div>
            )}

            <PaymentForm billId={billId} token={token} />
        </div>
    );
}