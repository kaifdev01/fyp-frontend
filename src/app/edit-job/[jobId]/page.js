'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import RichTextEditor from '../../../components/RichTextEditor';
import { toast } from 'react-hot-toast';
import { ChevronLeft, Loader2, X } from 'lucide-react';
import api from '../../../lib/api';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design & Creative',
  'Writing & Translation', 'Marketing & Sales', 'Admin & Customer Support',
  'Data Science & Analytics', 'Engineering & Architecture', 'Legal',
  'Accounting & Finance', 'Other'
];

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

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'expert'];
const DURATIONS = [
  { label: 'Less than a week', value: 'less-than-week' },
  { label: '1-2 weeks', value: '1-2-weeks' },
  { label: '2-4 weeks', value: '2-4-weeks' },
  { label: '1-3 months', value: '1-3-months' },
  { label: '3-6 months', value: '3-6-months' },
  { label: 'More than 6 months', value: 'more-than-6-months' }
];

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    status: 'open'
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      const job = response.data.job;
      setFormData({
        title: job.title,
        category: job.category,
        description: job.description,
        skills: job.skills || [],
        skillInput: '',
        budgetType: job.budget.type,
        budgetAmount: job.budget.amount.toString(),
        duration: job.duration,
        experienceLevel: job.experienceLevel,
        status: job.status
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch job');
      router.push('/client-dashboard/my-jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill) => {
    const s = skill || formData.skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, s],
        skillInput: ''
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
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
      status: formData.status
    };

    console.log('📤 Sending update payload:', payload);

    try {
      const response = await api.put(`/api/jobs/${jobId}`, payload);
      if (response.data.success) {
        toast.success('Job updated successfully!');
        router.push('/client-dashboard/my-jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <ClientHeader />
          <div className="pt-24 pb-16 px-4 flex items-center justify-center">
            <Loader2 className="animate-spin text-green-600" size={48} />
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
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
              <p className="text-gray-600">Update your job details</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills *</label>
                <div className="relative mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.skillInput}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, skillInput: e.target.value }));
                        setShowSkillSuggestions(e.target.value.length > 0);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      onFocus={() => setShowSkillSuggestions(formData.skillInput.length > 0)}
                      onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 150)}
                      placeholder="Add a skill and press Enter"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill()}
                      className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                      {filteredSkillSuggestions.slice(0, 8).map(skill => (
                        <div
                          key={skill}
                          onMouseDown={() => addSkill(skill)}
                          className="px-4 py-2 hover:bg-green-50 hover:text-green-700 cursor-pointer text-gray-700 text-sm transition-colors"
                        >
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
                      <button type="button" onClick={() => removeSkill(skill)} className="text-green-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Type *</label>
                <div className="flex gap-3">
                  {['fixed', 'hourly'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, budgetType: type }))}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all capitalize ${formData.budgetType === type
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-600 hover:border-green-300'
                        }`}
                    >
                      {type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.budgetType === 'fixed' ? 'Budget Amount ($) *' : 'Hourly Rate ($/hr) *'}
                </label>
                <input
                  type="number"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white"
                >
                  <option value="">Select duration</option>
                  {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white"
                >
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : 'Update Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
