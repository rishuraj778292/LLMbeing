import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';

const EducationTab = ({ userData, onEditModal }) => {
    return (
        <div className="space-y-6">
            {/* Education Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                    <button
                        onClick={() => onEditModal('education', {})}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                        Add Education
                    </button>
                </div>

                {userData.education && userData.education.length > 0 ? (
                    <div className="space-y-4">
                        {userData.education.map((edu, index) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4 hover:bg-gray-50 rounded-r p-3 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                        <p className="text-green-600 font-medium text-sm">{edu.institution}</p>

                                        <div className="flex items-center space-x-4 text-gray-500 text-xs mt-1">
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{edu.startYear} - {edu.endYear}</span>
                                            </span>
                                            {edu.grade && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                    {edu.grade}
                                                </span>
                                            )}
                                        </div>

                                        {edu.fieldOfStudy && (
                                            <p className="text-gray-600 text-sm mt-1">{edu.fieldOfStudy}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">Add your educational background</p>
                        <button
                            onClick={() => onEditModal('education', {})}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Add education
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationTab;
