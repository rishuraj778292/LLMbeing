
import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectFilterSidebar = () => {
  const [filters, setFilters] = useState({
    search: '',
    projectCategory: [],
    experienceLevel: [],
    projectType: [],
    projectStatus: [],
    budget: [],
    currency: 'INR',
    skillsRequired: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    experience: true,
    type: true,
    status: true,
    budget: true
  });

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
    { value: 'research_legal_ai', label: 'Research Legal AI' },
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

  const experienceLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Expert', label: 'Expert' }
  ];

  const projectTypes = [
    { value: 'one_time', label: 'One Time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'ongoing', label: 'Ongoing' }
  ];

  const projectStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'completed', label: 'Completed' }
  ];

  const budgetRanges = [
    { value: '0k to 10k', label: '₹0k - ₹10k' },
    { value: '10k to 20k', label: '₹10k - ₹20k' },
    { value: '20k to 30k', label: '₹20k - ₹30k' },
    { value: '30k-40k', label: '₹30k - ₹40k' },
    { value: '40k-50k', label: '₹40k - ₹50k' },
    { value: 'Above 50k', label: 'Above ₹50k' }
  ];

  const currencies = [
    { value: 'INR', label: '₹ INR' },
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' }
  ];

  const handleFilterChange = (filterType, value) => {
    if (Array.isArray(filters[filterType])) {
      const newValues = filters[filterType].includes(value)
        ? filters[filterType].filter(item => item !== value)
        : [...filters[filterType], value];

      setFilters(prev => ({
        ...prev,
        [filterType]: newValues
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      projectCategory: [],
      experienceLevel: [],
      projectType: [],
      projectStatus: [],
      budget: [],
      currency: 'INR',
      skillsRequired: ''
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.skillsRequired) count++;
    count += filters.projectCategory.length;
    count += filters.experienceLevel.length;
    count += filters.projectType.length;
    count += filters.projectStatus.length;
    count += filters.budget.length;
    if (filters.currency !== 'INR') count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-slate-100 pb-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-slate-900 hover:text-blue-600 transition-colors text-sm"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isExpanded && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );

  const CheckboxOption = ({ value, label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(value)}
        className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-1"
      />
      <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg h-fit sticky top-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="text-blue-600" size={18} />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Project Category */}
        <FilterSection
          title="Project Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-300">
            {projectCategories.slice(0, 8).map((category) => (
              <CheckboxOption
                key={category.value}
                value={category.value}
                label={category.label}
                checked={filters.projectCategory.includes(category.value)}
                onChange={(value) => handleFilterChange('projectCategory', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          {experienceLevels.map((level) => (
            <CheckboxOption
              key={level.value}
              value={level.value}
              label={level.label}
              checked={filters.experienceLevel.includes(level.value)}
              onChange={(value) => handleFilterChange('experienceLevel', value)}
            />
          ))}
        </FilterSection>

        {/* Project Type */}
        <FilterSection
          title="Project Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          {projectTypes.map((type) => (
            <CheckboxOption
              key={type.value}
              value={type.value}
              label={type.label}
              checked={filters.projectType.includes(type.value)}
              onChange={(value) => handleFilterChange('projectType', value)}
            />
          ))}
        </FilterSection>

        {/* Budget Range */}
        <FilterSection
          title="Budget Range"
          isExpanded={expandedSections.budget}
          onToggle={() => toggleSection('budget')}
        >
          {budgetRanges.map((budget) => (
            <CheckboxOption
              key={budget.value}
              value={budget.value}
              label={budget.label}
              checked={filters.budget.includes(budget.value)}
              onChange={(value) => handleFilterChange('budget', value)}
            />
          ))}
        </FilterSection>

        {/* Currency */}
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-medium text-slate-900 mb-2 text-sm">Currency</h3>
          <select
            value={filters.currency}
            onChange={(e) => handleFilterChange('currency', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Required */}
        <div>
          <label className="block font-medium text-slate-900 mb-2 text-sm">
            Skills Required
          </label>
          <input
            type="text"
            placeholder="e.g. React, Node.js, Python"
            value={filters.skillsRequired}
            onChange={(e) => handleFilterChange('skillsRequired', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Separate multiple skills with commas
          </p>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => console.log('Applied filters:', filters)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProjectFilterSidebar;