type JobCardProps = {
    title: string;
    company: string;
    status: string;
};

export default function JobCard({
    title,
    company,
    status,
}: JobCardProps) {
    let statusStyle = "bg-gray-100 text-gray-700";
    if (status === "Applied") {
        statusStyle = "bg-blue-100 text-blue-700";
    } else if (status === "Interview") {
        statusStyle = "bg-yellow-100 text-yellow-700";
    } else if (status === "Offer") {
        statusStyle = "bg-green-100 text-green-700";
    } else if (status === "Rejected") {
        statusStyle = "bg-red-100 text-red-700";
    }
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>

            <p className="mt-1 text-sm text-gray-600">
                {company}
            </p>

            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyle}`}>
                {status}
            </span>
        </div>
    );
}