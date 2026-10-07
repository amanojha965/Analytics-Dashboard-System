import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-[#67748E] hover:text-[#141727] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#141727] p-2.5 rounded-xl">
            <FileText size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#344767]">Terms of Service</h1>
        </div>
        <div className="prose prose-sm text-[#67748E] space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 className="text-lg font-bold text-[#344767]">1. Agreement to Terms</h3>
          <p>By accessing or using our Analytics Dashboard ("Platform"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Platform.</p>
          
          <h3 className="text-lg font-bold text-[#344767]">2. Acceptable Use</h3>
          <p>You agree not to use the Platform to: (a) upload or distribute viruses or malicious code, (b) attempt to access accounts or data belonging to others without authorization, (c) scrape or automatedly extract data without our written permission, or (d) violate any applicable laws or regulations.</p>
          
          <h3 className="text-lg font-bold text-[#344767]">3. Account Responsibilities</h3>
          <p>You are entirely responsible for maintaining the confidentiality of your password and account. Furthermore, you are entirely responsible for any and all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
        </div>
      </div>
    </div>
  );
}
