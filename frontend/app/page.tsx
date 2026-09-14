import JobCard from "@/components/JobCard";
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
  const response = await fetch("http://127.0.0.1:8000/jobs");

  const jobs: Job[] = await response.json();
  return (
  <div className="min-h-screen bg-gray-50 p-8 flex flex-col text-center text-black " >
    <h1 className="text-2xl">
      JobFlow AI
    </h1>
    <p className="">Manage your job applications smarter.</p>

    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard
        key={job.id}
        title={job.title}
        company={job.company}
        status = {job.status}
        />

      ))}
    </div>


  </div>
  );
}
