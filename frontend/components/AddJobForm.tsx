"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddJobForm() {
    const router = useRouter();
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentCompany, setCurrentCompany] = useState("");
    const [currentDescription, setCurrentDescription] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch(`${API_URL}/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: currentTitle,
                company: currentCompany,
                description: currentDescription,
            }),
        });
        if (response.ok) {
            setCurrentTitle("");
            setCurrentCompany("");
            setCurrentDescription("");
            router.refresh();
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
            <h2 className="text-lg font-semibold text-gray-900">
                Add New Job
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Job Title
                    </label>

                    <input
                        type="text"
                        value={currentTitle}
                        onChange={(event) => {
                            setCurrentTitle(event.target.value);
                        }}
                        placeholder="e.g. AI Engineer"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Company Name
                    </label>

                    <input
                        type="text"
                        value={currentCompany}
                        onChange={(event) => {
                            setCurrentCompany(event.target.value);
                        }}
                        placeholder="e.g. Google"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                </label>

                <textarea
                    value={currentDescription}
                    onChange={(event) => {
                        setCurrentDescription(event.target.value);
                    }}
                    placeholder="Paste the job description..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                />
            </div>

            <button
                type="submit"
                className="
                mt-4 inline-flex items-center gap-2
                rounded-lg bg-gray-900 px-4 py-2
                text-sm font-medium text-white
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md
                active:translate-y-0
            "
            >
                <span className="text-lg leading-none">+</span>
                Add Job
            </button>

        </form>
    );
}
