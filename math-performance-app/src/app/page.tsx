'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useData } from '@/context/DataContext';

export default function LandingPage() {
  const { students, isLoading } = useData();

  const keyFindings = [
    {
      icon: '📉',
      title: 'Past Failures Matter Most',
      description: 'Students with previous failures score 4-5 points lower on average. This is the strongest predictor of final grades.',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Parent Education Shapes Success',
      description: "Mother's education level shows the strongest family influence, with highly educated mothers' children scoring 2+ points higher.",
    },
    {
      icon: '🍺',
      title: 'Lifestyle Choices Leave Marks',
      description: 'High weekend alcohol consumption correlates with lower grades (ρ = -0.17). Going out frequently shows similar patterns.',
    },
    {
      icon: '📊',
      title: 'Study Time Helps, But Not Linearly',
      description: 'More study time generally improves grades, but the relationship plateaus—quality may matter more than quantity.',
    },
  ];

  const stats = [
    { value: '395', label: 'Students Analyzed' },
    { value: '33', label: 'Variables Explored' },
    { value: '3', label: 'Research Questions' },
    { value: '10+', label: 'Interactive Charts' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              What Shapes{' '}
              <span className="gradient-text">Student Success</span>{' '}
              in Math?
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              An interactive exploration of academic, demographic, and lifestyle factors 
              affecting Portuguese high school students&apos; mathematics performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/story" className="btn-primary text-lg">
                Explore the Story →
              </Link>
              <Link href="/methods" className="btn-secondary text-lg">
                View Methodology
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="font-display text-4xl font-bold gradient-text mb-2">
                  {isLoading && stat.label === 'Students Analyzed' ? '...' : stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-sm">Scroll to discover</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Key Findings Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Key Discoveries</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Through rigorous analysis of 395 students across 33 variables, 
              we uncovered patterns that illuminate the path to academic success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {keyFindings.map((finding, index) => (
              <motion.div
                key={finding.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 hover:border-accent-teal/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {finding.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white mb-2">
                      {finding.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {finding.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Questions Preview */}
      <section className="py-24 px-6 bg-slate-850/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Three Research Questions</h2>
            <p className="text-gray-400 text-lg">
              Our analysis is structured around three core themes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Academic Engagement',
                description: 'How do study habits, past failures, and grade trajectories shape final outcomes?',
                color: 'from-accent-coral to-accent-gold',
              },
              {
                num: '02',
                title: 'Family & Demographics',
                description: 'What role do parental education, family support, and school choice play?',
                color: 'from-accent-teal to-accent-blue',
              },
              {
                num: '03',
                title: 'Lifestyle Choices',
                description: 'How do social activities and alcohol consumption correlate with academic performance?',
                color: 'from-accent-purple to-accent-coral',
              },
            ].map((rq, index) => (
              <motion.div
                key={rq.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="glass-card p-8 h-full hover:border-slate-600 transition-all duration-300">
                  <div className={`text-6xl font-display font-bold mb-4 bg-gradient-to-r ${rq.color} bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity`}>
                    {rq.num}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">
                    {rq.title}
                  </h3>
                  <p className="text-gray-400">
                    {rq.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-400 text-sm">
            Data source: UCI Machine Learning Repository — Student Performance Dataset
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
              About
            </Link>
            <Link href="/methods" className="text-gray-400 hover:text-white transition-colors text-sm">
              Methodology
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

