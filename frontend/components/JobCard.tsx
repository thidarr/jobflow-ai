"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type JobCardProps = {
    id: number;
    title: string;
    company: string;
    status: string;
    applied_date: string | null;
    follow_up_date: string | null;
    isSingle?: boolean;
};

type AIMatchResult = {
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
    strengths: string[];
    explanation: string;
};

export default function JobCard({
    id,
    title,
    company,
    status,
    applied_date,
    follow_up_date,
    isSingle = false,
}: JobCardProps) {
    const [currentStatus, setCurrentStatus] = useState(status);
    const [currentFollowUpDate, setCurrentFollowUpDate] =
        useState(follow_up_date);

    const [aiResult, setAiResult] = useState<AIMatchResult | null>(null);
    const [aiError, setAiError] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const router = useRouter();

    const followUpDate = currentFollowUpDate
        ? new Date(currentFollowUpDate)
        : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (followUpDate !== null) {
        followUpDate.setHours(0, 0, 0, 0);
    }

    let followUpStatus = "";

    if (followUpDate !== null && followUpDate < today) {
        followUpStatus = "Overdue";
    } else if (
        followUpDate !== null &&
        followUpDate.getTime() === today.getTime()
    ) {
        followUpStatus = "Due today";
    } else if (followUpDate !== null && followUpDate > today) {
        followUpStatus = "Upcoming";
    }

    let followUpStyle = "";

    if (followUpStatus === "Overdue") {
        followUpStyle = "bg-red-50 text-red-600 border-red-100";
    } else if (followUpStatus === "Due today") {
        followUpStyle = "bg-orange-50 text-orange-600 border-orange-100";
    } else if (followUpStatus === "Upcoming") {
        followUpStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    let statusStyle =
        "bg-violet-50 text-violet-700 border-violet-100";

    if (currentStatus === "Applied") {
        statusStyle = "bg-blue-50 text-blue-700 border-blue-100";
    } else if (currentStatus === "Interview") {
        statusStyle = "bg-amber-50 text-amber-700 border-amber-100";
    } else if (currentStatus === "Offer") {
        statusStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (currentStatus === "Rejected") {
        statusStyle = "bg-red-50 text-red-700 border-red-100";
    }

    async function updateStatus(newStatus: string) {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        if (response.ok) {
            setCurrentStatus(newStatus);
        }
    }

    async function updateFollowUpDate(newDate: string) {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                follow_up_date: newDate || null,
            }),
        });

        if (response.ok) {
            setCurrentFollowUpDate(newDate || null);
        }
    }

    async function analyzeMatch() {
        setIsAnalyzing(true);
        setAiError("");

        try {
            const response = await fetch(
                `${API_URL}/jobs/${id}/ai-match`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                setAiError(
                    "AI analysis is currently unavailable. Please try again later."
                );
                return;
            }

            const data = await response.json();
            setAiResult(data.ai_match);
        } catch {
            setAiError(
                "Could not connect to the server. Please try again."
            );
        } finally {
            setIsAnalyzing(false);
        }
    }

    async function deleteJob() {
        const confirmed = window.confirm(
            `Delete "${title}" at ${company}? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(`${API_URL}/jobs/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            router.refresh();
        }
    }

    return (
        <article
            className="
                overflow-hidden rounded-2xl
                border border-violet-100
                bg-white/95
                shadow-[0_8px_30px_rgba(109,40,217,0.08)]
            "
        >
            {/* Job header */}
            <div className="border-b border-violet-100/70 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg
                                    bg-linear-to-br
                                    from-violet-600 to-pink-500
                                    text-sm text-white shadow-sm
                                "
                            >
                                ✦
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h2>

                                <p className="mt-0.5 text-sm text-gray-500">
                                    {company}
                                </p>
                            </div>
                        </div>
                    </div>

                    <select
                        value={currentStatus}
                        onChange={(event) =>
                            updateStatus(event.target.value)
                        }
                        className={`
                            cursor-pointer rounded-full
                            border px-3 py-1.5
                            text-xs font-medium
                            outline-none
                            transition-all duration-200
                            hover:shadow-sm
                            ${statusStyle}
                        `}
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {applied_date !== null && (
                    <p className="mt-3 text-xs text-gray-400">
                        Applied on {applied_date}
                    </p>
                )}
            </div>

            <div className="p-6">
                {/* Follow-up */}
                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        Follow-up
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Choose when you want to follow up on this application.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            value={currentFollowUpDate ?? ""}
                            onChange={(event) =>
                                updateFollowUpDate(event.target.value)
                            }
                            className="
                                rounded-lg
                                border border-violet-200
                                bg-white px-3 py-2
                                text-sm text-gray-700
                                outline-none transition
                                focus:border-violet-400
                                focus:ring-2 focus:ring-violet-100
                            "
                        />

                        {currentFollowUpDate && (
                            <button
                                type="button"
                                onClick={() => updateFollowUpDate("")}
                                className="
                                    text-sm font-medium text-gray-400
                                    transition
                                    hover:text-red-500
                                "
                            >
                                Clear
                            </button>
                        )}

                        {currentFollowUpDate !== null && (
                            <span
                                className={`
                                    rounded-full border
                                    px-2.5 py-1
                                    text-xs font-medium
                                    ${followUpStyle}
                                `}
                            >
                                {followUpStatus}
                            </span>
                        )}
                    </div>

                    {currentFollowUpDate !== null && (
                        <p className="mt-2 text-xs text-gray-400">
                            Follow up: {currentFollowUpDate}
                        </p>
                    )}
                </div>

                {/* AI Match */}
                <div className="mt-6 border-t border-violet-100 pt-5">
                    <div
                        className={
                            isSingle
                                ? "flex flex-wrap items-center justify-between gap-4"
                                : ""
                        }
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                AI Job Match
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Compare this role with your candidate profile.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={analyzeMatch}
                            disabled={isAnalyzing}
                            className={`
                                inline-flex items-center gap-2
                                rounded-lg
                                bg-linear-to-r
                                from-violet-600 to-pink-500
                                px-5 py-2.5
                                text-sm font-medium text-white
                                shadow-sm
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:shadow-md
                                hover:brightness-105
                                active:translate-y-0
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                disabled:hover:translate-y-0
                                ${isSingle ? "" : "mt-4"}
                            `}
                        >
                            <span>
                                {isAnalyzing ? "◌" : "✦"}
                            </span>

                            {isAnalyzing
                                ? "Analyzing..."
                                : "Analyze Match"}
                        </button>
                    </div>

                    {aiError && (
                        <div
                            className="
                                mt-4 rounded-lg
                                border border-red-100
                                bg-red-50 px-4 py-3
                                text-sm text-red-600
                            "
                        >
                            {aiError}
                        </div>
                    )}

                    {aiResult && (
                        <div
                            className="
                                mt-5 rounded-xl
                                border border-violet-100
                                bg-linear-to-br
                                from-violet-50/80
                                via-white
                                to-pink-50/70
                                p-5
                            "
                        >
                            {/* Score */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex h-16 w-16
                                        shrink-0 items-center justify-center
                                        rounded-full
                                        bg-linear-to-br
                                        from-violet-600 to-pink-500
                                        text-lg font-bold text-white
                                        shadow-sm
                                    "
                                >
                                    {aiResult.match_score}%
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        AI Match Score
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Based on your current candidate profile.
                                    </p>
                                </div>
                            </div>

                            {/* Skills */}
                            <div
                                className={`mt-6 grid gap-5 ${
                                    isSingle
                                        ? "md:grid-cols-2"
                                        : "grid-cols-1"
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Matched Skills
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {aiResult.matched_skills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                    className="
                                                        rounded-full
                                                        border border-emerald-100
                                                        bg-emerald-50
                                                        px-2.5 py-1
                                                        text-xs font-medium
                                                        text-emerald-700
                                                    "
                                                >
                                                    ✓ {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Missing Skills
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {aiResult.missing_skills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                    className="
                                                        rounded-full
                                                        border border-pink-100
                                                        bg-pink-50
                                                        px-2.5 py-1
                                                        text-xs font-medium
                                                        text-pink-700
                                                    "
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Strengths */}
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-gray-800">
                                    Strengths
                                </p>

                                <ul className="mt-2 space-y-2">
                                    {aiResult.strengths.map(
                                        (strength) => (
                                            <li
                                                key={strength}
                                                className="
                                                    flex gap-2
                                                    text-sm leading-relaxed
                                                    text-gray-600
                                                "
                                            >
                                                <span className="text-violet-500">
                                                    ✦
                                                </span>

                                                <span>{strength}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* Explanation */}
                            <div
                                className="
                                    mt-6 rounded-lg
                                    border border-violet-100
                                    bg-white/80 p-4
                                "
                            >
                                <p className="text-sm font-semibold text-gray-800">
                                    Explanation
                                </p>

                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                    {aiResult.explanation}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete rejected job */}
                {currentStatus === "Rejected" && (
                    <div className="mt-6 border-t border-red-100 pt-5">
                        <div
                            className="
                                flex flex-wrap
                                items-center justify-between
                                gap-3
                                rounded-lg
                                bg-red-50/60 p-4
                            "
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    No longer pursuing this application?
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    You can permanently remove it from JobFlow.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={deleteJob}
                                className="
                                    inline-flex items-center gap-2
                                    rounded-lg
                                    border border-red-200
                                    bg-white px-4 py-2
                                    text-sm font-medium text-red-600
                                    shadow-sm
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-red-300
                                    hover:bg-red-50
                                    hover:shadow-md
                                    active:translate-y-0
                                "
                            >
                                <span aria-hidden="true">×</span>
                                Delete Job
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}