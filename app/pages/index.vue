<script setup lang="ts">
const { data: doc } = await useAsyncData("home-hero", () =>
  queryCollection("home").path("/home/hero").first()
);
if (!doc.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Home content not found",
    fatal: true,
  });
}

const { data: work } = await useAsyncData("home-work", () =>
  queryCollection("work").order("year", "DESC").all()
);
const { data: timeline } = await useAsyncData("home-timeline", () =>
  queryCollection("timeline").first()
);
const { data: achievements } = await useAsyncData("home-achievements", () =>
  queryCollection("achievements").first()
);
const { data: contributions } = await useAsyncData("home-contributions", () =>
  queryCollection("contributions").first()
);
const { data: assignments } = await useAsyncData("home-assignments", () =>
  queryCollection("assignments").first()
);

const d = computed<any>(() => doc.value as any);
const metrics = computed<any[]>(() => d.value?.metrics ?? []);
const capabilities = computed<any[]>(() => d.value?.capabilities ?? []);
const contact = computed(() => d.value?.contact ?? {});
const topWork = computed<any[]>(() => (work.value ?? []).slice(0, 3));
const journey = computed<any[]>(() => {
  const entries = (timeline.value as any)?.entries ?? [];
  return [...entries].reverse().slice(0, 4);
});
const topAchievements = computed<any[]>(() =>
  ((achievements.value as any)?.items ?? []).slice(0, 4)
);
const topContributions = computed<any[]>(() =>
  ((contributions.value as any)?.items ?? []).slice(0, 3)
);
const customers = computed<any[]>(() => (assignments.value as any)?.customers ?? []);
const assignmentSegments = computed<any[]>(
  () => (assignments.value as any)?.segments ?? []
);

const sections = [
  { id: "hero", label: "Intro" },
  { id: "work", label: "My Work" },
  { id: "assignments", label: "Assignments" },
  { id: "journey", label: "My Journey" },
  { id: "achievements", label: "Achievements" },
  { id: "contributions", label: "Contributions" },
  { id: "advisory", label: "Advisory" },
];

useHead({
  htmlAttrs: { class: "snap-home" },
  titleTemplate: "%s",
});
useSeoMeta({
  title: "Sankar Vema · AI Builder & Architect",
  ogTitle: "Sankar Vema · AI Builder & Architect of Agentic Systems",
  description:
    "I design AI systems that ship — and advise the leaders betting on them. Enterprise AI advisory, architecture, and founder mentorship.",
});
</script>

<template>
  <div>
    <CarouselNav :sections="sections" />

    <!-- ============================ HERO ============================ -->
    <SectionPanel id="hero">
      <div class="rise">
        <HeroSlides
          :role="d?.role"
          :headline="d?.headline"
          :intro="d?.intro"
          :metrics="metrics"
          :capabilities="capabilities"
          :contact="contact"
        />
      </div>
    </SectionPanel>

    <!-- ============================ WORK ============================ -->
    <SectionPanel id="work" index="01" eyebrow="My Work">
      <div class="max-w-2xl">
        <h2
          class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          Systems I designed and shipped.
        </h2>
        <p class="mt-4 text-[var(--color-fg-muted)]">
          Production AI — not demos. Each case study walks the architecture, the
          decisions, and what it traded.
        </p>
      </div>
      <div class="mt-8 grid gap-5 md:grid-cols-3">
        <WorkCard v-for="item in topWork" :key="item.path" :item="item" />
      </div>
      <NuxtLink to="/work" class="btn btn-ghost mt-7 w-fit">
        Explore all work
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </SectionPanel>

    <!-- ============================ ASSIGNMENTS ============================ -->
    <SectionPanel id="assignments" index="02" eyebrow="Assignments">
      <div class="max-w-2xl">
        <h2
          class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          Trusted by governments and the Fortune 500.
        </h2>
        <p class="mt-4 text-[var(--color-fg-muted)]">
          Three decades across consulting, project delivery and offering design —
          for the organizations where the technology had to work at scale.
        </p>
      </div>

      <div class="mt-8">
        <LogoMarquee :customers="customers" />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="s in assignmentSegments"
          :key="s.title"
          class="tag !text-[var(--color-fg-muted)]"
        >{{ s.title }}</span>
      </div>

      <NuxtLink to="/assignments" class="btn btn-ghost mt-7 w-fit">
        Explore assignments
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </SectionPanel>

    <!-- ============================ JOURNEY ============================ -->
    <SectionPanel id="journey" index="03" eyebrow="My Journey">
      <div class="max-w-2xl">
        <h2
          class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          Three decades, one trajectory.
        </h2>
        <p class="mt-4 text-[var(--color-fg-muted)]">
          From a single contributor in 1998 to AI architect today — leadership
          years used as ballast, not identity.
        </p>
      </div>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="e in journey"
          :key="`${e.year}-${e.company}`"
          class="glass flex flex-col p-5"
        >
          <div
            class="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]"
          >
            {{ e.year }}
          </div>
          <div
            class="mt-2 font-[family-name:var(--font-display)] text-base leading-snug text-[var(--color-fg)]"
          >
            {{ e.role }}
          </div>
          <div class="text-sm text-[var(--color-fg-muted)]">
            {{ e.company }}
          </div>
        </div>
      </div>
      <NuxtLink to="/journey" class="btn btn-ghost mt-7 w-fit">
        Read my full journey
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </SectionPanel>

    <!-- ============================ ACHIEVEMENTS ============================ -->
    <SectionPanel id="achievements" index="04" eyebrow="Achievements">
      <div class="max-w-2xl">
        <h2
          class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          Recognized where it counts.
        </h2>
        <p class="mt-4 text-[var(--color-fg-muted)]">
          National honours, Distinguished Engineer status, and trust from
          Fortune 500 leadership.
        </p>
      </div>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div
          v-for="a in topAchievements"
          :key="a.title"
          class="glass flex items-start gap-4 p-5"
        >
          <span
            class="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]"
            >{{ a.year }}</span
          >
          <div>
            <div
              class="font-[family-name:var(--font-display)] text-base leading-snug text-[var(--color-fg)]"
            >
              {{ a.title }}
            </div>
            <div v-if="a.org" class="text-sm text-[var(--color-fg-muted)]">
              {{ a.org }}
            </div>
          </div>
        </div>
      </div>
      <NuxtLink to="/achievements" class="btn btn-ghost mt-7 w-fit">
        All awards & recognition
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </SectionPanel>

    <!-- ============================ CONTRIBUTIONS ============================ -->
    <SectionPanel id="contributions" index="05" eyebrow="Contributions">
      <div class="max-w-2xl">
        <h2
          class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          Open source over patents.
        </h2>
        <p class="mt-4 text-[var(--color-fg-muted)]">
          The compounding wins are upstream, in the open. A few things I've
          helped build and give away.
        </p>
      </div>
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <div
          v-for="c in topContributions"
          :key="c.title"
          class="glass flex flex-col p-5"
        >
          <div
            class="font-[family-name:var(--font-display)] text-lg text-[var(--color-fg)]"
          >
            {{ c.title }}
          </div>
          <div
            v-if="c.role"
            class="mt-0.5 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-[var(--color-accent)]"
          >
            {{ c.role }}
          </div>
          <p class="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {{ c.note }}
          </p>
        </div>
      </div>
      <NuxtLink to="/contributions" class="btn btn-ghost mt-7 w-fit">
        All contributions
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </SectionPanel>

    <!-- ============================ ADVISORY (close) ============================ -->
    <SectionPanel id="advisory" index="06" eyebrow="Work With Me">
      <div class="glass relative overflow-hidden p-8 sm:p-12">
        <div
          class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60"
          style="
            background: radial-gradient(
              circle,
              color-mix(in oklab, var(--color-accent) 30%, transparent),
              transparent 70%
            );
          "
          aria-hidden="true"
        />
        <h2
          class="max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          If you're betting seriously on AI, let's talk.
        </h2>
        <p class="mt-5 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          I'm the architect-on-call for leadership teams building AI that has to
          ship — not just demo. The first conversation is a free 30-minute
          diagnosis. I won't sell; I'll diagnose.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div
            v-for="x in [
              {
                t: 'Architecture review',
                d: 'What\'s sound, what breaks in year two, what to stop building now.',
              },
              {
                t: 'Fractional Chief AI Architect',
                d: 'Embedded with your exec team for a 6–12 month transformation.',
              },
              {
                t: 'Founder mentorship',
                d: 'AI product architecture, technical hiring, scaling without the standard mistakes.',
              },
            ]"
            :key="x.t"
            class="rounded-xl border border-[var(--color-hair)] p-4"
          >
            <div class="text-sm font-semibold text-[var(--color-fg)]">
              {{ x.t }}
            </div>
            <div class="mt-1 text-sm text-[var(--color-fg-muted)]">
              {{ x.d }}
            </div>
          </div>
        </div>

        <div class="mt-9 flex flex-wrap items-center gap-3">
          <NuxtLink to="/contact" class="btn btn-primary">
            Book an advisory call
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/advisory" class="btn btn-ghost">How I work</NuxtLink>
          <SocialLinks :contact="contact" class="ml-1" />
        </div>
      </div>

      <p class="mt-8 text-center text-xs text-[var(--color-fg-faint)]">
        © 2026 Sankar Vema · Built with Nuxt · hosted on GitHub Pages
      </p>
    </SectionPanel>
  </div>
</template>
