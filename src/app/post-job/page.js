'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import { toast } from 'react-hot-toast';
import { notificationEvents } from '../../lib/notificationEvents';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, Check, Briefcase, DollarSign,
  Clock, Users, AlertCircle, X, Plus, Trash2, Loader2
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';
import api from '../../lib/api';

const SKILL_SUGGESTIONS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'TypeScript', 'Rust', 'Scala', 'Perl', 'R', 'MATLAB', 'Dart', 'Objective-C', 'Shell', 'PowerShell',

  // Web Development
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte', 'jQuery',
  'Bootstrap', 'Tailwind CSS', 'Material UI', 'Sass', 'Less', 'Webpack', 'Vite', 'Gulp',
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Laravel', 'Symfony', 'CodeIgniter',
  'Ruby on Rails', 'ASP.NET', 'Spring Boot', 'Gatsby', 'Hugo', 'Jekyll',

  // Mobile Development
  'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic', 'Cordova', 'SwiftUI',
  'Jetpack Compose', 'Kotlin Multiplatform', 'NativeScript',

  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Microsoft SQL Server',
  'MariaDB', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'CouchDB', 'Neo4j',
  'Elasticsearch', 'InfluxDB', 'TimescaleDB',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
  'CircleCI', 'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Nginx',
  'Apache', 'Linux', 'Ubuntu', 'CentOS', 'Debian',

  // Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',

  // API & Integration
  'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'SOAP', 'Microservices', 'API Gateway',
  'Postman', 'Swagger', 'OpenAPI',

  // Testing
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer', 'JUnit',
  'PyTest', 'PHPUnit', 'TestNG', 'Jasmine', 'Karma',

  // Design & Creative
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Adobe Photoshop',
  'Adobe Illustrator', 'Adobe InDesign', 'CorelDRAW', 'Canva', 'Blender', '3D Modeling',
  'After Effects', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Maya', 'Cinema 4D',
  'Procreate', 'Affinity Designer', 'Affinity Photo',

  // CMS & E-commerce
  'WordPress', 'Shopify', 'WooCommerce', 'Magento', 'Drupal', 'Joomla', 'Wix', 'Squarespace',
  'PrestaShop', 'BigCommerce', 'OpenCart', 'Contentful', 'Strapi', 'Sanity',

  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV', 'NLTK', 'SpaCy', 'Hugging Face',
  'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI', 'Looker', 'Apache Spark',
  'Hadoop', 'Jupyter', 'Google Colab', 'Computer Vision', 'NLP', 'Neural Networks',

  // Blockchain & Web3
  'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'Web3.js', 'Ethers.js',
  'Hardhat', 'Truffle', 'NFT', 'DeFi', 'Cryptocurrency', 'Bitcoin',

  // Marketing & SEO
  'Digital Marketing', 'SEO', 'SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads',
  'Instagram Marketing', 'LinkedIn Marketing', 'Email Marketing', 'Content Marketing',
  'Social Media Marketing', 'Influencer Marketing', 'Affiliate Marketing', 'Growth Hacking',
  'Marketing Automation', 'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer',

  // Writing & Content
  'Content Writing', 'Copywriting', 'Technical Writing', 'Creative Writing', 'Blog Writing',
  'Article Writing', 'Ghostwriting', 'Proofreading', 'Editing', 'Translation',
  'Transcription', 'Resume Writing', 'Grant Writing',

  // Business & Management
  'Project Management', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Trello', 'Asana', 'Monday.com',
  'Business Analysis', 'Product Management', 'Strategic Planning', 'Financial Analysis',
  'Market Research', 'Business Development', 'Sales', 'Customer Service',

  // Accounting & Finance
  'Accounting', 'Bookkeeping', 'QuickBooks', 'Xero', 'SAP', 'Financial Modeling',
  'Tax Preparation', 'Payroll', 'Budgeting', 'Forecasting', 'Excel', 'Financial Reporting',

  // Legal
  'Legal Research', 'Contract Law', 'Intellectual Property', 'Corporate Law',
  'Legal Writing', 'Compliance', 'Paralegal',

  // Video & Animation
  'Video Editing', 'Motion Graphics', '2D Animation', '3D Animation', 'Whiteboard Animation',
  'Explainer Videos', 'Video Production', 'Cinematography', 'Color Grading',

  // Audio & Music
  'Audio Editing', 'Music Production', 'Sound Design', 'Voice Over', 'Podcast Editing',
  'Mixing', 'Mastering', 'Logic Pro', 'Ableton Live', 'Pro Tools', 'FL Studio',

  // Game Development
  'Unity', 'Unreal Engine', 'Game Design', 'Game Development', 'C# for Unity',
  'Godot', 'GameMaker', 'Level Design', 'Character Design',

  // Cybersecurity
  'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security',
  'Information Security', 'CISSP', 'CEH', 'Security Auditing',

  // Networking
  'Networking', 'TCP/IP', 'DNS', 'VPN', 'Firewall', 'Load Balancing', 'CDN',
  'Cisco', 'CCNA', 'Network Administration',

  // Other Technical Skills
  'Automation', 'Scripting', 'System Administration', 'Technical Support', 'IT Support',
  'Help Desk', 'Troubleshooting', 'Documentation', 'Quality Assurance', 'Bug Tracking',
  'Performance Optimization', 'Code Review', 'Debugging',

  // Specialized
  'IoT', 'Embedded Systems', 'Arduino', 'Raspberry Pi', 'Robotics', 'AR/VR',
  'Virtual Reality', 'Augmented Reality', 'CAD', 'AutoCAD', 'SolidWorks',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
];

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design & Creative',
  'Writing & Translation', 'Marketing & Sales', 'Admin & Customer Support',
  'Data Science & Analytics', 'Engineering & Architecture', 'Legal',
  'Accounting & Finance', 'Other'
];

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'expert'];
const DURATIONS = [
  { label: 'Less than a week', value: 'less-than-week' },
  { label: '1-2 weeks', value: '1-2-weeks' },
  { label: '2-4 weeks', value: '2-4-weeks' },
  { label: '1-3 months', value: '1-3-months' },
  { label: '3-6 months', value: '3-6-months' },
  { label: 'More than 6 months', value: 'more-than-6-months' }
];

export default function PostJob() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [],
    skillInput: '',
    budgetType: 'fixed',
    budgetAmount: '',
    duration: '',
    experienceLevel: '',
    questions: [],
    questionInput: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill) => {
    const s = skill || formData.skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s], skillInput: '' }));
      setShowSkillSuggestions(false);
    }
  };

  const filteredSkillSuggestions = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(formData.skillInput.toLowerCase()) && !formData.skills.includes(s)
  );

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addQuestion = () => {
    if (formData.questionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, prev.questionInput.trim()],
        questionInput: ''
      }));
    }
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await api.post('/api/jobs', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills,
        budget: {
          type: formData.budgetType,
          amount: parseFloat(formData.budgetAmount),
          currency: 'USD'
        },
        duration: formData.duration,
        experienceLevel: formData.experienceLevel,
        screeningQuestions: formData.questions
      });

      if (response.data.success) {
        toast.success('🎉 Job posted successfully! It\'s now live for freelancers.');
        notificationEvents.refresh();
        setSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error posting job');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = formData.title && formData.category && formData.description && formData.skills.length > 0;
  const isStep2Valid = formData.budgetAmount && parseFloat(formData.budgetAmount) > 0;
  const isStep3Valid = formData.duration && formData.experienceLevel;

  const previewJob = {
    _id: '1',
    title: formData.title || 'Your Job Title',
    description: formData.description || 'Your job description will appear here...',
    skills: formData.skills,
    budget: {
      type: formData.budgetType,
      amount: parseFloat(formData.budgetAmount) || 0,
      currency: 'USD'
    },
    duration: formData.duration,
    experienceLevel: formData.experienceLevel,
    proposalCount: 0,
    createdAt: new Date(),
    client: { name: 'Your Company', rating: 0, isVerified: false },
  };

  if (submitted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <ClientHeader />
          <div className="pt-24 flex items-center justify-center px-4 py-16">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted!</h2>
              <p className="text-gray-500 mb-6">Your job is now live and freelancers can start submitting proposals.</p>
              <div className="space-y-3">
                <Link href="/client-dashboard/my-jobs" className="block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors text-center">
                  View My Jobs
                </Link>
                <Link href="/client-dashboard" className="block w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                <span className="text-sm font-semibold text-gray-500">Step {step} of 4</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form */}
              <div className="flex-1 min-w-0">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                        placeholder="e.g. Full Stack Developer for E-commerce Platform"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select name="category" value={formData.category} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="">Select category</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills *</label>
                      <div className="relative mb-3">
                        <div className="flex gap-2">
                          <input type="text" value={formData.skillInput}
                            onChange={(e) => { setFormData(prev => ({ ...prev, skillInput: e.target.value })); setShowSkillSuggestions(e.target.value.length > 0); }}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            onFocus={() => setShowSkillSuggestions(formData.skillInput.length > 0)}
                            onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 150)}
                            placeholder="Add a skill and press Enter"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                          <button onClick={() => addSkill()} className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                            Add
                          </button>
                        </div>
                        {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                            {filteredSkillSuggestions.slice(0, 8).map(skill => (
                              <div key={skill} onMouseDown={() => addSkill(skill)}
                                className="px-4 py-2 hover:bg-green-50 hover:text-green-700 cursor-pointer text-gray-700 text-sm transition-colors">
                                {skill}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-2">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-green-400 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Type *</label>
                      <div className="flex gap-3">
                        {['fixed', 'hourly'].map(type => (
                          <button key={type} onClick={() => setFormData(prev => ({ ...prev, budgetType: type }))}
                            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all capitalize ${formData.budgetType === type
                              ? 'border-green-600 bg-green-50 text-green-700'
                              : 'border-gray-200 text-gray-600 hover:border-green-300'
                              }`}>
                            {type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {formData.budgetType === 'fixed' ? 'Budget Amount ($) *' : 'Hourly Rate ($/hr) *'}
                      </label>
                      <input type="number" name="budgetAmount" value={formData.budgetAmount} onChange={handleInputChange}
                        placeholder={formData.budgetType === 'fixed' ? '5000' : '50'}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Duration *</label>
                      <select name="duration" value={formData.duration} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="">Select duration</option>
                        {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
                      <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="">Select level</option>
                        {EXPERIENCE_LEVELS.map(level => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Screening Questions (Optional)</label>
                      <div className="flex gap-2 mb-3">
                        <input type="text" value={formData.questionInput} onChange={(e) => setFormData(prev => ({ ...prev, questionInput: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                          placeholder="e.g. What's your experience with React?"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        <button onClick={addQuestion} className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.questions.map((q, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{q}</span>
                            <button onClick={() => removeQuestion(i)} className="text-gray-400 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 - Review */}
                {step === 4 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Job</h2>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Title</span>
                        <span className="font-semibold text-gray-900">{formData.title}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Category</span>
                        <span className="font-semibold text-gray-900">{formData.category}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Budget</span>
                        <span className="font-semibold text-gray-900">
                          {formData.budgetType === 'fixed' ? `$${formData.budgetAmount}` : `$${formData.budgetAmount}/hr`}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-semibold text-gray-900">{DURATIONS.find(d => d.value === formData.duration)?.label || formData.duration}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Experience Level</span>
                        <span className="font-semibold text-gray-900">{formData.experienceLevel.charAt(0).toUpperCase() + formData.experienceLevel.slice(1)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Skills Required</span>
                        <span className="font-semibold text-gray-900">{formData.skills.length} skills</span>
                      </div>

                    </div>
                    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-800">
                        ✓ Your job will be posted immediately and visible to freelancers. You can edit or close it anytime from your dashboard.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={18} /> Back
                  </button>
                  {step < 4 ? (
                    <button onClick={() => setStep(step + 1)}
                      disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Next <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                      {submitting ? <><Loader2 size={18} className="animate-spin" /> Posting...</> : <>Post Job</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Live Preview</h3>
                  <JobCard job={previewJob} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
