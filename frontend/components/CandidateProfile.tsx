"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Candidate = {
    id: number;
    name: string;
    skills: string[];
};

export default function CandidateProfile() {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSkills, setEditSkills] = useState("");

    useEffect(() => {
        async function fetchCandidate() {
            const response = await fetch(`${API_URL}/candidate`);
            const data = await response.json();

            if (response.ok) {
                setCandidate(data);
            }
        }

        fetchCandidate();
    }, []);

    async function saveProfile() {
        const skillsArray = editSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        const response = await fetch(`${API_URL}/candidate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: editName,
                skills: skillsArray,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setCandidate(data);
            setIsEditing(false);
        }
    }

    return (
        <section
            className="
                mb-8 overflow-hidden rounded-2xl
                border border-violet-100
                bg-white/95
                shadow-[0_8px_30px_rgba(109,40,217,0.08)]
            "
        >
            {/* Header */}
            <div className="border-b border-violet-100/70 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg
                                    bg-linear-to-br from-violet-600 to-pink-500
                                    text-sm text-white shadow-sm
                                "
                            >
                                ✦
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900">
                                Candidate Profile
                            </h2>
                        </div>

                        <p className="mt-1 pl-10 text-sm text-gray-500">
                            Manage the skills used for AI job matching.
                        </p>
                    </div>

                    {!isEditing && candidate && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditName(candidate.name);
                                setEditSkills(candidate.skills.join(", "));
                                setIsEditing(true);
                            }}
                            className="
                                rounded-lg border border-violet-200
                                bg-violet-50/70
                                px-4 py-2
                                text-sm font-medium text-violet-700
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:border-violet-300
                                hover:bg-violet-100
                                hover:shadow-sm
                                active:translate-y-0
                            "
                        >
                            ✎ Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {candidate && (
                <div className="px-6 py-6">
                    {isEditing ? (
                        <div className="mx-auto max-w-2xl">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="candidate-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>

                                <input
                                    id="candidate-name"
                                    type="text"
                                    value={editName}
                                    onChange={(event) =>
                                        setEditName(event.target.value)
                                    }
                                    className="
                                        w-full rounded-lg
                                        border border-violet-200
                                        bg-white px-3 py-2.5
                                        text-sm text-gray-900
                                        outline-none transition
                                        focus:border-violet-400
                                        focus:ring-2 focus:ring-violet-100
                                    "
                                />
                            </div>

                            {/* Skills */}
                            <div className="mt-5">
                                <label
                                    htmlFor="candidate-skills"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Skills
                                </label>

                                <textarea
                                    id="candidate-skills"
                                    value={editSkills}
                                    onChange={(event) =>
                                        setEditSkills(event.target.value)
                                    }
                                    rows={4}
                                    className="
                                        w-full resize-none rounded-lg
                                        border border-violet-200
                                        bg-white px-3 py-2.5
                                        text-sm text-gray-900
                                        outline-none transition
                                        focus:border-violet-400
                                        focus:ring-2 focus:ring-violet-100
                                    "
                                />

                                <p className="mt-2 text-xs text-gray-400">
                                    Separate each skill with a comma.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-5 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="
                                        rounded-lg border border-gray-300
                                        bg-white px-4 py-2
                                        text-sm font-medium text-gray-700
                                        shadow-sm
                                        transition-all duration-200
                                        hover:-translate-y-0.5
                                        hover:border-violet-200
                                        hover:bg-violet-50
                                        hover:text-violet-700
                                        hover:shadow-md
                                        active:translate-y-0
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={saveProfile}
                                    className="
                                        rounded-lg
                                        bg-linear-to-r
                                        from-violet-600 to-pink-500
                                        px-4 py-2
                                        text-sm font-medium text-white
                                        shadow-sm
                                        transition-all duration-200
                                        hover:-translate-y-0.5
                                        hover:shadow-md
                                        hover:brightness-105
                                        active:translate-y-0
                                    "
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Candidate */}
                            <div className="text-center">
                                <div
                                    className="
                                        mx-auto flex h-14 w-14
                                        items-center justify-center
                                        rounded-full
                                        bg-linear-to-br
                                        from-violet-600 to-pink-500
                                        text-xl font-semibold text-white
                                        shadow-md
                                        ring-4 ring-violet-50
                                    "
                                >
                                    {candidate.name.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                                    {candidate.name}
                                </h3>
                            </div>

                            {/* Skills */}
                            <div
                                className="
                                    mx-auto mt-5 flex max-w-3xl
                                    flex-wrap justify-center gap-2
                                "
                            >
                                {candidate.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="
                                            rounded-full
                                            border border-violet-200
                                            bg-violet-50
                                            px-3 py-1.5
                                            text-xs font-medium
                                            text-violet-700
                                            transition-all duration-200
                                            hover:-translate-y-0.5
                                            hover:border-violet-300
                                            hover:bg-violet-100
                                        "
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}