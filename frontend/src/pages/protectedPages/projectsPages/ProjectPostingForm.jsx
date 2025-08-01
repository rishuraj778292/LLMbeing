import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProject } from '../../../../Redux/Slice/projectSlice';
import { ChevronDown, Plus, X, DollarSign, Clock, Users, Tag, FileText, Target } from 'lucide-react';

const ProjectPostingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    currency: 'INR',
    experienceLevel: '',
    projectType: '',
    projectCategory: [],
    skillsRequired: [],
    newSkill: ''
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectCategories = [
    { value: 'ai_chatbots', label: 'AI Chatbots' },
    { value: 'prompt_engineering', label: 'Prompt Engineering' },
    { value: 'process_automation', label: 'Process Automation' },
    { value: 'api_integration', label: 'API Integration' },
    { value: 'document_processing', label: 'Document Processing' },
    { value: 'search_analytics', label: 'Search Analytics' },
    { value: 'nlp_classification', label: 'NLP Classification' },
    { value: 'business_intelligence', label: 'Business Intelligence' },
    { value: 'data_labeling', label: 'Data Labeling' },
    { value: 'research_legal_ai', label: 'Research & Legal AI' },
    { value: 'media_production', label: 'Media Production' },
    { value: 'voice_technology', label: 'Voice Technology' },
    { value: 'translation_localization', label: 'Translation & Localization' },
    { value: 'generative_design', label: 'Generative Design' },
    { value: 'content_marketing', label: 'Content Marketing' },
    { value: 'product_development', label: 'Product Development' },
    { value: 'edtech_solutions', label: 'EdTech Solutions' },
    { value: 'ai_consulting', label: 'AI Consulting' },
    { value: 'security_compliance', label: 'Security & Compliance' }
  ];

  const budgetOptions = [
    '0k to 10k',
    '10k to 20k',
    '20k to 30k',
    '30k-40k',
    '40k-50k',
    'Above 50k'
  ];

  const experienceLevels = [
    { value: 'Beginner', label: 'Beginner', desc: 'New to the field' },
    { value: 'Intermediate', label: 'Intermediate', desc: '2-5 years experience' },
    { value: 'Expert', label: 'Expert', desc: '5+ years experience' }
  ];

  const projectTypes = [
    { value: 'one_time', label: 'One-time Project', desc: 'Fixed scope project' },
    { value: 'hourly', label: 'Hourly Work', desc: 'Pay by the hour' },
    { value: 'monthly', label: 'Monthly Contract', desc: 'Monthly retainer' },
    { value: 'ongoing', label: 'Ongoing Work', desc: 'Long-term partnership' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      projectCategory: prev.projectCategory.includes(category)
        ? prev.projectCategory.filter(c => c !== category)
        : [...prev.projectCategory, category]
    }));
  };

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skillsRequired.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title || formData.title.length < 5) {
        newErrors.title = 'Title must be at least 5 characters long';
      }
      if (!formData.description || formData.description.length < 10) {
        newErrors.description = 'Description must be at least 10 characters long';
      }
    }

    if (step === 2) {
      if (!formData.budget) newErrors.budget = 'Budget is required';
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
      if (!formData.projectType) newErrors.projectType = 'Project type is required';
    }

    if (step === 3) {
      if (formData.projectCategory.length === 0) {
        newErrors.projectCategory = 'At least one category is required';
      }
      if (formData.skillsRequired.length === 0) {
        newErrors.skillsRequired = 'At least one skill is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      try {
        setIsSubmitting(true);
        console.log('Project data:', formData);

        // Parse budget from string format to proper min/max object
        const parseBudget = (budgetString) => {
          if (!budgetString) return { min: 0, max: 0 };

          // Remove 'k' and split by 'to' or '-'
          const cleanedString = budgetString.toLowerCase().replace(/k/g, '');
          const parts = cleanedString.includes('to')
            ? cleanedString.split('to').map(part => part.trim())
            : cleanedString.includes('-')
              ? cleanedString.split('-').map(part => part.trim())
              : ['0', '0'];

          // Handle "Above X" format
          if (budgetString.toLowerCase().includes('above')) {
            const value = parseInt(cleanedString.replace('above', '').trim()) || 0;
            return { min: value, max: value * 2 }; // For "Above 50k", set max to 100k
          }

          // Convert to numbers and multiply by 1000 (because of 'k')
          const min = parseInt(parts[0]) * 1000 || 0;
          const max = parseInt(parts[1]) * 1000 || 0;

          return { min, max };
        };

        // Map experience level to backend's expected enum values
        const mapExperienceLevel = (level) => {
          const mappings = {
            'Beginner': 'Entry',
            'Intermediate': 'Intermediate',
            'Expert': 'Expert'
          };
          return mappings[level] || 'Entry';
        };

        // Create project data for API
        const projectData = {
          title: formData.title,
          description: formData.description,
          budget: parseBudget(formData.budget),
          currency: formData.currency,
          experienceLevel: mapExperienceLevel(formData.experienceLevel),
          projectType: formData.projectType,
          projectCategory: formData.projectCategory,
          skillsRequired: formData.skillsRequired
        };

        console.log('Transformed project data:', projectData);

        // Dispatch the action to create the project
        const result = await dispatch(createProject(projectData)).unwrap();
        console.log('Project created successfully:', result);

        // Navigate to my projects page
        navigate('/my-projects');
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project: ' + (error.message || 'Unknown error'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step === currentStep
              ? 'bg-blue-600 text-white shadow-lg'
              : step < currentStep
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-200 text-gray-500'
            }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post Your Project</h1>
          <p className="text-xl text-gray-600">Find the perfect talent for your AI project</p>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep === 1 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Build an AI-powered customer service chatbot"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${errors.title ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    maxLength={100}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  <p className="text-gray-500 text-sm mt-1">{formData.title.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project requirements, goals, and expectations..."
                    rows={6}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${errors.description ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
                      }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  <p className="text-gray-500 text-sm mt-1">{formData.description.length} characters</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <DollarSign className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Budget & Requirements</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget Range *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none bg-white transition-all duration-200 ${errors.budget ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
                        }`}
                    >
                      <option value="">Select budget range</option>
                      {budgetOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Experience Level Required *
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {experienceLevels.map(level => (
                    <div
                      key={level.value}
                      onClick={() => handleInputChange('experienceLevel', level.value)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${formData.experienceLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center mb-2">
                        <Users className="text-blue-600 mr-2" size={18} />
                        <h3 className="font-semibold text-gray-900">{level.label}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{level.desc}</p>
                    </div>
                  ))}
                </div>
                {errors.experienceLevel && <p className="text-red-500 text-sm mt-2">{errors.experienceLevel}</p>}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Project Type *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {projectTypes.map(type => (
                    <div
                      key={type.value}
                      onClick={() => handleInputChange('projectType', type.value)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${formData.projectType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center mb-2">
                        <Clock className="text-blue-600 mr-2" size={18} />
                        <h3 className="font-semibold text-gray-900">{type.label}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{type.desc}</p>
                    </div>
                  ))}
                </div>
                {errors.projectType && <p className="text-red-500 text-sm mt-2">{errors.projectType}</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Target className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Categories & Skills</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Project Categories * (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                    {projectCategories.map(category => (
                      <div
                        key={category.value}
                        onClick={() => handleCategoryToggle(category.value)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm text-sm ${formData.projectCategory.includes(category.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <Tag className="mr-2" size={14} />
                          {category.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.projectCategory && <p className="text-red-500 text-sm mt-2">{errors.projectCategory}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Required Skills *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.newSkill}
                      onChange={(e) => handleInputChange('newSkill', e.target.value)}
                      placeholder="Add a skill (e.g., Python, TensorFlow)"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.skillsRequired && <p className="text-red-500 text-sm mt-2">{errors.skillsRequired}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-6 bg-gray-50 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse mr-2">Processing...</span>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  'Post Project'
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Title: <span className="text-gray-900 font-medium">{formData.title || 'Not set'}</span></p>
              <p className="text-gray-600">Budget: <span className="text-gray-900 font-medium">{formData.budget || 'Not set'}</span></p>
              <p className="text-gray-600">Experience: <span className="text-gray-900 font-medium">{formData.experienceLevel || 'Not set'}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Type: <span className="text-gray-900 font-medium">{formData.projectType || 'Not set'}</span></p>
              <p className="text-gray-600">Categories: <span className="text-gray-900 font-medium">{formData.projectCategory.length || 0} selected</span></p>
              <p className="text-gray-600">Skills: <span className="text-gray-900 font-medium">{formData.skillsRequired.length || 0} added</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPostingForm;