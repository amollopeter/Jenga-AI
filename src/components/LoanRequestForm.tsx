import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, MessageSquare, ArrowRight } from 'lucide-react';
import { LoanRequest } from '../types';

interface Props {
  onSubmit: (request: LoanRequest) => void;
}

export function LoanRequestForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !purpose) return;
    onSubmit({
      amount: parseFloat(amount),
      purpose
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Loan Application</h2>
          <p className="text-slate-500">Tell us about the loan you are seeking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-3 h-3" /> Loan Amount (KES)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">KES</span>
              <input
                type="number"
                required
                placeholder="e.g. 50,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all text-lg font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Purpose of Loan
            </label>
            <textarea
              required
              placeholder="e.g. Business expansion, school fees, medical emergency..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-200 group"
          >
            Continue to Transaction Upload
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
