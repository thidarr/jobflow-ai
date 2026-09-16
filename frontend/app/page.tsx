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
        bg-linear-to-b
        from-blue-100 via-indigo-60 to-violet-200
        text-black
      "
    >
      <div
        className="
          pointer-events-none absolute
          -left-40 -top-40
          h-150 w-150
          rounded-full bg-cyan-300/40 blur-3xl
        "
      />

      <div
        className="
          pointer-events-none absolute
          -right-40 top-300
          h-162.5 w-162.5
          rounded-full bg-violet-300/40 blur-3xl
        "
      />

      <div
        className="
          pointer-events-none absolute
          -left-32 top-300
          h-137.5 w-137.5
          rounded-full bg-indigo-300/30 blur-3xl
        "
      />

      <main className="relative mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1
            className="
              bg-linear-to-r from-blue-700 to-violet-700
              bg-clip-text text-3xl font-bold text-transparent
            "
          >
            JobFlow AI
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your job applications smarter.
          </p>
        </div>

        <CandidateProfile />

        <AddJobForm />

        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              status={job.status}
              applied_date={job.applied_date}
              follow_up_date={job.follow_up_date}
            />
          ))}
        </div>
      </main>
    </div>
  );
}