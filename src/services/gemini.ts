import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, CreditReport, LoanRequest, KYCInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeTransactions(
  transactions: Transaction[] | string, 
  loanRequest: LoanRequest,
  kycInfo: KYCInfo
): Promise<CreditReport> {
  const model = "gemini-3.1-pro-preview";
  
  const transactionsContent = typeof transactions === 'string' 
    ? `Raw Transaction Data (Extracted from PDF):\n${transactions}`
    : `Structured Transaction History:\n${JSON.stringify(transactions, null, 2)}`;

  const parts: any[] = [
    {
      text: `
        You are Jenga AI, a sophisticated financial analyst for the Kenyan market.
        Analyze the following mobile money transaction history (values in KES) and evaluate a loan request based on specific sector profiles.
        
        Applicant Profile:
        - Sector: ${kycInfo.sector}
        - KRA PIN: ${kycInfo.kraPin}
        - ID Number: ${kycInfo.idNumber}
        
        Loan Request:
        - Amount: KES ${loanRequest.amount}
        - Purpose: ${loanRequest.purpose}
        
        Sector-Specific Scoring Logic (Internal - Do not disclose to user):
        1. Mama Mboga (Daily High-Velocity Retail):
           - Look for high frequency, low-value inflows (KSh 50 - 2,000).
           - Reward: Consistent daily aggregated revenue >= KSh 5,000 + early morning outflows to wholesalers (e.g., Marikiti).
           - Ideal Repayment: Daily (~KSh 700 for 30 days on 20k loan).
        
        2. Boda Boda & Logistics (Asset-Driven):
           - Monitor fuel payments (petrol stations) and Sacco deposits.
           - Risk: Heavy reliance on Fuliza for fuel without 24h clearing.
           - Ideal Repayment: Weekly (~KSh 4,600 for 12 weeks on 50k loan).
        
        3. Creative & Cyber (Project-Based):
           - Focus on utility stability (Internet, KPLC).
           - Pattern: Low frequency, high value (KSh 45k - 120k).
           - Reward: Recurring client Paybill IDs.
           - Ideal Repayment: Monthly (~KSh 26,750 for 6 months on 150k loan).
        
        4. General Retail & Duka (Inventory-Backed):
           - Analyze "Restock-to-Revenue" ratio (weekly outflows KSh 50k+ to distributors).
           - Reward: Management of 30-day supplier credit.
           - Ideal Repayment: Bi-weekly (~KSh 21,200 for 60 days on 80k loan).
        
        ${transactionsContent}
        
        Consider:
        1. Income consistency and sources.
        2. Spending patterns (essential vs. non-essential).
        3. Savings rate.
        4. Debt-related transactions (loans, repayments).
        5. Overall financial stability.
        6. The feasibility of the loan request given the financial history.
        7. KYC Verification: If a selfie is provided, acknowledge that the applicant has provided a visual identity check.
        
        Return the analysis in the specified JSON format.
      `
    }
  ];

  if (kycInfo.selfieUrl) {
    const base64Data = kycInfo.selfieUrl.split(',')[1];
    const mimeType = kycInfo.selfieUrl.split(',')[0].split(':')[1].split(';')[0];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Credit score from 300 to 850" },
          grade: { type: Type.STRING, enum: ["A", "B", "C", "D", "E", "F"] },
          summary: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["positive", "negative", "neutral"] }
              },
              required: ["title", "description", "impact"]
            }
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              monthlyIncome: { type: Type.NUMBER },
              monthlyExpenses: { type: Type.NUMBER },
              savingsRate: { type: Type.NUMBER },
              debtToIncomeRatio: { type: Type.NUMBER }
            },
            required: ["monthlyIncome", "monthlyExpenses", "savingsRate", "debtToIncomeRatio"]
          },
          repaymentSchedule: {
            type: Type.OBJECT,
            properties: {
              frequency: { type: Type.STRING, enum: ["daily", "weekly", "bi-weekly", "monthly"] },
              amount: { type: Type.NUMBER },
              tenor: { type: Type.STRING }
            },
            required: ["frequency", "amount", "tenor"]
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["score", "grade", "summary", "insights", "metrics", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as CreditReport;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate credit report. Please try again.");
  }
}
