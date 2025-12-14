'use client';

import { ReactNode, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ChartWrapperProps {
  title: string;
  howToRead: string;
  takeaway: string;
  statsNote?: string;
  children: ReactNode;
  id?: string;
  exportable?: boolean;
}

export default function ChartWrapper({
  title,
  howToRead,
  takeaway,
  statsNote,
  children,
  id,
  exportable = true,
}: ChartWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!chartRef.current) return;

    try {
      // Find SVG element in the chart
      const svg = chartRef.current.querySelector('svg');
      if (!svg) {
        console.warn('No SVG found to export');
        return;
      }

      // Clone the SVG
      const svgClone = svg.cloneNode(true) as SVGElement;
      
      // Add white background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', '#1a2234');
      svgClone.insertBefore(rect, svgClone.firstChild);

      // Get SVG string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [title]);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="chart-container mb-12"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="how-to-read">{howToRead}</p>
        </div>
        {exportable && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white 
                       bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all"
            title="Export as SVG"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        )}
      </div>

      {/* Chart Area */}
      <div ref={chartRef} className="mb-6">
        {children}
      </div>

      {/* Takeaway */}
      <div className="takeaway-box mb-4">
        <div className="flex items-start gap-3">
          <span className="text-accent-teal text-xl">💡</span>
          <div>
            <span className="font-semibold text-white">Key Takeaway: </span>
            <span className="text-gray-300">{takeaway}</span>
          </div>
        </div>
      </div>

      {/* Stats Note */}
      {statsNote && (
        <div className="stats-note">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-accent-blue font-semibold">Statistical Note</span>
          </div>
          <p className="text-gray-300">{statsNote}</p>
        </div>
      )}
    </motion.section>
  );
}

