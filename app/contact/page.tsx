'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
      <div className="py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="order-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-bold mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl hover:bg-black/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="order-1 md:order-2 space-y-8">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-gray-600">support@example.com</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Phone</h3>
                  <p className="text-gray-600">+1 234 567 890</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Store Street<br />
                    City, Country 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-bold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-bold">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div>
              <h3 className="font-bold mb-2">What are your shipping times?</h3>
              <p className="text-gray-600">We deliver within 2-4 business days across Europe. Free shipping on orders over €50.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What is your return policy?</h3>
              <p className="text-gray-600">We offer a 30-day return policy. Items must be unused and in original packaging.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600">Yes, we ship to most countries worldwide. Shipping costs vary by location.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">How can I track my order?</h3>
              <p className="text-gray-600">Once your order ships, you'll receive a tracking number via email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 