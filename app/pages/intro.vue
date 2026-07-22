<script setup lang="ts">
const tab = ref<'short' | 'long'>('short')

useSeoMeta({
  title: 'Introduction',
  description:
    'A short and a full introduction to Sankar Vema: technology leader with more than thirty years across enterprise systems, deep-tech engineering and applied AI.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Introduction"
      title="Sankar Vema"
      subtitle="A ready-to-use introduction, in a short and a longer version. Pick the length that fits."
    />

    <div class="wrap py-16">
      <div class="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        <!-- Photo + credential card (left) -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="overflow-hidden rounded-2xl border border-[var(--color-hair)] bg-[var(--color-ink-850)]">
            <img
              src="/profilePic.jpg"
              alt="Sankar Vema"
              class="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <div class="mt-5">
            <h2 class="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-fg)]">Sankar Vema</h2>
            <p class="mt-1 text-sm text-[var(--color-fg-muted)]">Chief AI Officer, Zettamine</p>
            <p class="mt-0.5 text-sm text-[var(--color-fg-faint)]">Hyderabad, India</p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span class="tag">30+ years</span>
              <span class="tag">Ex-DXC Distinguished Engineer</span>
              <span class="tag">Fractional CTO &amp; CXO advisor</span>
            </div>
          </div>
        </aside>

        <!-- Tabbed write-up (right) -->
        <div>
          <div role="tablist" class="flex gap-2 border-b border-[var(--color-hair)] pb-3">
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'short'"
              class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              :class="tab === 'short'
                ? 'bg-[color:color-mix(in_oklab,var(--color-accent)_16%,transparent)] text-[var(--color-accent)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'"
              @click="tab = 'short'"
            >
              Short (500 words)
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="tab === 'long'"
              class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              :class="tab === 'long'
                ? 'bg-[color:color-mix(in_oklab,var(--color-accent)_16%,transparent)] text-[var(--color-accent)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'"
              @click="tab = 'long'"
            >
              Full (1000 words)
            </button>
          </div>

          <!-- Short version -->
          <div v-show="tab === 'short'" class="mt-7 flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            <p>
              Sankar Vema is a technology leader with more than thirty years of experience building and
              delivering enterprise systems for organisations around the world. He is currently the Chief AI
              Officer at Zettamine, where he leads the company's work in artificial intelligence and enterprise
              software, from agentic AI systems to modernising the core systems that large organisations run on.
            </p>
            <p>
              Over the years he has held senior technical and leadership roles across the industry. He was a
              Distinguished Engineer at DXC Technology and Computer Sciences Corporation (CSC), a distinction
              earned by very few, and later Managing Partner and Chief Digital Officer at Brane Enterprises,
              where he built and led a large engineering organisation along with its innovation and
              next-generation technology practices.
            </p>
            <p>
              He has served as a fractional CTO and CXO advisor to leading Fortune 500 companies, including
              AT&amp;T, Zurich Insurance, Nestlé, Mastercard, Airbus, John Deere and Caterpillar, across the
              United States, Europe and India. On these programmes he was the trusted technology advisor where
              the decisions were significant and the outcomes had to hold up in the real world.
            </p>
            <p>
              His hands-on work spans a wide range of fields, from AI model research and high performance systems
              to edge computing, digital twins, industrial IoT, augmented reality, robotics and drones. He has
              led one deep-technology programme that ran all the way from designing a new programming language and
              its compiler to custom silicon and hardware for drones, robots and connected devices, and has shipped
              applied AI systems such as real-time audio and video interaction agents and an enterprise digital twin.
            </p>
            <p>
              Sankar began his career building software products, and then served in the public sector under the
              Ministry of Shipping, where he managed port automation, e-Governance and shipping EDIFACT projects
              across India's major ports. That early experience gave him a lasting respect for technology delivered
              at scale and under genuine accountability. In the years that followed he delivered enterprise
              programmes in manufacturing, banking, insurance and consumer goods, including a global SAP rollout for
              Nestlé.
            </p>
            <p>
              He has received several awards through his career, from corporate CEO awards to industry honours,
              including the Efficient Governance Award from Dr. Ved Prakash Goyal, the Cabinet Minister for
              Shipping, and the Technology Innovation Award from Dr. APJ Abdul Kalam, the Chief Scientist of India.
              He holds a Master's degree in Computers from Andhra University and completed an executive leadership
              programme at Duke University's Fuqua School of Business, and he is a long-standing contributor to open
              source.
            </p>
            <p>
              What makes his perspective useful is that he has both built and led. He has written the code and
              designed the architecture, and he has also run large teams and advised executives, which lets him
              move easily between the technical detail of a system and the decisions a leadership team has to make,
              and tell the difference between technology that is genuinely useful and technology that only looks
              impressive.
            </p>
            <p>
              Today, alongside his work at Zettamine, he advises leadership teams building serious AI capability and
              mentors young engineers and founders who are early in the journey he began three decades ago. He is
              based in Hyderabad, India.
            </p>
          </div>

          <!-- Full version -->
          <div v-show="tab === 'long'" class="mt-7 flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            <p>
              Sankar Vema is a technology leader whose career spans more than three decades, from the early days of
              enterprise software to the current wave of applied artificial intelligence. Across that time he has
              consistently worked where the technology is hardest and the stakes are real: large enterprise
              programmes, frontier engineering, and the systems that organisations depend on to run. He is currently
              the Chief AI Officer at Zettamine.
            </p>
            <p>
              He began his career as a software engineer, building products in the education technology space and
              learning his craft on the enterprise Java and web technologies of the time. Very early on it became
              clear that his interest was not only in writing software, but in shaping how technology is designed,
              delivered and led.
            </p>
            <p>
              One of his formative chapters came in the public sector, under the Ministry of Shipping. There he
              managed port automation, e-Governance and shipping EDIFACT projects across India's major ports,
              working with port authorities, customs, shipping lines and other stakeholders to bring modern systems
              into critical national infrastructure. Delivering technology at that scale, under public
              accountability, shaped how he has approached every large programme since. It was during this period
              that he received the Efficient Governance Award from Dr. Ved Prakash Goyal, the Cabinet Minister for
              Shipping, and the Technology Innovation Award from Dr. APJ Abdul Kalam, the Chief Scientist of India.
            </p>
            <p>
              Moving into the global technology services industry, he took on increasingly senior delivery and
              consulting roles. He led complex enterprise programmes for major manufacturers and consumer goods
              companies, including a global SAP rollout for Nestlé, and built consulting and engineering practices
              from the ground up. He also led application management and testing engineering for large accounts, and
              learned first-hand how quality, process and people all have to move together for a programme of that
              size to succeed. These years gave him deep, practical experience of what it takes to deliver enterprise
              systems across countries, teams and business functions.
            </p>
            <p>
              At Computer Sciences Corporation and later DXC Technology, he was recognised as a Distinguished
              Engineer, a distinction earned by only a small number of people in a very large organisation. He
              served as a technology advisor, effectively a fractional CTO and CXO advisor, to leading Fortune 500
              companies including AT&amp;T and Zurich Insurance, and worked with organisations such as Nestlé,
              Mastercard, Airbus, John Deere and Caterpillar across the United States, Europe and India. He also
              built innovation labs and technology showcase centres, and championed emerging fields such as AI and
              machine learning, IoT, robotics, drones, blockchain and augmented and virtual reality long before they
              became mainstream.
            </p>
            <p>
              As Managing Partner and Chief Digital Officer at Brane Enterprises, he built and led a large
              engineering organisation, including a dedicated AI and next-generation technology group. Here he led
              one of the most ambitious programmes of his career: a deep-technology effort that ran the full stack,
              from designing a new programming language and its compiler and a no-code platform, through advanced
              model research, all the way down to a custom microprocessor and a hardware layer that drove drones,
              robots, connected devices and augmented and virtual reality systems from prototype into production.
              Very few technologists get to work across that entire range, from language and silicon to shipped
              hardware.
            </p>
            <p>
              Today, as Chief AI Officer at Zettamine, he leads the company's work in artificial intelligence and
              enterprise software. His focus is on building AI systems that hold up in real use rather than in
              demonstrations, including agentic and conversational AI, retrieval-based systems and applied machine
              learning, alongside the modernisation of the enterprise systems that businesses already rely on. He
              has personally architected and shipped systems such as real-time audio and video interaction agents
              and an enterprise digital twin. He also advises other leadership teams that are betting seriously on
              AI, bringing the perspective of someone who has already lived through the difficult second and third
              years of large technology programmes.
            </p>
            <p>
              What sets his perspective apart is that he has both built and led. He has written the code and
              designed the architecture, and he has also run large organisations and advised boards and executives.
              That combination lets him move comfortably between the deep technical detail of a system and the
              strategic questions a leadership team faces, and to tell the difference between technology that is
              genuinely useful and technology that only looks impressive.
            </p>
            <p>
              His technical work spans an unusually wide range of areas: AI model research, high performance
              systems, edge computing, digital twins, industrial IoT, augmented reality, robotics and drones.
              Whether the problem is a model that must run reliably in production, a factory floor that needs
              computer vision, or an autonomous system that has to survive the real world, he has tended to work at
              the point where research meets engineering. Among other things he has designed drones that carry real
              payloads over long distances and at high altitude, and autonomous systems for survey and surveillance,
              taking several of them from prototype into the field. He has also been a long-standing contributor to
              open source, with early contributions used widely across the community, and he writes and speaks on
              enterprise technology and the realities of adopting AI at scale.
            </p>
            <p>
              Over his career he has received a number of awards, from corporate CEO awards to national and
              industry honours. He holds a Master's degree in Computers from Andhra University and completed an
              executive leadership programme at Duke University's Fuqua School of Business, and holds professional
              certifications including TOGAF, PMP, CISM, ITIL and Six Sigma Black Belt.
            </p>
            <p>
              Through all of this, his approach has stayed consistent: understand the problem deeply, design for the
              long term, and build systems that actually work in the hands of real users. He is a firm believer that
              the most valuable technology is the technology that ships and endures. Alongside his professional work,
              he mentors young engineers and founders, helping them navigate the early stages of the journey he
              started more than thirty years ago. He is based in Hyderabad, India.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
