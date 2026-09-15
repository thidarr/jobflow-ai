"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type JobCardProps = {
    id: number;
    title: string;
    company: string;
    status: string;
    applied_date: string | null;
    follow_up_date: string | null;
};

type AIMatchResult = {
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
    strengths: string[];
    explanation: string;
}

export default function JobCard({
    id,
    title,
    company,
    status,
    applied_date,
    follow_up_date,
}: JobCardProps) {

    const [currentStatus, setCurrentStatus] = useState(status);
    const [currentFollowUpDate, setCurrentFollowUpDate] = useState(follow_up_date);
    const [aiResult, setAiResult] = useState<AIMatchResult | null>(null);
    const [aiError, setAiError] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        followUpStyle = "bg-red-100 text-red-700";
    }
    else if (followUpStatus === "Due today") {
        followUpStyle = "bg-orange-100 text-orange-700";
    }
    else if (followUpStatus === "Upcoming") {
        followUpStyle = "bg-green-100 text-green-700";
    }

    let statusStyle = "bg-gray-100 text-gray-700";
    if (currentStatus === "Applied") {
        statusStyle = "bg-blue-100 text-blue-700";
    } else if (currentStatus === "Interview") {
        statusStyle = "bg-yellow-100 text-yellow-700";
    } else if (currentStatus === "Offer") {
        statusStyle = "bg-green-100 text-green-700";
    } else if (currentStatus === "Rejected") {
        statusStyle = "bg-red-100 text-red-700";
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
            setAiResult(data);

        } catch {
            setAiError(
                "Could not connect to the server. Please try again."
            );

        } finally {
            setIsAnalyzing(false);
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white text-center p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>

            <p className="mt-1 text-sm text-gray-600">
                {company}
            </p>

            <div className="mt-3 mb-3">
                <select
                    value={currentStatus}
                    onChange={(event) => {
                        updateStatus(event.target.value);
                    }}
                    className={`
                    cursor-pointer rounded-full border-0
                    px-3 py-1.5
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
            <div>
                {applied_date !== null && (
                    <p className="mt-1 text-sm text-gray-600">
                        Applied: {applied_date}
                    </p>
                )
                }
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
                <input
                    type="date"
                    value={currentFollowUpDate ?? ""}
                    onChange={(event) => {
                        updateFollowUpDate(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />

                {currentFollowUpDate && (
                    <button
                        type="button"
                        onClick={() => updateFollowUpDate("")}
                        className="text-sm text-gray-500 hover:text-red-600"
                    >
                        Clear
                    </button>
                )}
            </div>
            <div>
                {currentFollowUpDate !== null && (
                    <div className="mt-2">
                        <p className="mt-1 text-sm text-gray-600">
                            Follow up: {currentFollowUpDate}
                        </p>
                        <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${followUpStyle}`}>
                            {followUpStatus}
                        </span>

                    </div>
                )
                }
            </div>
            <button
                type="button"
                onClick={analyzeMatch}
                disabled={isAnalyzing}
                className="
                 mt-4 inline-flex items-center gap-2
                 rounded-lg bg-gray-900 px-4 py-2
                 text-sm font-medium text-white
                 shadow-sm
                 transition-all duration-200
                 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md
                 active:translate-y-0
                 disabled:cursor-not-allowed disabled:opacity-50
                 disabled:hover:translate-y-0
                "
            >
                <span>{isAnalyzing ? "◌" : "✦"}</span>
                {isAnalyzing ? "Analyzing..." : "Analyze Match"}
            </button>
            {aiError && (
                <p className="mt-2 text-sm text-red-600">
                    {aiError}
                </p>
            )}
            {aiResult && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
                    <p className="text-sm font-medium text-gray-700">
                        AI Match Score
                    </p>

                    <span className="text-xl font-bold text-gray-900">
                        {aiResult.match_score}%
                    </span>

                    <p className="mt-4 text-sm font-medium text-gray-700">
                        Matched Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {aiResult.matched_skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-700">
                        Missing Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {aiResult.missing_skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-700">
                        Strengths
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-left">
                        {aiResult.strengths.map((strength) => (
                            <li key={strength} className="text-xs text-gray-600">
                                {strength}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 text-sm font-medium text-gray-700">
                        Explanation
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {aiResult.explanation}
                    </p>

                </div>
            )}
        </div>
    );
}