import { Button } from "@/primitives/button";
import { Heading } from "@/primitives/heading";
import { Link } from "@/primitives/link";

export function HeroSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Heading
          level={1}
          className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white"
        >
          Check Domain Availability
          <span className="block text-blue-600">Across All TLDs</span>
        </Heading>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Streamline your domain research with batch checking, AI-powered
          suggestions, and comprehensive availability tracking across hundreds
          of top-level domains.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button href="/register">Sign Up</Button>
          <Link
            href="/login"
            className="text-sm leading-6 font-semibold text-zinc-900 dark:text-white"
          >
            Sign in <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
