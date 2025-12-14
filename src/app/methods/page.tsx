'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/ui/Navigation';

const methods = [
  {
    title: 'Exploratory Data Analysis (EDA)',
    icon: '🔍',
    description: 'Initial exploration of the dataset to understand distributions, patterns, and relationships.',
    details: [
      'Examined distributions of all 33 variables',
      'Identified missing values and outliers',
      'Computed summary statistics (mean, median, std, quartiles)',
      'Created correlation matrices to identify related variables',
      'Visualized relationships through scatter plots, histograms, and box plots',
    ],
    tools: ['Python/R', 'Matplotlib/ggplot2', 'Pandas/dplyr'],
  },
  {
    title: 'One-Way ANOVA',
    icon: '📊',
    description: 'Analysis of Variance to test whether group means differ significantly.',
    details: [
      'Used to compare grades across categorical groups (e.g., education levels, failure counts)',
      'Tests the null hypothesis that all group means are equal',
      'F-statistic measures ratio of between-group to within-group variance',
      'Significant results (p < 0.05) indicate at least one group differs',
      'Effect sizes computed to assess practical significance',
    ],
    formula: 'F = MS_between / MS_within',
    interpretation: 'A large F-value suggests group means differ more than would be expected by chance. For example, comparing grades across failure groups (0, 1, 2, 3+) yielded F > 30, p < 0.001.',
  },
  {
    title: 'Spearman Rank Correlation',
    icon: '📈',
    description: 'Non-parametric measure of rank correlation between two variables.',
    details: [
      'Used for ordinal variables (like alcohol consumption 1-5)',
      'Does not assume linear relationships',
      'Robust to outliers',
      'Values range from -1 (perfect negative) to +1 (perfect positive)',
      'Tests significance of monotonic relationships',
    ],
    formula: 'ρ = 1 - (6Σd²) / (n(n²-1))',
    interpretation: 'For weekend alcohol vs grades: ρ ≈ -0.17, indicating a weak but consistent negative relationship. Higher alcohol consumption tends to associate with lower grades.',
  },
  {
    title: 'Principal Component Analysis (PCA)',
    icon: '🎯',
    description: 'Dimensionality reduction technique to identify major patterns in multivariate data.',
    details: [
      'Reduces many variables to fewer uncorrelated dimensions',
      'Each component captures maximum remaining variance',
      'Loadings show which variables contribute to each dimension',
      'Used to identify "lifestyle" vs "family background" patterns',
      'Visualization in 2D reveals clustering by performance',
    ],
    formula: 'X = TW^T + E',
    interpretation: 'PC1 captured "social/alcohol" behaviors (goout, Walc, Dalc load high). PC2 captured "parental education" (Medu, Fedu dominate). Students scoring high on PC1 but low on PC2 tended to have lower grades.',
  },
  {
    title: 'Decision Tree Classification',
    icon: '🌳',
    description: 'Tree-based model that recursively splits data to predict outcomes.',
    details: [
      'Intuitive, interpretable structure',
      'Automatically handles non-linear relationships and interactions',
      'Variable importance derived from split gains',
      'Shows hierarchical importance of predictors',
      'Can handle both categorical and continuous variables',
    ],
    interpretation: 'The tree revealed "failures" as the root split (most important), followed by parental education for students without failures, and lifestyle factors for those with failures.',
  },
];

const assumptions = [
  {
    title: 'Selection Bias in Support Variables',
    description: 'Students receiving school support may have lower grades not because support is harmful, but because struggling students are selected into support programs. This is a classic case of confounding.',
  },
  {
    title: 'Self-Reported Data Limitations',
    description: 'Variables like alcohol consumption and study time are self-reported and may be subject to social desirability bias. Actual values may differ from reported values.',
  },
  {
    title: 'Cross-Sectional Design',
    description: 'Data represents a single point in time. We cannot establish causation—only associations. Prior grades (G1, G2) predicting G3 suggests stability but doesn\'t prove causal mechanisms.',
  },
  {
    title: 'Sample Specificity',
    description: 'Data comes from two Portuguese schools. Findings may not generalize to other countries, cultures, or educational systems.',
  },
];

export default function MethodsPage() {
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
              Methodology
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A detailed overview of the statistical methods and analytical techniques 
              used in this student performance analysis.
            </p>
          </motion.div>

          {/* Methods Grid */}
          <div className="space-y-8">
            {methods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{method.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-bold text-white mb-2">
                      {method.title}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {method.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2 mb-4">
                      {method.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-accent-teal mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {/* Formula if present */}
                    {method.formula && (
                      <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 mb-4 font-mono text-center">
                        <span className="text-accent-blue">{method.formula}</span>
                      </div>
                    )}

                    {/* Interpretation */}
                    {method.interpretation && (
                      <div className="bg-accent-teal/10 border-l-4 border-accent-teal rounded-r-lg p-4">
                        <div className="text-sm text-gray-300">
                          <span className="text-accent-teal font-semibold">In this study: </span>
                          {method.interpretation}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {method.tools && (
                      <div className="flex gap-2 mt-4">
                        {method.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1 bg-slate-800 rounded-full text-xs text-gray-400"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Assumptions & Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="font-display text-3xl font-bold text-white mb-6 text-center">
              Assumptions & Limitations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {assumptions.map((item, index) => (
                <div
                  key={item.title}
                  className="glass-card p-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-accent-coral text-xl">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 glass-card p-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Data Pipeline
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['Raw CSV', '→', 'Parsing & Cleaning', '→', 'Type Conversion', '→', 'Derived Variables', '→', 'Interactive Filtering', '→', 'Visualization'].map((step, i) => (
                <span
                  key={i}
                  className={step === '→' ? 'text-gray-600' : 'px-4 py-2 bg-slate-800 rounded-lg text-gray-300 text-sm'}
                >
                  {step}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-6 text-center">
              Data is loaded from <code className="text-accent-teal">/public/data/student-mat.csv</code>, 
              parsed using PapaParse, converted to typed TypeScript objects, and made available 
              through React Context for all components.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

