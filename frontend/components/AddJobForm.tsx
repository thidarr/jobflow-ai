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
            className="
                mb-6 rounded-2xl
                border border-violet-100
                bg-white/95 p-6
                shadow-[0_8px_30px_rgba(109,40,217,0.08)]
            "
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <div
                    className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg
                        bg-linear-to-br from-violet-600 to-pink-500
                        text-lg font-medium text-white
                        shadow-sm
                    "
                >
                    +
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                    Add New Job
                </h2>
            </div>

            {/* Job title + company */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="job-title"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Job Title
                    </label>

                    <input
                        id="job-title"
                        type="text"
                        value={currentTitle}
                        onChange={(event) => {
                            setCurrentTitle(event.target.value);
                        }}
                        placeholder="e.g. AI Engineer"
                        required
                        className="
                            w-full rounded-lg
                            border border-violet-200
                            bg-white px-3 py-2.5
                            text-sm text-gray-900
                            outline-none transition
                            placeholder:text-gray-400
                            focus:border-violet-400
                            focus:ring-2 focus:ring-violet-100
                        "
                    />
                </div>

                <div>
                    <label
                        htmlFor="company-name"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Company Name
                    </label>

                    <input
                        id="company-name"
                        type="text"
                        value={currentCompany}
                        onChange={(event) => {
                            setCurrentCompany(event.target.value);
                        }}
                        placeholder="e.g. Google"
                        required
                        className="
                            w-full rounded-lg
                            border border-violet-200
                            bg-white px-3 py-2.5
                            text-sm text-gray-900
                            outline-none transition
                            placeholder:text-gray-400
                            focus:border-violet-400
                            focus:ring-2 focus:ring-violet-100
                        "
                    />
                </div>
            </div>

            {/* Description */}
            <div className="mt-4">
                <label
                    htmlFor="job-description"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                    Description
                </label>

                <textarea
                    id="job-description"
                    value={currentDescription}
                    onChange={(event) => {
                        setCurrentDescription(event.target.value);
                    }}
                    placeholder="Paste the job description..."
                    rows={4}
                    className="
                        w-full resize-none rounded-lg
                        border border-violet-200
                        bg-white px-3 py-2.5
                        text-sm text-gray-900
                        outline-none transition
                        placeholder:text-gray-400
                        focus:border-violet-400
                        focus:ring-2 focus:ring-violet-100
                    "
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="
                    mt-4 inline-flex items-center gap-2
                    rounded-lg
                    bg-linear-to-r from-violet-600 to-pink-500
                    px-5 py-2.5
                    text-sm font-medium text-white
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:shadow-md
                    hover:brightness-105
                    active:translate-y-0
                "
            >
                <span className="text-lg leading-none">+</span>
                Add Job
            </button>
        </form>
    );
}