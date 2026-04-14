"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    billId?: string;
    token: string;
};

export default function PaymentForm({ billId, token }: Props) {
    const router = useRouter();
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0];
        if (selected) {
            setSelectedFileName(selected.name);
            setFile(selected);
        } else {
            setSelectedFileName("");
            setFile(null);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!billId) {
            setError("Bill ID not found. Return to the bill page.");
            return;
        }
        if (!file) {
            setError("Please select a payment proof file first.");
            return;
        }

        setLoading(true);
        try {
            const body = new FormData();
            body.append("bill_id", String(Number(billId)));
            body.append("file", file, file.name);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payments`,
                {
                    method: "POST",
                    headers: {
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        Authorization: `Bearer ${token}`,
                    },
                    body,
                }
            );

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(
                    responseData.message || "Failed to upload payment proof."
                );
            }

            router.push(`/customer/bill?status=success&billId=${billId}`);
            router.refresh();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "An error occurred.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
            <p className="text-sm text-gray-600 mb-4">
                Please upload a photo of the payment proof for bill{" "}
                {billId ? `#${billId}` : "yours"}.
            </p>

            {error && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!billId && (
                    <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-700">
                        Bill ID is not available. Return to the bill page and
                        select a bill to pay.
                    </div>
                )}

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Select payment proof file
                    </label>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        required
                    />
                    {selectedFileName && (
                        <div className="mt-2 text-sm text-gray-700">
                            Selected: {selectedFileName}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!file || !billId || loading}
                    className="inline-flex items-center justify-center rounded bg-emerald-500 px-5 py-3 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Uploading..." : "Upload & Pay"}
                </button>
            </form>
        </div>
    );
}
