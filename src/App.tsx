import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, RefreshCcw, ShieldCheck, Github, Twitter, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { Transaction, CreditReport, LoanRequest, KYCInfo } from './types';
import { analyzeTransactions } from './services/gemini';
import { TransactionUpload } from './components/TransactionUpload';
import { CreditScoreCard } from './components/CreditScoreCard';
import { AnalysisReport } from './components/AnalysisReport';
import { LoanRequestForm } from './components/LoanRequestForm';
import { KYCForm } from './components/KYCForm';

type Step = 'kyc' | 'loan-request' | 'upload' | 'report';

export default function App() {
  const [step, setStep] = useState<Step>('kyc');
  const [kycInfo, setKycInfo] = useState<KYCInfo | null>(null);
  const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CreditReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleKYC = (info: KYCInfo) => {
    setKycInfo(info);
    setStep('loan-request');
  };

  const handleLoanRequest = (request: LoanRequest) => {
    setLoanRequest(request);
    setStep('upload');
  };

  const handleUpload = async (transactions: Transaction[] | string) => {
    if (!loanRequest || !kycInfo) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeTransactions(transactions, loanRequest, kycInfo);
      setReport(result);
      setStep('report');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('kyc');
    setKycInfo(null);
    setLoanRequest(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Jenga<span className="text-accent-green">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Documentation</button>
            <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <AnimatePresence mode="wait">
          {step === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
                  Build your financial <span className="text-accent-green">future.</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Jenga AI is your sophisticated strategic partner, engineered to demystify the complexities of capital acquisition. We don’t just offer data; we provide a high-fidelity roadmap to financial empowerment, ensuring your business is not just "loan-ready," but structurally optimized for sustainable growth.
                </p>
              </div>

              <KYCForm onSubmit={handleKYC} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                <FeatureCard 
                  title="Privacy First" 
                  description="Your data is processed securely and never stored on our servers."
                  icon={<ShieldCheck className="w-5 h-5" />}
                />
                <FeatureCard 
                  title="AI Analysis" 
                  description="Advanced machine learning models evaluate your transaction consistency."
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <FeatureCard 
                  title="Instant Results" 
                  description="Get your credit score and financial health report in seconds."
                  icon={<TrendingDown className="w-5 h-5" />}
                />
              </div>
            </motion.div>
          )}

          {step === 'loan-request' && (
            <motion.div
              key="loan-request"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setStep('kyc')}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Loan Details</h2>
                  <p className="text-slate-500">Applicant: {kycInfo?.phoneNumber}</p>
                </div>
              </div>

              <LoanRequestForm onSubmit={handleLoanRequest} />
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setStep('loan-request')}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Upload Financial Statement</h2>
                  <p className="text-slate-500">
                    Loan Request: KES {loanRequest?.amount.toLocaleString()} for {loanRequest?.purpose}
                  </p>
                </div>
              </div>

              <TransactionUpload onUpload={handleUpload} isLoading={isLoading} />

              {error && (
                <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {step === 'report' && report && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Your Credit Report</h1>
                  <p className="text-slate-500">Based on a KES {loanRequest?.amount.toLocaleString()} loan request</p>
                </div>
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  New Application
                </button>
              </div>

              <CreditScoreCard report={report} />
              <AnalysisReport report={report} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-50">
              <Wallet className="w-5 h-5" />
              <span className="font-bold tracking-tight">Jenga AI</span>
            </div>
            
            <div className="flex gap-6 text-slate-400">
              <Twitter className="w-5 h-5 hover:text-accent-blue cursor-pointer transition-colors" />
              <Github className="w-5 h-5 hover:text-slate-900 cursor-pointer transition-colors" />
            </div>

            <p className="text-sm text-slate-400">
              © 2026 Jenga AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
