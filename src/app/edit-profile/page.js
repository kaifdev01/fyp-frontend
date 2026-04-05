'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import { uploadImageToCloudinary } from '../../lib/cloudinary';
import toast, { Toaster } from 'react-hot-toast';
import {
  Save, Upload, X, Plus, MapPin, DollarSign, Phone, User, FileText,
  Star, ArrowLeft, ExternalLink, Camera, Loader2, Award
} from 'lucide-react';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    intro: '',
    bio: '',
    location: '',
    hourlyRate: '',
    phone: '',
    skills: [],
    languages: [],
    education: [],
    isAvailable: true,
    portfolio: [],
    avatar: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'Conversational' });
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: ''
  });
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    url: '',
    media: []
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [languageSuggestions, setLanguageSuggestions] = useState([]);

  // Popular skills suggestions
  const popularSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular',
    'PHP', 'Laravel', 'WordPress', 'Shopify', 'Java', 'C#', '.NET', 'Ruby', 'Rails',
    'UI/UX Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'InVision',
    'Digital Marketing', 'SEO', 'Content Writing', 'Copywriting', 'Social Media Marketing'
  ];

  // Popular languages
  const popularLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish'
  ];

  // Calculate profile completion
  const calculateCompletion = (data) => {
    const requiredFields = [
      data.name,
      data.email,
      data.bio,
      data.location,
      data.hourlyRate && data.hourlyRate > 0,
      data.phone,
      data.avatar,
      data.skills?.length > 0,
      data.languages?.length > 0,
    ];

    const mandatoryFields = [
      data.education?.length > 0,
      data.portfolio?.length > 0,
    ];

    const requiredCompleted = requiredFields.filter(Boolean).length;
    const mandatoryCompleted = mandatoryFields.filter(Boolean).length;

    if (mandatoryCompleted < mandatoryFields.length) {
      const maxWithoutMandatory = 85;
      return Math.min(Math.round((requiredCompleted / requiredFields.length) * maxWithoutMandatory), maxWithoutMandatory);
    }

    const allFields = [...requiredFields, ...mandatoryFields];
    const allCompleted = allFields.filter(Boolean).length;
    return Math.round((allCompleted / allFields.length) * 100);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      // Try Cloudinary first
      let imageUrl;
      try {
        const result = await uploadImageToCloudinary(file);
        imageUrl = result.url;
        console.log('Cloudinary upload successful:', result);
      } catch (cloudinaryError) {
        console.log('Cloudinary failed, using base64:', cloudinaryError);
        // Fallback to base64
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      }

      setFormData(prev => ({ ...prev, avatar: imageUrl }));

      // Update localStorage immediately
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, avatar: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch from API instead of localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await api.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const user = response.data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          intro: user.intro || '',
          bio: user.bio || '',
          location: user.location || '',
          hourlyRate: user.hourlyRate || '',
          phone: user.phone || '',
          skills: user.skills || [],
          languages: user.languages || [],
          education: user.education || [],
          isAvailable: user.isAvailable !== undefined ? user.isAvailable : true,
          portfolio: user.portfolio || [],
          avatar: user.avatar || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to localStorage if API fails
        const userData = localStorage.getItem('user');
        if (userData && userData !== 'undefined') {
          try {
            const user = JSON.parse(userData);
            setFormData({
              name: user.name || '',
              email: user.email || '',
              intro: user.intro || '',
              bio: user.bio || '',
              location: user.location || '',
              hourlyRate: user.hourlyRate || '',
              phone: user.phone || '',
              skills: user.skills || [],
              languages: user.languages || [],
              education: user.education || [],
              isAvailable: user.isAvailable !== undefined ? user.isAvailable : true,
              portfolio: user.portfolio || [],
              avatar: user.avatar || ''
            });
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
          }
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Update completion when formData changes
  useEffect(() => {
    const completion = calculateCompletion(formData);
    setProfileCompletion(completion);

    const incomplete = [];
    if (!formData.bio) incomplete.push('Bio');
    if (!formData.location) incomplete.push('Location');
    if (!formData.hourlyRate || formData.hourlyRate <= 0) incomplete.push('Hourly Rate');
    if (!formData.phone) incomplete.push('Phone');
    if (!formData.avatar) incomplete.push('Profile Picture');
    if (!formData.skills?.length) incomplete.push('Skills');
    if (!formData.languages?.length) incomplete.push('Languages');
    if (!formData.education?.length) incomplete.push('Education (Required for 100%)');
    if (!formData.portfolio?.length) incomplete.push('Portfolio (Required for 100%)');
    setIncompleteFields(incomplete);
  }, [formData]);

  // Handle form input changes without validation toasts
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle skill input with suggestions
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);

    if (value.length > 0) {
      const filtered = popularSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
      ).slice(0, 5);
      setSkillSuggestions(filtered);
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
    }
  };

  // Handle language input with suggestions
  const handleLanguageInputChange = (e) => {
    const value = e.target.value;
    setNewLanguage(prev => ({ ...prev, language: value }));

    if (value.length > 0) {
      const filtered = popularLanguages.filter(lang =>
        lang.toLowerCase().includes(value.toLowerCase()) &&
        !formData.languages.find(l => l.language === lang)
      ).slice(0, 5);
      setLanguageSuggestions(filtered);
      setShowLanguageSuggestions(true);
    } else {
      setShowLanguageSuggestions(false);
    }
  };

  // Add skill
  const addSkill = (skill = null) => {
    const skillToAdd = skill || newSkill.trim();
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillToAdd]
      }));
      setNewSkill('');
      setShowSkillSuggestions(false);
    }
  };

  // Add language
  const addLanguage = (language = null) => {
    const langToAdd = language || newLanguage.language.trim();
    if (langToAdd && !formData.languages.find(lang => lang.language === langToAdd)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, { language: langToAdd, proficiency: newLanguage.proficiency }]
      }));
      setNewLanguage({ language: '', proficiency: 'Conversational' });
      setShowLanguageSuggestions(false);
    }
  };

  // Add education
  const addEducation = () => {
    if (newEducation.school.trim() && newEducation.degree.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...(prev.education || []), { ...newEducation, id: Date.now() }]
      }));
      setNewEducation({ school: '', degree: '', field: '', startYear: '', endYear: '', description: '' });
    }
  };

  // Remove education
  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Add portfolio item
  const addPortfolioItem = () => {
    if (newPortfolio.title.trim()) {
      // Create portfolio item without the temporary id field
      const portfolioItem = {
        title: newPortfolio.title,
        description: newPortfolio.description,
        url: newPortfolio.url,
        media: newPortfolio.media || [],
        // Keep image field for backward compatibility
        image: newPortfolio.media && newPortfolio.media.length > 0 ? newPortfolio.media[0].url : ''
      };

      setFormData(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), portfolioItem]
      }));
      setNewPortfolio({ title: '', description: '', url: '', media: [] });
    }
  };

  // Remove portfolio item
  const removePortfolioItem = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  // Handle portfolio input changes
  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate URL if it's the url field
    if (name === 'url' && value.trim()) {
      try {
        new URL(value);
        // Valid URL - could show success indicator
      } catch {
        // Invalid URL - could show error indicator
        if (value.length > 5) { // Only show error for substantial input
          toast.error('Please enter a valid URL (e.g., https://example.com)', { duration: 2000 });
        }
      }
    }
  };

  // Handle portfolio media upload
  const handlePortfolioMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const uploadedMedia = [];
    let uploadCount = 0;
    const totalFiles = files.length;

    // Show initial upload toast
    const uploadToast = toast.loading(`Uploading ${totalFiles} file(s)...`);

    for (const file of files) {
      uploadCount++;

      // Update progress
      toast.loading(`Uploading ${file.name} (${uploadCount}/${totalFiles})...`, { id: uploadToast });

      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid image or video file`);
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        continue;
      }

      try {
        // Try Cloudinary upload first
        let mediaUrl;
        try {
          const result = await uploadImageToCloudinary(file);
          mediaUrl = result.url;
          toast.success(`${file.name} uploaded to cloud`, { duration: 2000 });
        } catch (cloudinaryError) {
          // Fallback to base64
          mediaUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
          toast.success(`${file.name} uploaded locally`, { duration: 2000 });
        }

        uploadedMedia.push({
          url: mediaUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    // Dismiss loading toast
    toast.dismiss(uploadToast);

    if (uploadedMedia.length > 0) {
      setNewPortfolio(prev => ({
        ...prev,
        media: [...(prev.media || []), ...uploadedMedia]
      }));
      toast.success(`${uploadedMedia.length} of ${totalFiles} file(s) uploaded successfully!`);
    } else {
      toast.error('No files were uploaded successfully');
    }
  };

  // Handle portfolio URL input with validation
  const handlePortfolioUrlChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate URL if it's the url field
    if (name === 'url' && value.trim()) {
      try {
        new URL(value);
        // Valid URL - could show success indicator
      } catch {
        // Invalid URL - could show error indicator
        if (value.length > 5) { // Only show error for substantial input
          toast.error('Please enter a valid URL (e.g., https://example.com)', { duration: 2000 });
        }
      }
    }
  };

  // Remove portfolio media
  const removePortfolioMedia = (index) => {
    setNewPortfolio(prev => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index) || []
    }));
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Remove language
  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate intro field (minimum 3 words)
    const introWordCount = formData.intro.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (formData.intro.trim() && introWordCount < 3) {
      toast.error('Intro must be at least 3 words');
      return;
    }

    // Validate bio field (50-1500 characters)
    const bioCharCount = formData.bio.trim().length;
    if (formData.bio.trim() && (bioCharCount < 50 || bioCharCount > 1500)) {
      if (bioCharCount < 50) {
        toast.error('Bio must be at least 50 characters');
      } else {
        toast.error('Bio cannot exceed 1500 characters');
      }
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        router.push('/login');
        return;
      }

      // Call API to update profile
      console.log('Sending portfolio data:', JSON.stringify(formData.portfolio, null, 2));

      const response = await api.put('/api/users/profile', {
        intro: formData.intro,
        bio: formData.bio,
        location: formData.location,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        phone: formData.phone,
        skills: formData.skills,
        languages: formData.languages,
        education: formData.education,
        portfolio: formData.portfolio,
        isAvailable: formData.isAvailable,
        avatar: formData.avatar
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update localStorage with fresh data from server
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Profile updated successfully!');
        setTimeout(() => {
          router.push('/freelancer-dashboard');
        }, 1500);
      }

    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <FreelancerHeader />
        <Toaster position="top-right" />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                    <p className="text-gray-600">Update your professional information</p>
                  </div>

                  {/* Profile Completion */}
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">Profile Completion</div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{profileCompletion}%</span>
                    </div>
                    {incompleteFields.length > 0 && (
                      <div className="mt-2 text-xs text-amber-600">
                        Missing: {incompleteFields.slice(0, 2).join(', ')}
                        {incompleteFields.length > 2 && ` +${incompleteFields.length - 2} more`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Profile Picture & Basic Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <User className="text-blue-600" size={24} />
                  Profile Information
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-xl">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-white" />
                        )}
                      </div>

                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                        {uploadingImage ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Camera size={16} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Click camera to upload<br />Max 5MB, JPG/PNG
                    </p>
                  </div>

                  {/* Basic Information */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <Phone size={16} className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <MapPin size={16} className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="New York, NY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <Star className="text-blue-600" size={24} />
                  Professional Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Star size={16} className="inline mr-2" />
                      Professional Intro (minimum 3 words)
                    </label>
                    <input
                      type="text"
                      name="intro"
                      value={formData.intro}
                      onChange={handleInputChange}
                      placeholder="Experienced web developer creating amazing digital solutions"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {formData.intro.trim().split(/\s+/).filter(word => word.length > 0).length} words (minimum 3 required)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <FileText size={16} className="inline mr-2" />
                      Professional Bio (50-1500 characters)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Tell clients about your experience, skills, and what makes you unique. Describe your background, expertise, and the value you bring to projects..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {formData.bio.trim().length} characters (50-1500 required)
                      </p>
                      <div className="w-24 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{
                            width: `${Math.min((formData.bio.trim().length / 1500) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <DollarSign size={16} className="inline mr-2" />
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="50"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Skills & Expertise</h2>

                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={handleSkillInputChange}
                        placeholder="Add a skill (e.g., React, Design, Marketing)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                      />

                      {/* Skill Suggestions Dropdown */}
                      {showSkillSuggestions && skillSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mt-1 max-h-40 overflow-y-auto">
                          {skillSuggestions.map((skill, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addSkill(skill)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addSkill()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>

                  {/* Popular Skills */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSkills.slice(0, 10).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            if (!formData.skills.includes(skill)) {
                              setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                            }
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          disabled={formData.skills.includes(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Your Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Languages</h2>

                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newLanguage.language}
                        onChange={handleLanguageInputChange}
                        placeholder="Language (e.g., English, Spanish)"
                        className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
                      />

                      {/* Language Suggestions Dropdown */}
                      {showLanguageSuggestions && languageSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mt-1 max-h-40 overflow-y-auto">
                          {languageSuggestions.map((language, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addLanguage(language)}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm"
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <select
                      value={newLanguage.proficiency}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => addLanguage()}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>

                  {formData.languages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Your Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-md"
                          >
                            {lang.language} ({lang.proficiency})
                            <button
                              type="button"
                              onClick={() => removeLanguage(index)}
                              className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>



              {/* Education */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <Award className="text-purple-600" size={24} />
                  Education
                </h2>

                <div className="space-y-6">
                  {/* Add Education Form */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus size={16} className="text-purple-600" />
                      Add Education
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newEducation.school}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                        placeholder="School/University Name"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                      <input
                        type="text"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="Degree (e.g., Bachelor's, Master's)"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                      <input
                        type="text"
                        value={newEducation.field}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                        placeholder="Field of Study (e.g., Computer Science)"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newEducation.startYear}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, startYear: e.target.value }))}
                          placeholder="Start Year"
                          min="1950"
                          max="2030"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                        <input
                          type="number"
                          value={newEducation.endYear}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, endYear: e.target.value }))}
                          placeholder="End Year"
                          min="1950"
                          max="2030"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold"
                    >
                      <Plus size={16} />
                      Add Education
                    </button>
                  </div>

                  {/* Education List */}
                  {formData.education && formData.education.length > 0 && (
                    <div className="space-y-4">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                            <p className="text-purple-600">{edu.school}</p>
                            {edu.field && <p className="text-gray-600">{edu.field}</p>}
                            {(edu.startYear || edu.endYear) && (
                              <p className="text-gray-500 text-sm">
                                {edu.startYear} - {edu.endYear || 'Present'}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <ExternalLink className="text-indigo-600" size={24} />
                  Portfolio
                </h2>

                <div className="space-y-6">
                  {/* Add Portfolio Form */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="title"
                        value={newPortfolio.title}
                        onChange={handlePortfolioChange}
                        placeholder="Project Title"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                      <input
                        type="url"
                        name="url"
                        value={newPortfolio.url}
                        onChange={handlePortfolioChange}
                        placeholder="Project URL (e.g., https://example.com)"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="mt-4">
                      <textarea
                        name="description"
                        value={newPortfolio.description}
                        onChange={handlePortfolioChange}
                        placeholder="Project Description"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>

                    {/* Media Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images/Videos
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">Images and videos up to 10MB</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handlePortfolioMediaUpload}
                          className="hidden"
                          id="portfolio-media"
                        />
                        <label
                          htmlFor="portfolio-media"
                          className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                        >
                          Choose Files
                        </label>
                      </div>

                      {/* Media Preview */}
                      {newPortfolio.media && newPortfolio.media.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Media:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {newPortfolio.media.map((media, index) => (
                              <div key={index} className="relative group">
                                {media.type === 'image' ? (
                                  <img
                                    src={media.url}
                                    alt={media.name}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                ) : (
                                  <video
                                    src={media.url}
                                    className="w-full h-20 object-cover rounded-lg"
                                    controls={false}
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removePortfolioMedia(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addPortfolioItem}
                      className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Project
                    </button>
                  </div>

                  {/* Portfolio Items */}
                  {formData.portfolio && formData.portfolio.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.portfolio.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                            <button
                              type="button"
                              onClick={() => removePortfolioItem(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          {/* Project Media */}
                          {item.media && item.media.length > 0 && (
                            <div className="mb-3">
                              <div className="grid grid-cols-2 gap-2">
                                {item.media.slice(0, 4).map((media, mediaIndex) => (
                                  <div key={mediaIndex} className="relative">
                                    {media.type === 'image' ? (
                                      <img
                                        src={media.url}
                                        alt={media.name}
                                        className="w-full h-24 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <video
                                        src={media.url}
                                        className="w-full h-24 object-cover rounded-lg"
                                        controls
                                      />
                                    )}
                                  </div>
                                ))}
                                {item.media.length > 4 && (
                                  <div className="flex items-center justify-center bg-gray-100 rounded-lg h-24">
                                    <span className="text-sm text-gray-500">+{item.media.length - 4} more</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {item.description && (
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm flex items-center gap-1">
                              View Project <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Availability */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Availability Status</h2>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isAvailable" className="text-lg font-medium text-gray-700">
                    I am currently available for new projects
                  </label>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${formData.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {formData.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}