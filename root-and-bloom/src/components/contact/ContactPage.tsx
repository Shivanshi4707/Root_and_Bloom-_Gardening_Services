import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Service Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Message Received 🌿', 'Our botanical concierge will connect with you within 2 hours.');
  };

  return (
    <div className="py-8 md:py-14 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>Root & Bloom Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#142E20]">
            Get in touch with us
          </h1>
          <p className="text-xs sm:text-sm text-[#546E5E] mt-2 leading-relaxed">
            Have a question regarding bulk commercial maintenance, urgent plant clinic house-calls, or 35-min delivery orders? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#DFD8CB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] flex items-center justify-center text-[#2A5C43]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#142E20]">
                Flagship Botanical Hub & Nursery
              </h3>
              <p className="text-xs text-[#546E5E] leading-relaxed">
                Root & Bloom Garden Co.<br />
                84/2, 100 Feet Road, Indiranagar,<br />
                Bengaluru, Karnataka 560038
              </p>
              <span className="text-[11px] font-semibold text-[#2A5C43] block">
                Express dispatch hubs also live across Mumbai, Delhi-NCR, Hyderabad & Pune.
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#DFD8CB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] flex items-center justify-center text-[#2A5C43]">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#142E20]">
                Botanical Hotline & WhatsApp
              </h3>
              <p className="text-xs text-[#546E5E] leading-relaxed">
                Direct phone: <strong>+91 (80) 4122-BLOOM</strong><br />
                WhatsApp support: <strong>+91 98451 22890</strong>
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#DFD8CB] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] flex items-center justify-center text-[#2A5C43]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#142E20]">
                Operational Hours
              </h3>
              <p className="text-xs text-[#546E5E] leading-relaxed">
                Monday to Sunday: <strong>7:00 AM - 9:00 PM</strong><br />
                Electric quick-commerce deliveries active every day of the year.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#DFD8CB] shadow-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E5EFE7] text-[#2A5C43] flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                  Thank you for reaching out!
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6857] max-w-sm mx-auto leading-relaxed">
                  We have received your message. Our botanical coordinator will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#1A3828] text-white text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#2A5C43] block mb-1">
                    Send a Message
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                    Connect with our Horticulturists
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohini Iyer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98451 22890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rohini@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Inquiry Purpose</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold focus:ring-2 focus:ring-[#2A5C43]"
                    >
                      <option value="Service Inquiry">Garden Maintenance / Clinic Visit</option>
                      <option value="Landscaping Design">Custom Landscaping Blueprint</option>
                      <option value="Order Tracking">Store Order & Delivery Help</option>
                      <option value="Commercial AMC">Commercial Office / Cafe Greenery AMC</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">Your Message or Space Details</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your garden size, current plant health, or any specific requirements..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A3828] hover:bg-[#11291D] text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#1A3828]/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
