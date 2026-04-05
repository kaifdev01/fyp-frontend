'use client';
import { useState } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { HelpCircle, MessageSquare, FileText, Mail, Phone, ChevronDown, Search, Plus, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

const MOCK_FAQS = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I post my first job?',
    answer: 'To post your first job, navigate to the "Post a Job" section from your dashboard. Fill in the job details, set your budget, and submit. Your job will be visible to freelancers immediately.'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and digital wallets. You can manage your payment methods in the Payments section.'
  },
  {
    id: 3,
    category: 'Payments',
    question: 'When will I be charged for a project?',
    answer: 'You will be charged when you release payment to the freelancer. You can set up milestone-based payments or pay upon completion. The funds are held securely until you approve the work.'
  },
  {
    id: 4,
    category: 'Payments',
    question: 'Can I get a refund?',
    answer: 'Yes, you can request a refund if the work is not completed or does not meet the agreed specifications. Contact our support team to initiate a refund request.'
  },
  {
    id: 5,
    category: 'Freelancers',
    question: 'How do I find the right freelancer?',
    answer: 'Use our "Find Freelancers" feature to search by skills, experience, and ratings. You can also view their portfolios and previous client reviews to make an informed decision.'
  },
  {
    id: 6,
    category: 'Freelancers',
    question: 'Can I hire multiple freelancers for one project?',
    answer: 'Yes, you can hire multiple freelancers for a single project. You can manage all contracts from your Contracts page and communicate with each freelancer separately.'
  },
  {
    id: 7,
    category: 'Projects',
    question: 'How do I track project progress?',
    answer: 'You can track project progress through your dashboard. Each project shows milestones, deliverables, and communication history. You can also set up notifications for important updates.'
  },
  {
    id: 8,
    category: 'Projects',
    question: 'What if a freelancer misses a deadline?',
    answer: 'If a freelancer misses a deadline, you can contact them through the messaging system. If the issue persists, you can escalate to our support team for mediation.'
  }
];

const MOCK_SUPPORT_TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Payment not received',
    status: 'open',
    priority: 'high',
    createdDate: '2024-01-25',
    lastUpdate: '2024-01-25',
    category: 'Payments'
  },
  {
    id: 'TKT-002',
    subject: 'Freelancer not responding',
    status: 'in-progress',
    priority: 'medium',
    createdDate: '2024-01-20',
    lastUpdate: '2024-01-24',
    category: 'Freelancers'
  },
  {
    id: 'TKT-003',
    subject: 'How to edit job posting',
    status: 'resolved',
    priority: 'low',
    createdDate: '2024-01-15',
    lastUpdate: '2024-01-16',
    category: 'Projects'
  }
];

const STATUS_COLORS = {
  open: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle }
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    description: '',
    priority: 'medium'
  });

  const categories = ['all', ...new Set(MOCK_FAQS.map(faq => faq.category))];

  const filteredFAQs = MOCK_FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = () => {
    console.log('Ticket submitted:', ticketForm);
    setShowNewTicketModal(false);
    setTicketForm({ subject: '', category: 'general', description: '', priority: 'medium' });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <HelpCircle className="text-green-600" size={32} />
                Support & Help
              </h1>
              <p className="text-gray-600">Get help with your account, projects, and payments</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Plus size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Create Support Ticket</h3>
                <p className="text-gray-600 text-sm">Report an issue or ask a question</p>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Contact Us</h3>
                <p className="text-gray-600 text-sm">Email, phone, or live chat support</p>
              </button>

              <Link href="/client-dashboard/payments"
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Documentation</h3>
                <p className="text-gray-600 text-sm">View guides and tutorials</p>
              </Link>
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Support Tickets</h2>

              {MOCK_SUPPORT_TICKETS.length > 0 ? (
                <div className="space-y-4">
                  {MOCK_SUPPORT_TICKETS.map((ticket) => {
                    const StatusIcon = STATUS_COLORS[ticket.status].icon;
                    return (
                      <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${STATUS_COLORS[ticket.status].bg}`}>
                                <StatusIcon className={STATUS_COLORS[ticket.status].text} size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                                <p className="text-sm text-gray-600 mt-1">Ticket ID: {ticket.id}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status].bg} ${STATUS_COLORS[ticket.status].text} mb-2`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                              <p className="text-xs text-gray-600">Updated {new Date(ticket.lastUpdate).toLocaleDateString()}</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm whitespace-nowrap">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No support tickets yet</p>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {filteredFAQs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{faq.question}</p>
                          <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedFAQ === faq.id && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No FAQs found matching your search</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">Create Support Ticket</h2>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    >
                      <option value="general">General</option>
                      <option value="payments">Payments</option>
                      <option value="freelancers">Freelancers</option>
                      <option value="projects">Projects</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    placeholder="Provide detailed information about your issue"
                    rows="5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleTicketSubmit}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                  >
                    Submit Ticket
                  </button>
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Email</h3>
                  </div>
                  <p className="text-gray-600 text-sm">support@workdeck.com</p>
                  <p className="text-xs text-gray-500 mt-1">Response time: 24 hours</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                  </div>
                  <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Available 24/7</p>
                  <button className="text-green-600 hover:text-green-700 font-semibold text-sm mt-2">
                    Start Chat →
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
