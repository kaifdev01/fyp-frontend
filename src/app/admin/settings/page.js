'use client';
import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import { Settings, Save, AlertCircle, CheckCircle, Mail, DollarSign, Shield, Bell, FileText, X } from 'lucide-react';

const DEFAULT_SETTINGS = {
  platformCommission: 15,
  minJobBudget: 50,
  maxJobBudget: 50000,
  escrowHoldDays: 14,
  disputeResolutionDays: 7,
  platformName: 'FreelanceHub',
  platformEmail: 'support@freelancehub.com',
  supportPhone: '+1-800-123-4567',
  enableNewUserRegistration: true,
  enableJobPosting: true,
  enableProposals: true,
  requireEmailVerification: true,
  requirePhoneVerification: false,
  autoReleaseEscrow: true,
  notifyOnNewDispute: true,
  notifyOnPaymentApproval: true,
  notifyOnJobCompletion: true,
  emailTemplateWelcome: 'Welcome to FreelanceHub! Start your freelancing journey today.',
  emailTemplateJobPosted: 'Your job has been posted successfully.',
  emailTemplatePaymentApproved: 'Your payment has been approved and will be released soon.',
  emailTemplateDisputeResolved: 'Your dispute has been resolved.'
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaveStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Settings className="text-blue-600" size={32} />
              Platform Settings
            </h1>
            <p className="text-gray-600">Configure platform settings, rates, and system preferences</p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              saveStatus === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              {saveStatus === 'success' ? (
                <>
                  <CheckCircle className="text-green-600" size={20} />
                  <p className="text-green-800 font-semibold">Settings saved successfully!</p>
                </>
              ) : (
                <>
                  <div className="animate-spin">
                    <Bell className="text-blue-600" size={20} />
                  </div>
                  <p className="text-blue-800 font-semibold">Saving settings...</p>
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 space-y-2">
                  {[
                    { id: 'general', label: 'General', icon: Settings },
                    { id: 'commission', label: 'Commission & Rates', icon: DollarSign },
                    { id: 'payment', label: 'Payment Settings', icon: Shield },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'email', label: 'Email Templates', icon: Mail }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Name</label>
                      <input
                        type="text"
                        value={settings.platformName}
                        onChange={(e) => handleSettingChange('platformName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.platformEmail}
                        onChange={(e) => handleSettingChange('platformEmail', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Support Phone</label>
                    <input
                      type="tel"
                      value={settings.supportPhone}
                      onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Toggles</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'enableNewUserRegistration', label: 'Allow New User Registration' },
                        { key: 'enableJobPosting', label: 'Allow Job Posting' },
                        { key: 'enableProposals', label: 'Allow Proposals' },
                        { key: 'requireEmailVerification', label: 'Require Email Verification' },
                        { key: 'requirePhoneVerification', label: 'Require Phone Verification' }
                      ].map(toggle => (
                        <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <label className="text-sm font-semibold text-gray-900">{toggle.label}</label>
                          <input
                            type="checkbox"
                            checked={settings[toggle.key]}
                            onChange={(e) => handleSettingChange(toggle.key, e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Commission & Rates */}
              {activeTab === 'commission' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission & Rates</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Note:</span> Commission is deducted from freelancer earnings. Adjust rates carefully as they affect platform revenue.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Commission (%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.platformCommission}
                        onChange={(e) => handleSettingChange('platformCommission', parseFloat(e.target.value))}
                        className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <span className="text-gray-600">Current: {settings.platformCommission}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Example: On a $100 job, platform earns ${(100 * settings.platformCommission / 100).toFixed(2)}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Job Budget Limits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Minimum Job Budget ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={settings.minJobBudget}
                          onChange={(e) => handleSettingChange('minJobBudget', parseFloat(e.target.value))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Maximum Job Budget ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={settings.maxJobBudget}
                          onChange={(e) => handleSettingChange('maxJobBudget', parseFloat(e.target.value))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Settings</h2>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-900">
                      <span className="font-semibold">Important:</span> These settings control escrow and payment release behavior.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Escrow Hold Period (Days)</label>
                      <input
                        type="number"
                        min="1"
                        value={settings.escrowHoldDays}
                        onChange={(e) => handleSettingChange('escrowHoldDays', parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">How long payments are held in escrow after approval</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Dispute Resolution Period (Days)</label>
                      <input
                        type="number"
                        min="1"
                        value={settings.disputeResolutionDays}
                        onChange={(e) => handleSettingChange('disputeResolutionDays', parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Time allowed to resolve disputes</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Escrow Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-semibold text-gray-900">Auto-Release Escrow After Hold Period</label>
                        <input
                          type="checkbox"
                          checked={settings.autoReleaseEscrow}
                          onChange={(e) => handleSettingChange('autoReleaseEscrow', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'notifyOnNewDispute', label: 'Notify on New Dispute', description: 'Send notification when a new dispute is created' },
                      { key: 'notifyOnPaymentApproval', label: 'Notify on Payment Approval', description: 'Send notification when payment is approved' },
                      { key: 'notifyOnJobCompletion', label: 'Notify on Job Completion', description: 'Send notification when job is completed' }
                    ].map(notif => (
                      <div key={notif.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{notif.label}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings[notif.key]}
                            onChange={(e) => handleSettingChange(notif.key, e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer flex-shrink-0 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Templates */}
              {activeTab === 'email' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Templates</h2>

                  <div className="space-y-6">
                    {[
                      { key: 'emailTemplateWelcome', label: 'Welcome Email', description: 'Sent to new users upon registration' },
                      { key: 'emailTemplateJobPosted', label: 'Job Posted Email', description: 'Sent when a job is successfully posted' },
                      { key: 'emailTemplatePaymentApproved', label: 'Payment Approved Email', description: 'Sent when payment is approved' },
                      { key: 'emailTemplateDisputeResolved', label: 'Dispute Resolved Email', description: 'Sent when dispute is resolved' }
                    ].map(template => (
                      <div key={template.key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{template.label}</p>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </div>
                          <button
                            onClick={() => setEditingTemplate(editingTemplate === template.key ? null : template.key)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            {editingTemplate === template.key ? 'Done' : 'Edit'}
                          </button>
                        </div>

                        {editingTemplate === template.key ? (
                          <textarea
                            value={settings[template.key]}
                            onChange={(e) => handleSettingChange(template.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                            rows="4"
                          />
                        ) : (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{settings[template.key]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Settings
                </button>
                <button
                  onClick={handleResetSettings}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
