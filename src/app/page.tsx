import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-accent">
          Deadlock Detection System
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 font-light">
          OS Mini Project — Resource Allocation Graph & Deadlock Detection
        </p>

        <div className="pt-8">
          <Link
            href="/detect"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-lg"
          >
            Start Detection
          </Link>
        </div>
      </div>
    </main>
  );
}
