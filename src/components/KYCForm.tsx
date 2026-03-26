import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, CreditCard, Phone, Camera, Users, ArrowRight, Briefcase } from 'lucide-react';
import { KYCInfo } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onSubmit: (info: KYCInfo) => void;
}

export function KYCForm({ onSubmit }: Props) {
  const [kraPin, setKraPin] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selfie, setSelfie] = useState<File | null>(null);
  const [nokName, setNokName] = useState('');
  const [nokRelationship, setNokRelationship] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [sector, setSector] = useState('');

  const sectors = [
    'Mama Mboga (Daily High-Velocity Retail)',
    'Boda Boda & Logistics (Asset-Driven Operations)',
    'Creative & Cyber (Project-Based Stability)',
    'General Retail & Duka (Inventory-Backed Operations)',
    'Agriculture & Agribusiness',
    'Manufacturing',
    'Construction & Real Estate',
    'Education',
    'Healthcare',
    'Hospitality & Tourism',
    'Professional Services',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kraPin || !idNumber || !phoneNumber || !nokName || !nokRelationship || !nokPhone || !sector || !selfie) {
      alert("Please provide all required information, including a selfie.");
      return;
    }
    
    let selfieUrl = undefined;
    if (selfie) {
      selfieUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selfie);
      });
    }

    onSubmit({
      kraPin,
      idNumber,
      phoneNumber,
      sector,
      selfieUrl,
      nextOfKin: {
        name: nokName,
        relationship: nokRelationship,
        phoneNumber: nokPhone
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vital KYC Details</h2>
          <p className="text-slate-500">Please provide your identification and contact information to begin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> KRA PIN
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A012345678B"
                value={kraPin}
                onChange={(e) => setKraPin(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> ID Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 12345678"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Sector
              </label>
              <select
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select your sector</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-3 h-3" /> Picture of Oneself
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                className="hidden"
                id="selfie-upload"
              />
              <label 
                htmlFor="selfie-upload"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all",
                  selfie ? "text-accent-green border-accent-green/30 bg-accent-green/5" : "text-slate-500"
                )}
              >
                <Camera className="w-4 h-4" />
                {selfie ? selfie.name : "Upload Selfie"}
              </label>
            </div>
          </div>

          {/* Next of Kin */}
          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Next of Kin Details</h3>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={nokName}
                  onChange={(e) => setNokName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spouse, Parent, Sibling"
                  value={nokRelationship}
                  onChange={(e) => setNokRelationship(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 0712345678"
                value={nokPhone}
                onChange={(e) => setNokPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-200 group"
          >
            Continue to Loan Details
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
