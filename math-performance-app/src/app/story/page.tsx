'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import Navigation from '@/components/ui/Navigation';
import FilterBar from '@/components/ui/FilterBar';
import { PageLoadingState } from '@/components/ui/LoadingState';

// Chart imports
import StudyTimeChart from '@/components/charts/StudyTimeChart';
import FailuresChart from '@/components/charts/FailuresChart';
import GradeTrajectoryChart from '@/components/charts/GradeTrajectoryChart';
import SupportDensityChart from '@/components/charts/SupportDensityChart';
import ParentEducationChart from '@/components/charts/ParentEducationChart';
import PCAChart from '@/components/charts/PCAChart';
import AlcoholChart from '@/components/charts/AlcoholChart';
import GoingOutChart from '@/components/charts/GoingOutChart';
import DecisionTreeChart from '@/components/charts/DecisionTreeChart';

// Section navigation
const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'rq1', label: 'Academic Engagement' },
  { id: 'rq2', label: 'Family & Demographics' },
  { id: 'rq3', label: 'Lifestyle Choices' },
  { id: 'synthesis', label: 'Synthesis' },
];

export default function StoryPage() {
  const { isLoading, error } = useData();
  const [activeSection, setActiveSection] = useState('intro');

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  if (isLoading) return <PageLoadingState />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Side Navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
        <nav className="flex flex-col gap-2">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`group flex items-center gap-3 py-2 transition-all duration-200`}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-200
                  ${activeSection === id 
                    ? 'bg-accent-teal w-4' 
                    : 'bg-slate-600 group-hover:bg-slate-400'
                  }`}
              />
              <span 
                className={`text-sm transition-all duration-200
                  ${activeSection === id 
                    ? 'text-white font-medium' 
                    : 'text-gray-500 group-hover:text-gray-300'
                  }`}
              >
                {label}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <main className="pt-20 xl:pl-56">
        <FilterBar />

        {/* Introduction Section */}
        <section id="intro" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                The Data Story
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                We analyzed 395 Portuguese high school students to understand what factors 
                most influence their mathematics performance. The final grade (G3) ranges 
                from 0 to 20, with passing at 10.
              </p>
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-left">
                  <div className="text-sm text-gray-400">Mean Final Grade</div>
                  <div className="font-display text-3xl font-bold gradient-text">10.4</div>
                </div>
                <div className="w-px h-12 bg-slate-700" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">Pass Rate</div>
                  <div className="font-display text-3xl font-bold text-accent-teal">67%</div>
                </div>
                <div className="w-px h-12 bg-slate-700" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">Std Deviation</div>
                  <div className="font-display text-3xl font-bold text-accent-coral">4.6</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* RQ1: Academic Engagement */}
        <section id="rq1" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-coral/10 border border-accent-coral/30 mb-4">
                <span className="text-accent-coral font-mono font-semibold">RQ1</span>
              </div>
              <h2 className="section-title">Academic Engagement</h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                How do study habits, past academic failures, and grade progression across 
                the school year relate to final mathematics performance?
              </p>
            </motion.div>

            <StudyTimeChart />
            <FailuresChart />
            <GradeTrajectoryChart />
          </div>
        </section>

        {/* RQ2: Family & Demographics */}
        <section id="rq2" className="py-16 px-6 bg-slate-850/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/30 mb-4">
                <span className="text-accent-teal font-mono font-semibold">RQ2</span>
              </div>
              <h2 className="section-title">Family & Demographics</h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                What role do parental education, family support systems, and demographic 
                factors play in shaping student outcomes?
              </p>
            </motion.div>

            <SupportDensityChart />
            <ParentEducationChart />
          </div>
        </section>

        {/* RQ3: Lifestyle Choices */}
        <section id="rq3" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/30 mb-4">
                <span className="text-accent-purple font-mono font-semibold">RQ3</span>
              </div>
              <h2 className="section-title">Lifestyle Choices</h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                How do social activities and alcohol consumption patterns correlate with 
                academic performance? We explore these relationships using PCA and correlation analysis.
              </p>
            </motion.div>

            <PCAChart />
            <AlcoholChart />
            <GoingOutChart />
          </div>
        </section>

        {/* Synthesis */}
        <section id="synthesis" className="py-16 px-6 bg-slate-850/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/30 mb-4">
                <span className="text-accent-gold font-mono font-semibold">SYNTHESIS</span>
              </div>
              <h2 className="section-title">The Full Picture: Decision Tree Model</h2>
              <p className="text-gray-400 text-lg max-w-3xl">
                A decision tree reveals the hierarchical importance of predictors. Past failures 
                emerge as the primary split, followed by absences and parental education for 
                students without prior failures.
              </p>
            </motion.div>

            <DecisionTreeChart />
          </div>
        </section>

        {/* Conclusion */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-8">Key Conclusions</h2>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="glass-card p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-display font-semibold text-white mb-2">Early Intervention Matters</h3>
                  <p className="text-gray-400 text-sm">
                    Past failures are the strongest predictor. Identifying struggling students early 
                    and providing support before they fail could significantly improve outcomes.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <div className="text-3xl mb-3">👨‍👩‍👧</div>
                  <h3 className="font-display font-semibold text-white mb-2">Family Education Effects</h3>
                  <p className="text-gray-400 text-sm">
                    Mother&apos;s education shows the strongest family influence. Parent engagement 
                    programs could help bridge gaps for students from less educated households.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h3 className="font-display font-semibold text-white mb-2">Balance is Key</h3>
                  <p className="text-gray-400 text-sm">
                    Moderate social activities don&apos;t harm grades, but extremes do. Students 
                    with very high alcohol consumption or going out frequency show lower performance.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-display font-semibold text-white mb-2">Consistent Performance</h3>
                  <p className="text-gray-400 text-sm">
                    G1 and G2 strongly predict G3. Students who struggle early rarely recover 
                    without intervention, emphasizing the need for continuous monitoring.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

