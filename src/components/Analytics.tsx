import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { AnimeTheme, UserStats } from '../types';

interface AnalyticsProps {
  theme: AnimeTheme;
  userStats: UserStats;
}

export const Analytics: React.FC<AnalyticsProps> = ({ theme, userStats }) => {
  // Generate past 7 days study hours for Bar Chart
  const studyDaysData = [
    { day: 'Mon', hours: 6.5, target: 8 },
    { day: 'Tue', hours: 7.2, target: 8 },
    { day: 'Wed', hours: 5.8, target: 8 },
    { day: 'Thu', hours: 8.0, target: 8 },
    { day: 'Fri', hours: 6.0, target: 8 },
    { day: 'Sat', hours: 9.5, target: 8 },
    { day: 'Sun', hours: 8.5, target: 8 },
  ];

  // Subject distribution
  const subjectDistribution = [
    { name: 'Maths (Limits & Backlogs)', value: 40, color: '#06b6d4' },
    { name: 'Chemistry (Organic 44 Lecs)', value: 35, color: '#f43f5e' },
    { name: 'Physics (Fluids & Electrodynamics)', value: 25, color: '#f59e0b' },
  ];

  // Mock Test Scores
  const testScores = [
    { name: 'JEE Mock 1', score: 182, max: 300 },
    { name: 'JEE Mock 2', score: 198, max: 300 },
    { name: 'JEE Mock 3', score: 215, max: 300 },
    { name: 'JEE Mock 4', score: 228, max: 300 },
  ];

  return (
    <div id="analytics-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title Header */}
      <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Hunter Intelligence & Performance Diagnostics</span>
        </div>
        <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>
          JEE Performance Analytics
        </h2>
        <p className="text-xs text-white/70">
          Analyze study consistency, subject distribution, and mock test score progression.
        </p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Hours Bar Chart */}
        <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${theme.textPrimary}`}>
              Weekly Study Hours vs Target
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Avg: 7.3 hrs/day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyDaysData}>
                <XAxis dataKey="day" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#06b6d4',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Focus Distribution Pie Chart */}
        <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-4`}>
          <h3 className={`text-base font-bold ${theme.textPrimary}`}>Subject Time Distribution</h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#a855f7',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            {subjectDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/80">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Mastery Diagnostics: Strong vs Weak Chapters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Chapters */}
        <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-3`}>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>High Mastery Chapters (S-Rank)</span>
          </div>

          <div className="space-y-2">
            {[
              { title: 'Limits, Continuity & Differentiability', accuracy: '92%' },
              { title: 'Electrostatics & Electric Potential', accuracy: '88%' },
              { title: 'Chemical Bonding & Molecular Structure', accuracy: '85%' },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between text-xs font-medium"
              >
                <span className="text-white">{c.title}</span>
                <span className="text-emerald-400 font-mono font-bold">{c.accuracy} Accuracy</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Chapters Needing Revision */}
        <div className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} space-y-3`}>
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Target Revision Areas (Backlogs)</span>
          </div>

          <div className="space-y-2">
            {[
              { title: '11th Fluids & Bernoulli Equation', status: 'In Progress' },
              { title: '12th Organic Mechanisms (SN1/SN2)', status: '44 Lecs Left' },
              { title: '11th Solution of Triangles & Binomial', status: 'Pending' },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-black/40 border border-rose-500/30 flex items-center justify-between text-xs font-medium"
              >
                <span className="text-white">{c.title}</span>
                <span className="text-rose-400 font-mono font-bold">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
