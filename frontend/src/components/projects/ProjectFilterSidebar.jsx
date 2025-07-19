
import React, { useState } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Briefcase,
  Star,
  Clock,
  Code
} from 'lucide-react';

const ProjectFilterSidebar = ({ filters, onFilterChange, onClearAll, activeFiltersCount }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    skills: true,
    experience: true,
    type: true,
    budget: true,
    location: false
  });

  // Safety check for filters prop
  if (!filters) {
    return <div className="p-4">Loading filters...</div>;
  }

  const projectCategories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'UI/UX Design',
    'Content Writing',
    'Digital Marketing',
    'Video Editing',
    'Graphic Design',
    'SEO',
    'Social Media',
    'Translation',
    'Blockchain',
    'DevOps',
    'Cybersecurity',
    'Game Development',
    'E-commerce',
    'WordPress',
    'Photography',
    'Virtual Assistant'
  ];

  const popularSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'PHP',
    'WordPress',
    'HTML/CSS',
    'Vue.js',
    'Angular',
    'MongoDB',
    'MySQL',
    'Photoshop',
    'Figma',
    'AWS',
    'Docker',
    'TensorFlow',
    'Flutter',
    'React Native',
    'Laravel',
    'Django'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];

  const projectTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'contract', label: 'Contract' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' }
  ];

  const budgetRanges = [
    { min: '', max: '500', label: 'Under $500' },
    { min: '500', max: '1000', label: '$500 - $1,000' },
    { min: '1000', max: '5000', label: '$1,000 - $5,000' },
    { min: '5000', max: '10000', label: '$5,000 - $10,000' },
    { min: '10000', max: '', label: '$10,000+' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleArrayFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];

    onFilterChange({ [filterType]: newValues });
  };

  const handleBudgetChange = (min, max) => {
    onFilterChange({ budgetMin: min, budgetMax: max });
  };

  const isBudgetRangeSelected = (min, max) => {
    return filters?.budgetMin === min && filters?.budgetMax === max;
  };

  const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ value, label, checked, onChange, count }) => (
    <label className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 rounded px-2 py-1">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(value)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      {count && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  );

  const RadioOption = ({ value, label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer group hover:bg-gray-50 rounded px-2 py-1">
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                {activeFiltersCount}
              </span>
              <button
                onClick={onClearAll}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-[70vh] overflow-y-auto">
        {/* Categories */}
        <FilterSection
          title="Categories"
          icon={Briefcase}
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="max-h-48 overflow-y-auto space-y-1">
            {projectCategories.map((category) => (
              <CheckboxOption
                key={category}
                value={category}
                label={category}
                checked={filters.categories?.includes(category) || false}
                onChange={(value) => handleArrayFilterChange('categories', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Skills */}
        <FilterSection
          title="Skills"
          icon={Code}
          isExpanded={expandedSections.skills}
          onToggle={() => toggleSection('skills')}
        >
          <div className="max-h-48 overflow-y-auto space-y-1">
            {popularSkills.map((skill) => (
              <CheckboxOption
                key={skill}
                value={skill}
                label={skill}
                checked={filters.skills?.includes(skill) || false}
                onChange={(value) => handleArrayFilterChange('skills', value)}
              />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <input
              type="text"
              placeholder="Add custom skill..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleArrayFilterChange('skills', e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add</p>
          </div>
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          icon={Star}
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          <div className="space-y-1">
            {experienceLevels.map((level) => (
              <RadioOption
                key={level.value}
                value={level.value}
                label={level.label}
                checked={filters?.experienceLevel === level.value}
                onChange={(value) => onFilterChange({ experienceLevel: value })}
              />
            ))}
            {filters?.experienceLevel && (
              <button
                onClick={() => onFilterChange({ experienceLevel: '' })}
                className="text-xs text-blue-600 hover:text-blue-700 mt-2"
              >
                Clear selection
              </button>
            )}
          </div>
        </FilterSection>

        {/* Project Type */}
        <FilterSection
          title="Project Type"
          icon={Clock}
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="space-y-1">
            {projectTypes.map((type) => (
              <RadioOption
                key={type.value}
                value={type.value}
                label={type.label}
                checked={filters?.projectType === type.value}
                onChange={(value) => onFilterChange({ projectType: value })}
              />
            ))}
            {filters?.projectType && (
              <button
                onClick={() => onFilterChange({ projectType: '' })}
                className="text-xs text-blue-600 hover:text-blue-700 mt-2"
              >
                Clear selection
              </button>
            )}
          </div>
        </FilterSection>

        {/* Budget Range */}
        <FilterSection
          title="Budget Range"
          icon={DollarSign}
          isExpanded={expandedSections.budget}
          onToggle={() => toggleSection('budget')}
        >
          <div className="space-y-2">
            {budgetRanges.map((range) => (
              <RadioOption
                key={`${range.min}-${range.max}`}
                value={`${range.min}-${range.max}`}
                label={range.label}
                checked={isBudgetRangeSelected(range.min, range.max)}
                onChange={() => handleBudgetChange(range.min, range.max)}
              />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters?.budgetMin || ''}
                onChange={(e) => onFilterChange({ budgetMin: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="self-center text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters?.budgetMax || ''}
                onChange={(e) => onFilterChange({ budgetMax: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection
          title="Location"
          icon={MapPin}
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <input
            type="text"
            placeholder="Enter location..."
            value={filters?.location || ''}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-2 space-y-1">
            {['Remote', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany'].map((location) => (
              <button
                key={location}
                onClick={() => onFilterChange({ location })}
                className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
              >
                {location}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProjectFilterSidebar;