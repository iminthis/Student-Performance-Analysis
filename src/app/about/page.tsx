'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';

const techStack = [
  { name: 'Next.js 14', category: 'Framework', description: 'React framework with App Router for server-side rendering and static export' },
  { name: 'React 18', category: 'UI Library', description: 'Component-based UI with hooks for state management' },
  { name: 'TypeScript', category: 'Language', description: 'Type-safe JavaScript for better developer experience and fewer runtime errors' },
  { name: 'Tailwind CSS', category: 'Styling', description: 'Utility-first CSS framework for rapid, responsive design' },
  { name: 'Recharts', category: 'Visualization', description: 'React-based charting library built on D3 for declarative charts' },
  { name: 'D3.js', category: 'Visualization', description: 'Low-level library for custom, data-driven visualizations' },
  { name: 'Framer Motion', category: 'Animation', description: 'Production-ready animation library for React' },
  { name: 'PapaParse', category: 'Data', description: 'Fast CSV parser for loading and parsing student data' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              About This Project
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A data visualization portfolio project exploring factors that influence 
              Portuguese high school student mathematics performance.
            </p>
          </motion.div>

          {/* Project Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Project Overview
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                This interactive data story analyzes the UCI Student Performance dataset, 
                which contains information on 395 Portuguese high school students enrolled 
                in math courses. The dataset includes demographic, social, and school-related 
                features, with the goal of predicting student academic performance.
              </p>
              <p>
                The analysis is structured around three research questions examining academic 
                engagement, family background, and lifestyle factors. A decision tree model 
                synthesizes findings to reveal the hierarchical importance of different predictors.
              </p>
              <p>
                This project demonstrates skills in data storytelling, front-end development, 
                interactive visualization design, and statistical analysis communication.
              </p>
            </div>
          </motion.div>

          {/* Dataset Citation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              📚 Dataset Citation
            </h2>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                P. Cortez and A. Silva. <em>Using Data Mining to Predict Secondary School 
                Student Performance</em>. In A. Brito and J. Teixeira Eds., Proceedings of 
                5th FUture BUsiness TEChnology Conference (FUBUTEC 2008) pp. 5-12, Porto, 
                Portugal, April, 2008, EUROSIS, ISBN 978-9077381-39-7.
              </p>
              <div className="mt-4 flex gap-4">
                <a
                  href="https://archive.ics.uci.edu/dataset/320/student+performance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-teal hover:underline text-sm"
                >
                  UCI Repository →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              🛠️ Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{tech.name}</span>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-400">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              👤 Author
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Vinay Venkatesh
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/iminthis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/vinayven"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              🔗 Project Links
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://github.com/iminthis/Student-Performance-Analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Source Code</div>
                  <div className="text-sm text-gray-400">View on GitHub</div>
                </div>
              </a>
              <Link
                href="/story"
                className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Explore the Story</div>
                  <div className="text-sm text-gray-400">Interactive data visualization</div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

