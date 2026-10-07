import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSupport() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-[#67748E] hover:text-[#141727] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#cb0c9f] p-2.5 rounded-xl">
            <MessageSquare size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#344767]">Contact Support</h1>
        </div>
        
        <p className="text-[#67748E] mb-10">We're here to help! Our standard support hours are Monday through Friday, 9am to 6pm EST. We typically respond to all inquiries within 24 hours.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="bg-[#141727]/5 p-3 rounded-xl text-[#141727]">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#344767] mb-1">Email Us</h3>
              <p className="text-sm text-[#67748E] mb-2">For general support and technical questions.</p>
              <a href="mailto:support@analyticsdashboard.com" className="text-[#cb0c9f] font-semibold hover:underline">support@analyticsdashboard.com</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-[#141727]/5 p-3 rounded-xl text-[#141727]">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#344767] mb-1">Call Us</h3>
              <p className="text-sm text-[#67748E] mb-2">For urgent enterprise support inquiries.</p>
              <a href="tel:+18005550199" className="text-[#cb0c9f] font-semibold hover:underline">+1 (800) 555-0199</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-[#141727]/5 p-3 rounded-xl text-[#141727]">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#344767] mb-1">Headquarters</h3>
              <p className="text-sm text-[#67748E]">
                123 Data Center Parkway<br/>
                Suite 400<br/>
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-[#344767] mb-4">Send a Message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#141727] text-sm" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#141727] text-sm" />
            </div>
            <textarea placeholder="How can we help you?" rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#141727] text-sm resize-none"></textarea>
            <button className="bg-[#141727] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#252f40] transition-colors">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}
