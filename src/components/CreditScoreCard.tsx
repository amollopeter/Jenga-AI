import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, Info, Calendar } from 'lucide-react';
import { CreditReport } from '../types';
import { cn } from '../lib/utils';

interface Props {
  report: CreditReport;
}

export function CreditScoreCard({ report }: Props) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'B': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'C': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'D': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-rose-500 bg-rose-50 border-rose-100';
    }
  };

  const scorePercentage = ((report.score - 300) / (850 - 300)) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">Jenga Score</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-slate-900 tracking-tighter">{report.score}</span>
                <span className="text-slate-400 font-medium">/ 850</span>
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-full border text-lg font-bold",
              getGradeColor(report.grade)
            )}>
              Grade {report.grade}
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${scorePercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full",
                  report.score > 700 ? "bg-emerald-500" : report.score > 600 ? "bg-blue-500" : "bg-amber-500"
                )}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Poor (300)</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent (850)</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{report.summary}</p>
                </div>
              </div>
            </div>

            {report.repaymentSchedule && (
              <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">Recommended Repayment</h4>
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-slate-900">
                        KES {report.repaymentSchedule.amount.toLocaleString()} 
                        <span className="text-xs font-medium text-slate-500 ml-1">/ {report.repaymentSchedule.frequency}</span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Tenor: {report.repaymentSchedule.tenor}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50" />
      </motion.div>

      {/* Quick Metrics */}
      <div className="space-y-4">
        <MetricCard 
          label="Monthly Income" 
          value={`KES ${report.metrics.monthlyIncome.toLocaleString()}`}
          icon={<TrendingUp className="w-4 h-4" />}
          color="emerald"
        />
        <MetricCard 
          label="Monthly Expenses" 
          value={`KES ${report.metrics.monthlyExpenses.toLocaleString()}`}
          icon={<TrendingDown className="w-4 h-4" />}
          color="rose"
        />
        <MetricCard 
          label="Savings Rate" 
          value={`${(report.metrics.savingsRate * 100).toFixed(1)}%`}
          icon={<Minus className="w-4 h-4" />}
          color="blue"
        />
        <MetricCard 
          label="DTI Ratio" 
          value={`${(report.metrics.debtToIncomeRatio * 100).toFixed(1)}%`}
          icon={<Info className="w-4 h-4" />}
          color="slate"
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
    >
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors[color])}>
        {icon}
      </div>
    </motion.div>
  );
}
