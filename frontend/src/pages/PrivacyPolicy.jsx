import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-[#67748E] hover:text-[#141727] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#141727] p-2.5 rounded-xl">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#344767]">Privacy Policy</h1>
        </div>
        <div className="prose prose-sm text-[#67748E] space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 className="text-lg font-bold text-[#344767]">1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>
          
          <h3 className="text-lg font-bold text-[#344767]">2. How We Use Your Information</h3>
          <p>We may use the information we collect about you to: Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</p>
          
          <h3 className="text-lg font-bold text-[#344767]">3. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect the personal data that we process about you against unauthorized or unlawful processing, accidental loss, destruction, damage, alteration, or disclosure. Our security architecture includes encryption in transit, strict access controls, and secure infrastructure design.</p>
        </div>
      </div>
    </div>
  );
}
