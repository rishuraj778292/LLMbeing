import React, { useState } from 'react';
import { Heart, Search, Filter, Calendar, DollarSign, MapPin, Bookmark, Trash2 } from 'lucide-react';
import ProjectCard from '../../../components/projects/ProjectCard';

const SavedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('saved-date');

  // Mock saved projects data
  const savedProjects = [
    {
      _id: '1',
      title: 'React E-commerce Dashboard Development',
      description: 'We need an experienced React developer to build a comprehensive dashboard for our e-commerce platform. The dashboard should include analytics, inventory management, and user management features.',
      budget: 4500,
      clientName: 'TechStart Inc.',
      location: 'Remote',
      skillsRequired: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      postedAt: '2024-01-15',
      savedAt: '2024-01-16',
      proposal: 'Looking for detailed proposals with timeline and approach',
      category: 'Web Development'
    },
    {
      _id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Design a modern, user-friendly interface for our fitness tracking mobile application. Must be experienced with React Native and have a strong portfolio.',
      budget: 3200,
      clientName: 'FitLife Solutions',
      location: 'New York, NY',
      skillsRequired: ['React Native', 'UI/UX', 'Figma', 'Mobile Design'],
      postedAt: '2024-01-14',
      savedAt: '2024-01-15',
      proposal: 'Submit portfolio samples and design process',
      category: 'Mobile Development'
    },
    {
      _id: '3',
      title: 'Python Data Analysis & Visualization',
      description: 'Analyze customer data and create interactive visualizations using Python. Experience with pandas, matplotlib, and plotly required.',
      budget: 2800,
      clientName: 'DataCorp Analytics',
      location: 'Remote',
      skillsRequired: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis'],
      postedAt: '2024-01-13',
      savedAt: '2024-01-14',
      proposal: 'Provide sample analysis work and methodology',
      category: 'Data Science'
    }
  ];

  const filteredProjects = savedProjects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skillsRequired?.some(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'saved-date':
        return new Date(b.savedAt) - new Date(a.savedAt);
      case 'posted-date':
        return new Date(b.postedAt) - new Date(a.postedAt);
      case 'budget-high':
        return (b.budget || 0) - (a.budget || 0);
      case 'budget-low':
        return (a.budget || 0) - (b.budget || 0);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveFromSaved = (projectId) => {
    // Handle removing project from saved list
    console.log('Removing project from saved:', projectId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Projects</h1>
          <p className="text-slate-600">Projects you've saved for later review</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''} saved
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search saved projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="saved-date">Recently Saved</option>
              <option value="posted-date">Recently Posted</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {sortedProjects.length > 0 ? (
        <div className="space-y-4">
          {sortedProjects.map((project) => (
            <div key={project._id} className="relative group">
              {/* Saved Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  Saved {new Date(project.savedAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleRemoveFromSaved(project._id)}
                  className="p-1 bg-white border border-red-200 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Project Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h3 className="font-bold text-lg text-slate-800 hover:text-blue-600 cursor-pointer transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium whitespace-nowrap">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${project.budget?.toLocaleString() || 'Not specified'}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <span className="hover:text-blue-500 transition-colors cursor-pointer">{project.clientName}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                      <span>{project.location || "Remote"}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                      <span>Posted {new Date(project.postedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skillsRequired?.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired?.length > 5 && (
                        <span className="text-xs text-slate-500">+{project.skillsRequired.length - 5} more</span>
                      )}
                    </div>

                    {project.category && (
                      <div className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {project.category}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap">
                      Apply Now
                    </button>
                    <button className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <div className="text-slate-400 mb-4">
            <Bookmark className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No saved projects</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm
              ? "No saved projects match your search criteria."
              : "Start saving projects you're interested in to keep track of them easily."
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedProjects;