'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const SAVINGS_PATH = '/app/savings'; // change to '/savings' if you later move the page

type Goal = {
  key: 'hajj' | 'umrah' | 'education' | 'wedding' | 'qurban' | 'general';
  title: string;
  img: string;
  badge?: string;
};

const GOALS: Goal[] = [
  { key: 'hajj',       title: 'Hajj',       img: '/GoalSection/hajj.png', badge: 'Most Popular' },
  { key: 'umrah',      title: 'Umrah',      img: '/GoalSection/umrah.png' },
  { key: 'education',  title: 'Education',  img: '/GoalSection/education.png' },
  { key: 'wedding',    title: 'Wedding',    img: '/GoalSection/wedding.png' },
  { key: 'qurban',     title: 'Qurban',     img: '/GoalSection/qurban.png' },
  { key: 'general',    title: 'General',    img: '/GoalSection/general.png' },
];

export default function GoalSection() {
  const ref = useRef<HTMLDivElement>(null);

  const nudge = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 280;
    el.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
  };

  return (
    <section id="goals" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">Save for What Matters</h2>
          <p className="text-base text-gray-600">Set Goals. Track Progress. Achieve Dreams.</p>
        </div>

        <p className="mx-auto max-w-2xl text-center text-gray-700 mb-10">
          Unlike traditional DeFi vaults, <span className="font-medium">MinaPool</span> helps you save with
          <em> purpose</em> — aligned with your life goals and Islamic values.
        </p>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => nudge('left')}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur hover:bg-white shadow"
          >
            ‹
          </button>
          <button
            onClick={() => nudge('right')}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur hover:bg-white shadow"
          >
            ›
          </button>

          <div
            ref={ref}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

            {GOALS.map((g) => (
              <Link
                key={g.key}
                href={`${SAVINGS_PATH}?goal=${g.key}&view=create`}
                className="group snap-start shrink-0 w-64 sm:w-72 rounded-2xl border border-gray-200 bg-white transition-[box-shadow,transform] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="relative p-6 rounded-2xl">
                  
                  {g.badge && (
                    <span className="absolute -top-2 left-4 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                      {g.badge}
                    </span>
                  )}

                  <div className="relative mx-auto h-32 w-32 sm:h-36 sm:w-36">
                    <Image
                      src={g.img}
                      alt={`Create ${g.title} goal`}
                      fill
                      sizes="144px"
                      className="object-contain"
                      priority={g.key === 'hajj'}
                    />
                  </div>

                  {/* compact CTA */}
                  <div className="mt-5 flex justify-center">
                    <span className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium bg-white group-hover:bg-gray-50">
                      Create {g.title} Goal
                    </span>
                  </div>

                  {/* accessibility text (hidden) */}
                  <span className="sr-only">Go to create {g.title} goal</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={`${SAVINGS_PATH}?view=create`}
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700"
          >
            Create Your Goal →
          </Link>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-10" />
      </div>
    </section>
  );
}
