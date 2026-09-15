import JobCard from "@/components/JobCard";
import AddJobForm from "@/components/AddJobForm";

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
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            JobFlow AI
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your job applications smarter.
          </p>
        </div>

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
