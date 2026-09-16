import JobCard from "@/components/JobCard";
import AddJobForm from "@/components/AddJobForm";
import CandidateProfile from "@/components/CandidateProfile";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Job = {
  id: number;
  title: string;
  company: string;
  description: string | null;
  status: string;
  applied_date: string | null;
  follow_up_date: string | null;
};

export default async function Home() {
  const response = await fetch(`${API_URL}/jobs`, {
    cache: "no-store",
  });

  const jobs: Job[] = await response.json();

  return (
    <div
      className="
      relative min-h-screen overflow-hidden
      text-black
    "
      style={{
        background:
          "linear-gradient(135deg, #eee9ff 0%, #f9e8ff 25%, #ffe7f2 50%, #eee9ff 75%, #e4edff 100%)",
      }}
    >
      {/* Large soft lavender area */}
      <div
        className="
        pointer-events-none absolute
        -left-48 -top-48
        h-[700px] w-[700px]
        rounded-full
        bg-violet-300/30
        blur-[100px]
      "
      />

      {/* Large soft pink area */}
      <div
        className="
        pointer-events-none absolute
        -right-48 top-10
        h-[700px] w-[700px]
        rounded-full
        bg-pink-300/35
        blur-[110px]
      "
      />

      {/* Middle lavender */}
      <div
        className="
        pointer-events-none absolute
        -left-52 top-[700px]
        h-[650px] w-[650px]
        rounded-full
        bg-indigo-300/25
        blur-[110px]
      "
      />

      {/* Middle pink */}
      <div
        className="
        pointer-events-none absolute
        -right-48 top-[900px]
        h-[650px] w-[650px]
        rounded-full
        bg-rose-300/25
        blur-[110px]
      "
      />

      {/* Bottom blue */}
      <div
        className="
        pointer-events-none absolute
        -left-40 top-[1400px]
        h-[650px] w-[650px]
        rounded-full
        bg-blue-300/25
        blur-[110px]
      "
      />

      {/* Sparkles */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-28 text-4xl text-white/80"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[9%] top-48 text-xl text-white/70"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-52 text-4xl text-white/80"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[420px] text-2xl text-white/70"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[7%] top-[850px] text-3xl text-white/70"
      >
        ✦
      </span>

      <main className="relative mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-indigo-700">
              JobFlow
            </span>{" "}
            <span
              className="
      bg-linear-to-r
      from-violet-600 to-pink-500
      bg-clip-text text-transparent
    "
            >
              AI
            </span>
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your job applications smarter.
          </p>
        </div>

        <CandidateProfile />

        <AddJobForm />

        <div
          className={`grid gap-4 ${jobs.length === 1 ? "grid-cols-1" : "md:grid-cols-2"
            }`}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              status={job.status}
              applied_date={job.applied_date}
              follow_up_date={job.follow_up_date}
              isSingle={jobs.length === 1}
            />
          ))}
        </div>
      </main>
    </div>
  );
}