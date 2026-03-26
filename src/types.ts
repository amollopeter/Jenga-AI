export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  category: string;
}

export interface KYCInfo {
  kraPin: string;
  idNumber: string;
  phoneNumber: string;
  sector: string;
  selfieUrl?: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface LoanRequest {
  amount: number;
  purpose: string;
}

export interface CreditReport {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  summary: string;
  insights: {
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  metrics: {
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    debtToIncomeRatio: number;
  };
  repaymentSchedule?: {
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    amount: number;
    tenor: string;
  };
  recommendations: string[];
}
