import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { CreditReport } from '../types';
import { cn } from '../lib/utils';

interface Props {
  report: CreditReport;
}

export function AnalysisReport({ report }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {/* Key Insights */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900">Key Insights</h3>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        
        <div className="space-y-4">
          {report.insights.map((insight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex gap-4"
            >
              <div className={cn(
                "mt-1 shrink-0",
                insight.impact === 'positive' ? "text-emerald-500" : 
                insight.impact === 'negative' ? "text-rose-500" : "text-amber-500"
              )}>
                {insight.impact === 'positive' ? <CheckCircle2 className="w-5 h-5" /> : 
                 insight.impact === 'negative' ? <XCircle className="w-5 h-5" /> : 
                 <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900">Recommendations</h3>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="bg-gradient-to-br from-accent-blue to-accent-green rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-brand-200">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest">Action Plan</span>
            </div>

            <div className="space-y-4">
              {report.recommendations.map((rec, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                  className="flex items-start gap-3 group cursor-default"
                >
                  <ArrowRight className="w-4 h-4 mt-1 shrink-0 opacity-50 group-hover:translate-x-1 transition-transform" />
                  <p className="text-sm font-medium text-brand-50 leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
        </div>
      </section>
    </div>
  );
}
