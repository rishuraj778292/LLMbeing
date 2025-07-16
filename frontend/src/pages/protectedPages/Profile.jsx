import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  addExperience,
  addEducation,
  addCertification,
  addPortfolioItem,
  addLanguage,
  sendEmailVerification,
  sendPhoneVerification,
  getProfileCompletion,
  clearActionSuccess
} from '../../../Redux/Slice/profileSlice';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Award,
  Briefcase,
  Clock,
  DollarSign,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Trash2,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Plus,
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState('');
  const [formData, setFormData] = useState({});
  const [projectCategory, setProjectCategory] = useState('all'); // For project filtering

  const { isAuthenticated } = useSelector(state => state.auth);
  const {
    profile,
    profileCompletion,
    actionSuccess
  } = useSelector(state => state.profile);
  const dispatch = useDispatch();

  // Load profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
      dispatch(getProfileCompletion());
    }
  }, [dispatch, isAuthenticated]);

  // Handle successful actions
  useEffect(() => {
    if (actionSuccess) {
      setIsEditModalOpen(false);
      setFormData({});
      setEditSection('');
      // Show success notification if needed
      setTimeout(() => {
        dispatch(clearActionSuccess());
      }, 3000);
    }
  }, [actionSuccess, dispatch]);

  // Handler functions for various actions
  const handleEditProfile = () => {
    setEditSection('profile');
    setFormData({
      fullName: userData?.fullName || '',
      professionalTitle: userData?.professionalTitle || '',
      website: userData?.website || '',
      phone: userData?.phone || '',
      country: userData?.country || '',
      city: userData?.city || '',
      bio: userData?.bio || '',
      hourlyRate: userData?.hourlyRate || '',
      github: userData?.github || '',
      linkedin: userData?.linkedin || '',
      twitter: userData?.twitter || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditAbout = () => {
    setEditSection('about');
    setFormData({
      bio: userData?.bio || ''
    });
    setIsEditModalOpen(true);
  };

  const handleAddSkills = () => {
    setEditSection('skills');
    setFormData({
      skills: userData?.skills ? userData.skills.join(', ') : ''
    });
    setIsEditModalOpen(true);
  };

  const handleAddLanguages = () => {
    setEditSection('languages');
    setFormData({});
    setIsEditModalOpen(true);
  };

  const handleAddCertifications = () => {
    setEditSection('certifications');
    setFormData({});
    setIsEditModalOpen(true);
  };

  const handleAddProject = () => {
    setEditSection('portfolio');
    setFormData({});
    setIsEditModalOpen(true);
  };

  const handleAddExperience = () => {
    setEditSection('experience');
    setFormData({});
    setIsEditModalOpen(true);
  };

  const handleAddEducation = () => {
    setEditSection('education');
    setFormData({});
    setIsEditModalOpen(true);
  };

  const handlePostProject = () => {
    // Navigate to post project page
    console.log('Post project clicked');
    // In a real app: navigate('/post-project')
  };

  const handleVerifyEmail = async () => {
    try {
      await dispatch(sendEmailVerification()).unwrap();
    } catch (error) {
      console.error('Email verification failed:', error);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await dispatch(sendPhoneVerification()).unwrap();
    } catch (error) {
      console.error('Phone verification failed:', error);
    }
  };

  const handleAddPhone = () => {
    setEditSection('phone');
    setFormData({
      phone: userData?.phone || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUploadProfilePicture = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await dispatch(uploadProfilePicture(file)).unwrap();
        } catch (error) {
          console.error('Profile picture upload failed:', error);
        }
      }
    };
    input.click();
  };

  const handleSaveModal = async () => {
    try {
      switch (editSection) {
        case 'profile':
          await dispatch(updateProfile(formData)).unwrap();
          break;
        case 'about':
          await dispatch(updateProfile({ bio: formData.bio })).unwrap();
          break;
        case 'skills': {
          const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
          await dispatch(updateProfile({ skills: skillsArray })).unwrap();
          break;
        }
        case 'phone':
          await dispatch(updateProfile({ phone: formData.phone })).unwrap();
          break;
        case 'languages':
          await dispatch(addLanguage(formData)).unwrap();
          break;
        case 'certifications':
          await dispatch(addCertification(formData)).unwrap();
          break;
        case 'portfolio': {
          const projectData = {
            ...formData,
            technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
          };
          await dispatch(addPortfolioItem(projectData)).unwrap();
          break;
        }
        case 'experience':
          await dispatch(addExperience(formData)).unwrap();
          break;
        case 'education':
          await dispatch(addEducation(formData)).unwrap();
          break;
        default:
          console.log(`Saving ${editSection} changes...`);
      }

      // Close modal and reset form on success
      setIsEditModalOpen(false);
      setFormData({});
      setEditSection('');

      // Refresh profile data
      dispatch(getProfile());
    } catch (error) {
      console.error('Save failed:', error);
      // Don't close modal on error so user can retry
    }
  };

  // Use profile completion from Redux store
  // Enhanced user data with real user integration from Redux store
  const userData = profile ? {
    // Basic Info - from real user data
    name: profile?.fullName || '',
    userName: profile?.userName || '',
    email: profile?.email || '',
    role: profile?.role || 'freelancer',
    avatar: profile?.profileImage || null,

    // Contact & Location
    phone: profile?.phone || null,
    country: profile?.country || null,
    city: profile?.city || null,

    // Professional Info
    title: profile?.professionalTitle || (profile?.role === 'freelancer' ? 'Freelancer' : 'Client'),
    bio: profile?.bio || null,
    skills: profile?.skills || [],
    hourlyRate: profile?.hourlyRate || null,

    // Social Links
    website: profile?.website || null,
    github: profile?.github || null,
    linkedin: profile?.linkedin || null,
    twitter: profile?.twitter || null,

    // Stats - These would come from backend in real implementation
    joinDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }) : 'Recently joined',
    rating: profile?.averageRating || null,
    totalReviews: profile?.totalReviews || profile?.reviewCount || 0,
    totalEarnings: profile?.totalEarnings || null,
    completedProjects: profile?.completedProjects || 0,
    successRate: profile?.successRate || null,

    // Additional Info
    languages: profile?.languages || [],
    certifications: profile?.certifications || [],
    experience: profile?.experience || [],
    education: profile?.education || [],
    portfolio: profile?.portfolio || [],

    // Verification status
    isEmailVerified: profile?.isEmailVerified || false,
    isPhoneVerified: profile?.isPhoneVerified || false,
    isProfileVerified: profile?.isProfileVerified || false,
  } : null;

  // Helper component for missing data indicator
  const MissingDataBadge = ({ text = "Not added yet" }) => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
      <AlertCircle className="w-3 h-3 mr-1" />
      {text}
    </div>
  );

  // Helper component for verified badge
  const VerifiedBadge = () => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
      <CheckCircle className="w-3 h-3 mr-1" />
      Verified
    </div>
  );

  // Simple Modal Component with form handling
  const EditModal = () => {
    if (!isEditModalOpen) return null;

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Prevent re-rendering issues by memoizing input components
    const InputField = ({ type = "text", placeholder, field, value, className = "", ...props }) => (
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${className}`}
        {...props}
      />
    );

    const TextAreaField = ({ placeholder, field, value, rows = 4, ...props }) => (
      <textarea
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        rows={rows}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
        {...props}
      />
    );

    const SelectField = ({ field, value, children, ...props }) => (
      <select
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        {...props}
      >
        {children}
      </select>
    );

    const getModalContent = () => {
      switch (editSection) {
        case 'profile':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Full Name"
                  field="fullName"
                  value={formData.fullName}
                />
                <InputField
                  placeholder="Professional Title"
                  field="professionalTitle"
                  value={formData.professionalTitle}
                />
                <InputField
                  placeholder="Phone Number"
                  field="phone"
                  value={formData.phone}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    placeholder="Country"
                    field="country"
                    value={formData.country}
                  />
                  <InputField
                    placeholder="City"
                    field="city"
                    value={formData.city}
                  />
                </div>
                <InputField
                  type="url"
                  placeholder="Website URL"
                  field="website"
                  value={formData.website}
                />
                <InputField
                  type="number"
                  placeholder="Hourly Rate (USD)"
                  field="hourlyRate"
                  value={formData.hourlyRate}
                />
                <InputField
                  type="url"
                  placeholder="GitHub URL"
                  field="github"
                  value={formData.github}
                />
                <InputField
                  type="url"
                  placeholder="LinkedIn URL"
                  field="linkedin"
                  value={formData.linkedin}
                />
              </div>
            </div>
          );
        case 'about':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Edit About</h3>
              <TextAreaField
                placeholder="Tell potential clients about yourself, your experience, and what makes you unique..."
                field="bio"
                value={formData.bio}
                rows={6}
              />
            </div>
          );
        case 'skills':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Skills</h3>
              <InputField
                placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                field="skills"
                value={formData.skills}
              />
              <p className="text-sm text-slate-500">Add skills that showcase your expertise and help clients find you.</p>
            </div>
          );
        case 'languages':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Language</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Language (e.g., English, Spanish)"
                  field="name"
                  value={formData.name}
                />
                <SelectField
                  field="level"
                  value={formData.level}
                >
                  <option value="">Select proficiency level</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Basic">Basic</option>
                </SelectField>
              </div>
            </div>
          );
        case 'certifications':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Certification</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Certification Name"
                  field="name"
                  value={formData.name}
                />
                <InputField
                  placeholder="Issuing Organization"
                  field="issuer"
                  value={formData.issuer}
                />
                <InputField
                  type="number"
                  placeholder="Year Obtained"
                  field="year"
                  value={formData.year}
                />
                <InputField
                  placeholder="Credential ID (Optional)"
                  field="credentialId"
                  value={formData.credentialId}
                />
                <InputField
                  type="url"
                  placeholder="Credential URL (Optional)"
                  field="credentialUrl"
                  value={formData.credentialUrl}
                />
              </div>
            </div>
          );
        case 'phone':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Phone Number</h3>
              <InputField
                type="tel"
                placeholder="Enter your phone number"
                field="phone"
                value={formData.phone}
              />
              <p className="text-sm text-slate-500">Adding a phone number helps build trust with clients.</p>
            </div>
          );
        case 'portfolio':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Project</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Project Title"
                  field="title"
                  value={formData.title}
                />
                <TextAreaField
                  placeholder="Project Description"
                  field="description"
                  value={formData.description}
                  rows={4}
                />
                <InputField
                  placeholder="Technologies Used (comma separated)"
                  field="technologies"
                  value={formData.technologies}
                />
                <InputField
                  type="url"
                  placeholder="Project URL (optional)"
                  field="projectUrl"
                  value={formData.projectUrl}
                />
                <InputField
                  type="url"
                  placeholder="GitHub Repository (optional)"
                  field="githubUrl"
                  value={formData.githubUrl}
                />
                <SelectField
                  field="category"
                  value={formData.category || 'Personal Project'}
                >
                  <option value="Personal Project">Personal Project</option>
                  <option value="Client Project">Client Project</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Freelance Work">Freelance Work</option>
                </SelectField>
              </div>
            </div>
          );
        case 'experience':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Work Experience</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Job Title"
                  field="jobTitle"
                  value={formData.jobTitle}
                />
                <InputField
                  placeholder="Company Name"
                  field="company"
                  value={formData.company}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    type="date"
                    placeholder="Start Date"
                    field="startDate"
                    value={formData.startDate}
                  />
                  <InputField
                    type="date"
                    placeholder="End Date"
                    field="endDate"
                    value={formData.endDate}
                    disabled={formData.current}
                    className={formData.current ? "disabled:bg-gray-100" : ""}
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.current || false}
                    onChange={(e) => handleInputChange('current', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
                <TextAreaField
                  placeholder="Job Description and Achievements"
                  field="description"
                  value={formData.description}
                  rows={4}
                />
              </div>
            </div>
          );
        case 'education':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Education</h3>
              <div className="space-y-3">
                <InputField
                  placeholder="Degree/Qualification"
                  field="degree"
                  value={formData.degree}
                />
                <InputField
                  placeholder="Institution Name"
                  field="institution"
                  value={formData.institution}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    type="number"
                    placeholder="Start Year"
                    field="startYear"
                    value={formData.startYear}
                  />
                  <InputField
                    type="number"
                    placeholder="End Year"
                    field="endYear"
                    value={formData.endYear}
                  />
                </div>
                <InputField
                  placeholder="Grade/GPA (optional)"
                  field="grade"
                  value={formData.grade}
                />
              </div>
            </div>
          );
        default:
          return <p>Edit functionality coming soon...</p>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {getModalContent()}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects & Portfolio' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const StatCard = (props) => {
    const { icon: Icon, label, value, subtext, isEmpty = false } = props;
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${isEmpty ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
            <Icon className={`w-6 h-6 ${isEmpty ? 'text-slate-400' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1">
            {isEmpty ? (
              <div className="space-y-1">
                <p className="text-sm text-slate-500">{label}</p>
                <MissingDataBadge />
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-600">{label}</p>
                {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Calculate profile completion safely
  const profileCompletionPercentage = profileCompletion?.completionPercentage || 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Profile Completion Banner */}
            {profileCompletionPercentage < 100 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Complete Your Profile</h3>
                    <p className="text-blue-700">Complete your profile to attract more clients and opportunities</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">{profileCompletionPercentage}%</div>
                    <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${profileCompletionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Star}
                label="Average Rating"
                value={userData.rating || 'New'}
                subtext={userData.totalReviews > 0 ? `${userData.totalReviews} reviews` : 'No reviews yet'}
                isEmpty={!userData.rating}
              />
              <StatCard
                icon={Briefcase}
                label="Projects Completed"
                value={userData.completedProjects || 0}
                subtext={userData.successRate ? `${userData.successRate}% success rate` : 'Build your reputation'}
                isEmpty={userData.completedProjects === 0}
              />
              <StatCard
                icon={DollarSign}
                label="Total Earnings"
                value={userData.totalEarnings ? `$${userData.totalEarnings.toLocaleString()}` : '$0'}
                subtext={userData.role === 'freelancer' ? 'Lifetime earnings' : 'Total spent'}
                isEmpty={!userData.totalEarnings}
              />
              <StatCard
                icon={Clock}
                label="Member Since"
                value={userData.joinDate}
                isEmpty={false}
              />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">About</h3>
                <button
                  onClick={handleEditAbout}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              {userData.bio ? (
                <p className="text-slate-700 leading-relaxed">{userData.bio}</p>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-500 mb-2">Tell potential clients about yourself</p>
                  <MissingDataBadge text="Add your bio to attract more clients" />
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Skills & Expertise</h3>
                <button
                  onClick={handleAddSkills}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skills</span>
                </button>
              </div>
              {userData.skills && userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:shadow-sm transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-500 mb-2">Showcase your skills and expertise</p>
                  <MissingDataBadge text="Add skills to improve discoverability" />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{userData.email}</span>
                    </div>
                    {userData.isEmailVerified ? <VerifiedBadge /> :
                      <button
                        onClick={handleVerifyEmail}
                        className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full hover:bg-amber-100 transition-colors"
                      >
                        Verify email
                      </button>
                    }
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      {userData.phone ? (
                        <span className="text-slate-700">{userData.phone}</span>
                      ) : (
                        <span className="text-slate-400">Phone not added</span>
                      )}
                    </div>
                    {userData.phone ? (
                      userData.isPhoneVerified ? <VerifiedBadge /> :
                        <button
                          onClick={handleVerifyPhone}
                          className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full hover:bg-amber-100 transition-colors"
                        >
                          Verify phone
                        </button>
                    ) : (
                      <button
                        onClick={handleAddPhone}
                        className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full hover:bg-amber-100 transition-colors"
                      >
                        Add phone
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    {userData.country ? (
                      <span className="text-slate-700">{userData.country}{userData.city ? `, ${userData.city}` : ''}</span>
                    ) : (
                      <span className="text-slate-400">Location not added</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-slate-400" />
                    {userData.website ? (
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                        <span>{userData.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Website not added</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-slate-400" />
                    {userData.github ? (
                      <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                        <span>GitHub Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">GitHub not connected</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-slate-400" />
                    {userData.linkedin ? (
                      <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">LinkedIn not connected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Languages</h3>
                  <button
                    onClick={handleAddLanguages}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                {userData.languages && userData.languages.length > 0 ? (
                  <div className="space-y-3">
                    {userData.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                        <span className="text-slate-700 font-medium">{lang.name}</span>
                        <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500 mb-2">Add languages you speak</p>
                    <MissingDataBadge text="Expand your reach globally" />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Certifications</h3>
                  <button
                    onClick={handleAddCertifications}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                {userData.certifications && userData.certifications.length > 0 ? (
                  <div className="space-y-4">
                    {userData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{cert.name}</p>
                          <p className="text-sm text-slate-600">{cert.issuer}</p>
                          <p className="text-xs text-slate-500">{cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 mb-2">Showcase your certifications</p>
                    <MissingDataBadge text="Build trust with credentials" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {/* Project Categories Toggle */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 sm:mb-0">
                  {userData.role === 'freelancer' ? 'Projects & Portfolio' : 'Posted Projects'}
                </h3>

                <div className="flex items-center space-x-3">
                  {userData.role === 'freelancer' && (
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setProjectCategory('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${projectCategory === 'all'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        All Work
                      </button>
                      <button
                        onClick={() => setProjectCategory('client')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${projectCategory === 'client'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Client Projects
                      </button>
                      <button
                        onClick={() => setProjectCategory('personal')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${projectCategory === 'personal'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Personal Projects
                      </button>
                    </div>
                  )}

                  <button
                    onClick={userData.role === 'freelancer' ? handleAddProject : handlePostProject}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{userData.role === 'freelancer' ? 'Add Work' : 'Post Project'}</span>
                  </button>
                </div>
              </div>

              {/* Portfolio Items Display */}
              {profile?.portfolio && profile.portfolio.length > 0 ? (
                <div className="space-y-4">
                  {/* Filter portfolio items based on selected category */}
                  {profile.portfolio
                    .filter(item => {
                      if (projectCategory === 'all') return true;
                      if (projectCategory === 'client') return item.category === 'Client Project' || item.category === 'Freelance Work';
                      if (projectCategory === 'personal') return item.category === 'Personal Project' || item.category === 'Open Source';
                      return false;
                    })
                    .map((item, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-slate-600 mb-3">{item.description}</p>

                            {/* Technologies */}
                            {item.technologies && item.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.technologies.map((tech, techIndex) => (
                                  <span key={techIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Project Links */}
                            <div className="flex space-x-4 mb-3">
                              {item.projectUrl && (
                                <a
                                  href={item.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <Globe className="w-4 h-4" />
                                  <span>Live Demo</span>
                                </a>
                              )}
                              {item.githubUrl && (
                                <a
                                  href={item.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 text-sm"
                                >
                                  <span>View Code</span>
                                </a>
                              )}
                            </div>

                            {/* Category Badge */}
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${item.category === 'Client Project' || item.category === 'Freelance Work'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-green-50 text-green-700'
                                }`}>
                                {item.category}
                              </span>
                              {item.completedDate && (
                                <span className="flex items-center space-x-1 text-slate-500 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(item.completedDate).toLocaleDateString()}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Project Images */}
                          {item.images && item.images.length > 0 && (
                            <div className="ml-4 flex-shrink-0">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Show message if no items match filter */}
                  {profile.portfolio.filter(item => {
                    if (projectCategory === 'all') return true;
                    if (projectCategory === 'client') return item.category === 'Client Project' || item.category === 'Freelance Work';
                    if (projectCategory === 'personal') return item.category === 'Personal Project' || item.category === 'Open Source';
                    return false;
                  }).length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                        <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">
                          No {projectCategory === 'client' ? 'client' : projectCategory === 'personal' ? 'personal' : ''} projects found
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <div className="flex items-center justify-center w-20 h-20 bg-slate-100 rounded-xl mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-slate-400" />
                  </div>

                  <h4 className="text-lg font-medium text-slate-900 mb-2">
                    {userData.role === 'freelancer'
                      ? 'Showcase Your Work'
                      : 'No Projects Posted Yet'
                    }
                  </h4>

                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    {userData.role === 'freelancer'
                      ? 'Add your best projects to attract clients. Include both client work and personal projects that demonstrate your skills.'
                      : 'Post your first project to find talented freelancers for your needs.'
                    }
                  </p>

                  {userData.role === 'freelancer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm text-slate-600">
                      <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>Client Projects</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <Star className="w-4 h-4 text-green-600" />
                        <span>Personal Projects</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span>Open Source</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 p-3 bg-orange-50 rounded-lg">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span>Certifications</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={userData.role === 'freelancer' ? handleAddProject : handlePostProject}
                    className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {userData.role === 'freelancer' ? 'Add Your First Project' : 'Post Your First Project'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Client Reviews</h3>
                {userData.totalReviews > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-slate-900">{userData.rating}</span>
                    <span className="text-slate-500">({userData.totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              {userData.totalReviews > 0 ? (
                <div className="space-y-4">
                  {/* Reviews would come from backend API call */}
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                    <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Reviews will load from backend</p>
                    <MissingDataBadge text="Connect backend API" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-900 mb-2">No reviews yet</h4>
                  <p className="text-slate-600 mb-4">
                    Complete your first project to start receiving reviews from clients
                  </p>
                  <MissingDataBadge text="Build your reputation" />
                </div>
              )}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Work Experience</h3>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              {userData.experience && userData.experience.length > 0 ? (
                <div className="space-y-6">
                  {userData.experience.map((exp, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">{exp.jobTitle}</h4>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            <p className="text-sm text-slate-500 mt-1">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900 mb-2">Add Your Experience</h4>
                  <p className="text-slate-600 mb-4">
                    {userData.role === 'freelancer'
                      ? 'Showcase your professional experience to build credibility with clients'
                      : 'Add your company background and previous projects'
                    }
                  </p>
                  <button
                    onClick={handleAddExperience}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Experience</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Education</h3>
                <button
                  onClick={handleAddEducation}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>

              {userData.education && userData.education.length > 0 ? (
                <div className="space-y-6">
                  {userData.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                            <p className="text-green-600 font-medium">{edu.institution}</p>
                            <p className="text-sm text-slate-500 mt-1">
                              {edu.startYear} - {edu.endYear}
                            </p>
                            {edu.grade && (
                              <p className="text-sm text-slate-600 mt-1">Grade: {edu.grade}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900 mb-2">Add Your Education</h4>
                  <p className="text-slate-600 mb-4">
                    Add your educational background to build credibility with clients
                  </p>
                  <button
                    onClick={handleAddEducation}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Education</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add loading states and null checks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Please log in</h2>
          <p className="text-slate-600">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading your profile...</h2>
          <p className="text-slate-600">Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          {/* Cover Image Placeholder */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <div className="p-6 -mt-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleUploadProfilePicture}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {userData.name || 'Complete your profile'}
                    </h1>
                    {userData.isProfileVerified && <VerifiedBadge />}
                  </div>

                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-slate-600">{userData.title}</p>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-500">@{userData.userName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.country || 'Location not set'}</span>
                    </div>

                    {userData.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{userData.rating} ({userData.totalReviews} reviews)</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {userData.joinDate}</span>
                    </div>

                    {userData.role === 'freelancer' && userData.hourlyRate && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${userData.hourlyRate}/hour</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={`mailto:${userData.email}`}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact</span>
                    </a>

                    {userData.website && (
                      <a
                        href={userData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {userData.github && (
                      <a
                        href={userData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {userData.linkedin && (
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={handleEditProfile}
                className="mt-4 lg:mt-0 flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default Profile;