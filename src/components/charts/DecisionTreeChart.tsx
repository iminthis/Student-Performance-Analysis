'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartWrapper from '@/components/ui/ChartWrapper';

// Type definitions for tree nodes
interface LeafNode {
  id: string;
  prediction: number;
  label: string;
  description: string;
  samples: number;
}

interface DecisionNode {
  id: string;
  variable: string;
  threshold: string;
  label: string;
  description: string;
  left: TreeNode;
  right: TreeNode;
}

type TreeNode = LeafNode | DecisionNode;

// Decision tree structure based on typical findings from student performance analysis
const decisionTree: DecisionNode = {
  id: 'root',
  variable: 'failures',
  threshold: '> 0',
  label: 'Past Failures > 0?',
  description: 'Have you failed any classes before?',
  left: {
    id: 'failures-no',
    variable: 'Medu',
    threshold: '> 2',
    label: "Mother's Ed > Middle School?",
    description: "No prior failures. Check mother's education level.",
    left: {
      id: 'medu-low',
      variable: 'studytime',
      threshold: '> 2',
      label: 'Study Time > 2-5hrs?',
      description: "Lower maternal education. Study habits become key.",
      left: {
        id: 'low-study',
        prediction: 9.2,
        label: 'Predicted: 9.2',
        description: 'At-risk group: low parent ed + low study time',
        samples: 45,
      },
      right: {
        id: 'high-study',
        prediction: 11.1,
        label: 'Predicted: 11.1',
        description: 'Study time compensates for lower parent ed',
        samples: 28,
      },
    },
    right: {
      id: 'medu-high',
      variable: 'absences',
      threshold: '> 10',
      label: 'Absences > 10?',
      description: 'Higher maternal education. Check attendance.',
      left: {
        id: 'good-attendance',
        prediction: 12.8,
        label: 'Predicted: 12.8',
        description: 'Strong profile: no failures + educated parent + good attendance',
        samples: 180,
      },
      right: {
        id: 'poor-attendance',
        prediction: 10.5,
        label: 'Predicted: 10.5',
        description: 'High absences reduce advantage of good background',
        samples: 35,
      },
    },
  },
  right: {
    id: 'failures-yes',
    variable: 'Walc',
    threshold: '> 3',
    label: 'Weekend Alcohol > Moderate?',
    description: 'Has prior failures. Check lifestyle factors.',
    left: {
      id: 'low-alcohol',
      variable: 'goout',
      threshold: '> 4',
      label: 'Going Out Very High?',
      description: 'Prior failures but controlled alcohol. Check social habits.',
      left: {
        id: 'moderate-social',
        prediction: 8.5,
        label: 'Predicted: 8.5',
        description: 'Prior failures but manageable lifestyle',
        samples: 52,
      },
      right: {
        id: 'high-social',
        prediction: 6.8,
        label: 'Predicted: 6.8',
        description: 'Multiple risk factors compound',
        samples: 18,
      },
    },
    right: {
      id: 'high-alcohol',
      prediction: 5.9,
      label: 'Predicted: 5.9',
      description: 'High-risk group: prior failures + high alcohol consumption',
      samples: 37,
    },
  },
};

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  path: string[];
  activePath: string[];
  onNodeClick: (nodeId: string, path: string[]) => void;
}

function TreeNode({ node, depth, path, activePath, onNodeClick }: TreeNodeProps) {
  const isActive = activePath.includes(node.id);
  const isLeaf = 'prediction' in node;
  const currentPath = [...path, node.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: depth * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Node */}
      <button
        onClick={() => onNodeClick(node.id, currentPath)}
        className={`
          relative px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[160px] text-center
          ${isLeaf 
            ? isActive
              ? 'bg-accent-teal/30 border-accent-teal text-white'
              : 'bg-slate-800/80 border-slate-600 text-gray-300 hover:border-slate-500'
            : isActive
              ? 'bg-accent-blue/30 border-accent-blue text-white'
              : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:border-slate-500'
          }
        `}
      >
        {isLeaf ? (
          <>
            <div className="text-2xl font-bold font-mono text-accent-teal">
              {(node as LeafNode).prediction}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              n = {(node as LeafNode).samples}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-medium">{node.label}</div>
            <div className="text-xs text-gray-500 mt-1">{node.variable}</div>
          </>
        )}
      </button>

      {/* Children */}
      {!isLeaf && (
        <div className="flex gap-8 mt-4">
          {/* Left branch (No) */}
          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-slate-600" />
            <div className="text-xs text-accent-coral mb-2 font-mono">No</div>
            <TreeNode
              node={(node as DecisionNode).left}
              depth={depth + 1}
              path={currentPath}
              activePath={activePath}
              onNodeClick={onNodeClick}
            />
          </div>
          
          {/* Right branch (Yes) */}
          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-slate-600" />
            <div className="text-xs text-accent-teal mb-2 font-mono">Yes</div>
            <TreeNode
              node={(node as DecisionNode).right}
              depth={depth + 1}
              path={currentPath}
              activePath={activePath}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Profile walkthrough scenarios
const profiles = [
  {
    name: 'High Achiever',
    description: 'No failures, educated mother, good attendance',
    path: ['root', 'failures-no', 'medu-high', 'good-attendance'],
    icon: '🌟',
  },
  {
    name: 'At-Risk Student',
    description: 'Has failures, high alcohol, needs intervention',
    path: ['root', 'failures-yes', 'high-alcohol'],
    icon: '⚠️',
  },
  {
    name: 'Resilient Learner',
    description: 'Lower parent education but high study time',
    path: ['root', 'failures-no', 'medu-low', 'high-study'],
    icon: '💪',
  },
  {
    name: 'Distracted Student',
    description: 'Good background but many absences',
    path: ['root', 'failures-no', 'medu-high', 'poor-attendance'],
    icon: '📵',
  },
];

export default function DecisionTreeChart() {
  const [activePath, setActivePath] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string, path: string[]) => {
    setActivePath(path);
    setActiveProfile(null);
  };

  const handleProfileClick = (profile: typeof profiles[0]) => {
    setActivePath(profile.path);
    setActiveProfile(profile.name);
  };

  const findNode = (tree: TreeNode, id: string): TreeNode | null => {
    if (tree.id === id) return tree;
    if ('left' in tree) {
      const found = findNode(tree.left, id);
      if (found) return found;
    }
    if ('right' in tree) {
      const found = findNode(tree.right, id);
      if (found) return found;
    }
    return null;
  };

  const activeNode = activePath.length > 0 
    ? findNode(decisionTree, activePath[activePath.length - 1]) 
    : null;

  return (
    <ChartWrapper
      id="decision-tree"
      title="Decision Tree: Predicting Student Performance"
      howToRead="Navigate the tree to see how different factors combine to predict grades. Click nodes to explore, or use the profile buttons to see typical student journeys. Left branches = 'No', Right branches = 'Yes'."
      takeaway="Past failures is the root split—the most important predictor. For students without failures, mother's education becomes key. For those with failures, lifestyle factors (alcohol, social activity) determine outcomes."
      statsNote="This simplified tree illustrates key decision paths. In the full model, additional variables refine predictions. The tree captures hierarchical interactions that linear models miss."
      exportable={false}
    >
      {/* Profile shortcuts */}
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-3">Explore student profiles:</div>
        <div className="flex flex-wrap gap-3">
          {profiles.map((profile) => (
            <button
              key={profile.name}
              onClick={() => handleProfileClick(profile)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeProfile === profile.name
                  ? 'bg-accent-teal/20 border border-accent-teal/50 text-white'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-slate-600'
                }
              `}
            >
              <span className="text-xl">{profile.icon}</span>
              <div className="text-left">
                <div className="text-sm font-medium">{profile.name}</div>
                <div className="text-xs text-gray-500">{profile.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tree visualization */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] flex justify-center">
          <TreeNode
            node={decisionTree}
            depth={0}
            path={[]}
            activePath={activePath}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      {/* Active node description */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-slate-800/80 border border-slate-700 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center">
                {'prediction' in activeNode ? (
                  <span className="text-2xl">🎯</span>
                ) : (
                  <span className="text-2xl">🔀</span>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  {activeNode.label}
                </h4>
                <p className="text-gray-400 text-sm">
                  {activeNode.description}
                </p>
                {'prediction' in activeNode && (
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-accent-teal font-mono text-lg">
                      Predicted Grade: {(activeNode as LeafNode).prediction}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({(activeNode as LeafNode).samples} students in this group)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path visualization */}
      {activePath.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Path:</span>
          {activePath.map((nodeId, index) => {
            const node = findNode(decisionTree, nodeId);
            return (
              <span key={nodeId} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-600">→</span>}
                <span className="text-sm text-accent-teal">{node?.label?.split('?')[0] || nodeId}</span>
              </span>
            );
          })}
        </div>
      )}
    </ChartWrapper>
  );
}

