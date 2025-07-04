
<!-- SignalCraft Landing Scroll - Nuxt 3 / Vue 3 -->
<script setup lang="ts">
import { useMotion } from '@vueuse/motion'

const fadeSlide = { 
  initial: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
</script>

<template>
  <section id="hero" class="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white text-center">
    <motion.h1 v-motion="fadeSlide" class="text-4xl md:text-6xl font-bold">
      Turn <span class="text-orange-400">Signal</span> into Structure
    </motion.h1>
    <motion.p v-motion="fadeSlide" class="mt-6 max-w-xl mx-auto text-lg">
      In the beginning, we charted stars.<br/>
      Today, we chart data. Welcome to the future of foresight.
    </motion.p>
    <div class="mt-8 flex gap-4">
      <NuxtLink to="/signup" class="btn-primary">Start Free</NuxtLink>
      <NuxtLink to="/#mission" class="btn-secondary">Learn More</NuxtLink>
    </div>
  </section>

  <section id="problem" class="py-24 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
      <motion.div v-motion="fadeSlide">
        <img src="/images/data-chaos.svg" alt="Data chaos" class="rounded-xl shadow-lg">
      </motion.div>
      <motion.div v-motion="fadeSlide" class="flex flex-col justify-center">
        <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Information alone is not wisdom.
        </h2>
        <p class="text-gray-700 dark:text-gray-300">
          Dashboards without direction waste time.<br/>
          SignalCraft transforms noise into navigable insight.
        </p>
      </motion.div>
    </div>
  </section>

  <section id="mission" class="py-24 bg-gray-50 dark:bg-gray-800">
    <motion.div v-motion="fadeSlide" class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">A Tool for Decision‑Makers</h2>
      <p class="mb-10 text-gray-700 dark:text-gray-300">
        Not just another dashboard. SignalCraft unites news, trends, and your KPIs in one private, AI‑powered workspace—so you can act with certainty.
      </p>
      <div class="grid sm:grid-cols-3 gap-8">
        <FeatureCard icon="globe" title="Local Signals" />
        <FeatureCard icon="trending-up" title="Predictive Foresight" />
        <FeatureCard icon="shield" title="Privacy by Design" />
      </div>
    </motion.div>
  </section>

  <section id="philosophy" class="py-24 bg-gray-900 text-white">
    <motion.div v-motion="fadeSlide" class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">Every Metric is a Stone</h2>
      <p class="text-lg leading-relaxed">
        We believe business owners are the new architects of the future.<br/>
        Every insight is a beam. Together they build the decisions that shape tomorrow.
      </p>
    </motion.div>
  </section>

  <section id="principles" class="py-24 bg-white dark:bg-gray-900">
    <motion.div v-motion="fadeSlide" class="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
      <PrincipleItem title="Privacy‑First" desc="Your data, your rules—encrypted end‑to‑end." />
      <PrincipleItem title="Low Complexity" desc="Setup in minutes. No DevOps overhead." />
      <PrincipleItem title="Local & Global" desc="Hyperlocal insights with worldwide reach." />
      <PrincipleItem title="Actionable by Default" desc="Dashboards that drive change, not vanity." />
    </motion.div>
  </section>

  <section id="cta" class="py-32 bg-orange-500 text-white text-center">
    <motion.h2 v-motion="fadeSlide" class="text-4xl font-semibold mb-6">
      Build your future—<span class="italic">signal by signal.</span>
    </motion.h2>
    <NuxtLink to="/signup" class="btn-white">Create Your Free Workspace</NuxtLink>
  </section>
</template>
