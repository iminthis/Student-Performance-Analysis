'use client';

import { motion } from 'framer-motion';

export function ChartLoadingSkeleton() {
  return (
    <div className="w-full h-80 loading-skeleton rounded-xl" />
  );
}

export function PageLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-teal"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-blue"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border-2 border-transparent border-t-accent-purple"
          />
        </div>
        <p className="text-gray-400">Loading data...</p>
      </motion.div>
    </div>
  );
}

export function EmptyState({ message = 'No data available for the current filters' }: { message?: string }) {
  return (
    <div className="w-full h-80 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 opacity-50">📊</div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}

