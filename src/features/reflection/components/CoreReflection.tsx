"use client";

interface CoreReflectionProps {
  text: string;
}

/**
 * The hero: one synthesized sentence about what holds the user's attention.
 * Meaning leads the page — content is downstream evidence, not the headline.
 */
export function CoreReflection({ text }: CoreReflectionProps) {
  return (
    <section className="flex flex-col gap-2 border-b border-edge pb-8">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        What keeps attracting you
      </p>
      <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
        {text}
      </p>
    </section>
  );
}
