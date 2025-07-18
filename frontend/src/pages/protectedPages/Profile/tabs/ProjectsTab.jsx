import React, { useState } from 'react';
import { Plus, Globe, Calendar, ExternalLink } from 'lucide-react';

const ProjectsTab = ({ userData, onEditModal }) => {
    const [projectCategory, setProjectCategory] = useState('all');

    const handlePostProject = () => {
        console.log('Post project clicked');
        // In a real app: navigate('/post-project')
    };

    return (
        <div className="space-y-6">
            {/* Projects & Portfolio Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {userData.role === 'freelancer' ? 'Projects & Portfolio' : 'Posted Projects'}
                    </h3>
                    <button
                        onClick={userData.role === 'freelancer' ? () => onEditModal('portfolio', {}) : handlePostProject}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        {userData.role === 'freelancer' ? 'Add Project' : 'Post Project'}
                    </button>
                </div>

                {userData.role === 'freelancer' && userData.portfolio && userData.portfolio.length > 0 && (
                    <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setProjectCategory('all')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${projectCategory === 'all'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setProjectCategory('client')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${projectCategory === 'client'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Client Work
                        </button>
                        <button
                            onClick={() => setProjectCategory('personal')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${projectCategory === 'personal'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Personal
                        </button>
                    </div>
                )}

                {userData.portfolio && userData.portfolio.length > 0 ? (
                    <div className="space-y-4">
                        {userData.portfolio
                            .filter(item => {
                                if (projectCategory === 'all') return true;
                                if (projectCategory === 'client') return item.category === 'Client Project' || item.category === 'Freelance Work';
                                if (projectCategory === 'personal') return item.category === 'Personal Project' || item.category === 'Open Source';
                                return false;
                            })
                            .map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                                            {/* Technologies */}
                                            {item.technologies && item.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {item.technologies.slice(0, 4).map((tech, techIndex) => (
                                                        <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {item.technologies.length > 4 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                                            +{item.technologies.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Links and Category */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {item.projectUrl && (
                                                        <a
                                                            href={item.projectUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
                                                        >
                                                            <Globe className="w-3 h-3" />
                                                            <span>Live Demo</span>
                                                        </a>
                                                    )}
                                                    {item.githubUrl && (
                                                        <a
                                                            href={item.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-xs"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            <span>Code</span>
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs rounded ${item.category === 'Client Project' || item.category === 'Freelance Work'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {item.category === 'Client Project' ? 'Client' :
                                                            item.category === 'Freelance Work' ? 'Freelance' :
                                                                item.category === 'Personal Project' ? 'Personal' : 'Open Source'}
                                                    </span>
                                                    {item.completedDate && (
                                                        <span className="flex items-center space-x-1 text-gray-500 text-xs">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{new Date(item.completedDate).getFullYear()}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project Image */}
                                        {item.images && item.images.length > 0 && (
                                            <div className="ml-4 flex-shrink-0">
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">
                            {userData.role === 'freelancer'
                                ? 'Showcase your work and attract clients'
                                : 'No projects posted yet'
                            }
                        </p>
                        <button
                            onClick={userData.role === 'freelancer' ? () => onEditModal('portfolio', {}) : handlePostProject}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            {userData.role === 'freelancer' ? 'Add your first project' : 'Post your first project'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsTab;
