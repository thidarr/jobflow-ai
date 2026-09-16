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
                "Content-Type": "application/json"
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
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Candidate Profile
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
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
                            rounded-lg border border-gray-200
                            px-4 py-2 text-sm font-medium text-gray-700
                            transition-all duration-200
                            hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm
                        "
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {candidate && (
                <div className="px-6 py-5">
                    {isEditing ? (
                        <div className="mx-auto max-w-2xl">
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
                                    w-full rounded-lg border border-gray-300
                                    bg-white px-3 py-2.5 text-sm text-gray-900
                                    outline-none transition
                                    focus:border-gray-500 focus:ring-2 focus:ring-gray-100
                                "
                                />
                            </div>

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
                                    w-full resize-none rounded-lg border border-gray-300
                                    bg-white px-3 py-2.5 text-sm text-gray-900
                                    outline-none transition
                                    focus:border-gray-500 focus:ring-2 focus:ring-gray-100
                                "
                                />

                                <p className="mt-2 text-xs text-gray-400">
                                    Separate each skill with a comma.
                                </p>
                            </div>

                            <div className="mt-5 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="
        rounded-lg border border-gray-300
        px-4 py-2 text-sm font-medium text-gray-700
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:border-gray-400
        hover:bg-gray-50 hover:shadow-md
        active:translate-y-0 active:shadow-sm
    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={saveProfile}
                                    className="
                                    rounded-lg bg-gray-900 px-4 py-2
                                    text-sm font-medium text-white shadow-sm
                                    transition-all duration-200
                                    hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md
                                    active:translate-y-0
                                "
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center">
                                <div
                                    className="
                                    mx-auto flex h-12 w-12 items-center justify-center
                                    rounded-full bg-gray-900
                                    text-lg font-semibold text-white
                                "
                                >
                                    {candidate.name.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                                    {candidate.name}
                                </h3>

                            </div>

                            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
                                {candidate.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="
                                        rounded-full border border-gray-200
                                        bg-gray-50 px-3 py-1.5
                                        text-xs font-medium text-gray-700
                                        transition hover:bg-gray-100
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