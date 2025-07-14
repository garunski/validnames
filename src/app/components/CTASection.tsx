import { Button } from "@/primitives/button";
import { Heading } from "@/primitives/heading";
import { Link } from "@/primitives/link";

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Heading
          level={2}
          className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
        >
          Ready to streamline your domain research?
        </Heading>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Join thousands of users who trust Valid Names for their domain
          availability needs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-6">
          <Button href="/register">Get Started Free</Button>
          <Link
            href="/login"
            className="text-sm leading-6 font-semibold text-zinc-900 dark:text-white"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
