import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const ExperienceTab = ({ userData, onEditModal }) => {
    return (
        <div className="space-y-6">
            {/* Experience Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                    <button
                        onClick={() => onEditModal('experience', {})}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                        Add Experience
                    </button>
                </div>

                {userData.experience && userData.experience.length > 0 ? (
                    <div className="space-y-4">
                        {userData.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 rounded-r p-3 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                        <p className="text-blue-600 font-medium text-sm">{exp.company}</p>

                                        <div className="flex items-center space-x-4 text-gray-500 text-xs mt-1">
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                            </span>
                                            {exp.employmentType && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                    {exp.employmentType}
                                                </span>
                                            )}
                                        </div>

                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{exp.description}</p>
                                        )}

                                        {exp.skills && exp.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {exp.skills.slice(0, 3).map((skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {exp.skills.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                                        +{exp.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">Showcase your professional background</p>
                        <button
                            onClick={() => onEditModal('experience', {})}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Add work experience
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceTab;
