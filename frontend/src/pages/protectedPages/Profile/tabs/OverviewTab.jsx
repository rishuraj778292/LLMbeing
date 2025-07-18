import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, CheckCircle, Edit, ExternalLink } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { sendEmailVerification, sendPhoneVerification, updateProfile } from '../../../../../Redux/Slice/profileSlice';

const OverviewTab = ({ userData, onEditModal }) => {
    const dispatch = useDispatch();
    const [inlineEdit, setInlineEdit] = useState({
        email: false,
        phone: false,
        location: false,
        website: false,
        github: false,
        linkedin: false
    });
    const [inlineValues, setInlineValues] = useState({
        email: '',
        phone: '',
        country: '',
        city: '',
        website: '',
        github: '',
        linkedin: ''
    });

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

    const handleInlineEdit = (field) => {
        setInlineEdit(prev => ({ ...prev, [field]: true }));
        if (field === 'location') {
            setInlineValues(prev => ({
                ...prev,
                country: userData.country || '',
                city: userData.city || ''
            }));
        } else {
            setInlineValues(prev => ({ ...prev, [field]: userData[field] || '' }));
        }
    };

    const handleInlineCancel = (field) => {
        setInlineEdit(prev => ({ ...prev, [field]: false }));
        if (field === 'location') {
            setInlineValues(prev => ({ ...prev, country: '', city: '' }));
        } else {
            setInlineValues(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleInlineSave = async (field) => {
        try {
            if (field === 'location') {
                await dispatch(updateProfile({
                    country: inlineValues.country,
                    city: inlineValues.city
                })).unwrap();
            } else {
                await dispatch(updateProfile({ [field]: inlineValues[field] })).unwrap();
            }
            setInlineEdit(prev => ({ ...prev, [field]: false }));
            if (field === 'location') {
                setInlineValues(prev => ({ ...prev, country: '', city: '' }));
            } else {
                setInlineValues(prev => ({ ...prev, [field]: '' }));
            }
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
        }
    };

    return (
        <div className="space-y-6">
            {/* About Section - Standard Design */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    <button
                        onClick={() => onEditModal('about', { bio: userData?.bio || '' })}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                        Edit
                    </button>
                </div>
                {userData.bio ? (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{userData.bio}</div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">Tell your story and introduce yourself</p>
                        <button
                            onClick={() => onEditModal('about', { bio: '' })}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Add about section
                        </button>
                    </div>
                )}
            </div>

            {/* Skills Section - Standard Design */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
                    <button
                        onClick={() => onEditModal('skills', {
                            skills: userData?.skills ? userData.skills.join(', ') : ''
                        })}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                        Edit
                    </button>
                </div>
                {userData.skills && userData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">Showcase your skills and expertise</p>
                        <button
                            onClick={() => onEditModal('skills', { skills: '' })}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Add your first skill
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Information - Clean Standard Design */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact Information</h3>
                    <button
                        onClick={() => onEditModal('profile', {
                            email: userData?.email || '',
                            phone: userData?.phone || '',
                            website: userData?.website || '',
                            github: userData?.github || '',
                            linkedin: userData?.linkedin || ''
                        })}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                        Edit
                    </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <div>
                                <div className="text-xs sm:text-sm text-gray-500">Email</div>
                                <div className="text-sm sm:text-base text-gray-900 font-medium">{userData.email}</div>
                            </div>
                        </div>
                        {userData.isEmailVerified ? (
                            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs font-medium">Verified</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleVerifyEmail}
                                className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                            >
                                Verify
                            </button>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <div className="flex-1">
                                <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                                {inlineEdit.phone ? (
                                    <div className="flex items-center space-x-2 mt-1">
                                        <input
                                            type="tel"
                                            value={inlineValues.phone}
                                            onChange={(e) => setInlineValues(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="Enter your phone number"
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleInlineSave('phone')}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => handleInlineCancel('phone')}
                                            className="px-2 py-1 text-gray-500 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : userData.phone ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm sm:text-base text-gray-900 font-medium">{userData.phone}</span>
                                        <button
                                            onClick={() => handleInlineEdit('phone')}
                                            className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                        >
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleInlineEdit('phone')}
                                        className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                                    >
                                        Tap to add your phone number
                                    </button>
                                )}
                            </div>
                        </div>
                        {userData.phone && !inlineEdit.phone && (
                            userData.isPhoneVerified ? (
                                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    <span className="text-xs font-medium">Verified</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleVerifyPhone}
                                    className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                                >
                                    Verify
                                </button>
                            )
                        )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm text-gray-500">Location</div>
                            {inlineEdit.location ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="text"
                                        value={inlineValues.country}
                                        onChange={(e) => setInlineValues(prev => ({ ...prev, country: e.target.value }))}
                                        placeholder="Country"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        value={inlineValues.city}
                                        onChange={(e) => setInlineValues(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder="City"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={() => handleInlineSave('location')}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleInlineCancel('location')}
                                        className="px-2 py-1 text-gray-500 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : userData.country ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm sm:text-base text-gray-900 font-medium">{userData.country}{userData.city ? `, ${userData.city}` : ''}</span>
                                    <button
                                        onClick={() => handleInlineEdit('location')}
                                        className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleInlineEdit('location')}
                                    className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                                >
                                    Tap to add your location
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm text-gray-500">Website</div>
                            {inlineEdit.website ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="url"
                                        value={inlineValues.website}
                                        onChange={(e) => setInlineValues(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://yourwebsite.com"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleInlineSave('website')}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleInlineCancel('website')}
                                        className="px-2 py-1 text-gray-500 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : userData.website ? (
                                <div className="flex items-center space-x-2">
                                    <a
                                        href={userData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm sm:text-base cursor-pointer"
                                    >
                                        <span>{userData.website.replace(/^https?:\/\//, '')}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <button
                                        onClick={() => handleInlineEdit('website')}
                                        className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleInlineEdit('website')}
                                    className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                                >
                                    Tap to add your website
                                </button>
                            )}
                        </div>
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center space-x-3">
                        <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm text-gray-500">GitHub</div>
                            {inlineEdit.github ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="url"
                                        value={inlineValues.github}
                                        onChange={(e) => setInlineValues(prev => ({ ...prev, github: e.target.value }))}
                                        placeholder="https://github.com/username"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleInlineSave('github')}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleInlineCancel('github')}
                                        className="px-2 py-1 text-gray-500 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : userData.github ? (
                                <a
                                    href={userData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm sm:text-base cursor-pointer"
                                >
                                    <span>@{userData.github.split('/').pop()}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleInlineEdit('github');
                                        }}
                                        className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        title="Edit"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleInlineEdit('github')}
                                    className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                                >
                                    Tap to add your GitHub account
                                </button>
                            )}
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex items-center space-x-3">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <div className="flex-1">
                            <div className="text-xs sm:text-sm text-gray-500">LinkedIn</div>
                            {inlineEdit.linkedin ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="url"
                                        value={inlineValues.linkedin}
                                        onChange={(e) => setInlineValues(prev => ({ ...prev, linkedin: e.target.value }))}
                                        placeholder="https://linkedin.com/in/username"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleInlineSave('linkedin')}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleInlineCancel('linkedin')}
                                        className="px-2 py-1 text-gray-500 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : userData.linkedin ? (
                                <a
                                    href={userData.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm sm:text-base cursor-pointer"
                                >
                                    <span>LinkedIn Profile</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleInlineEdit('linkedin');
                                        }}
                                        className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        title="Edit"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleInlineEdit('linkedin')}
                                    className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                                >
                                    Tap to add your LinkedIn account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Languages & Certifications - Standard Design */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Languages */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                        <button
                            onClick={() => onEditModal('languages', {})}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>
                    {userData.languages && userData.languages.length > 0 ? (
                        <div className="space-y-3">
                            {userData.languages.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-900 font-medium">{lang.name}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${lang.level === 'Native' ? 'bg-green-100 text-green-800' :
                                        lang.level === 'Fluent' ? 'bg-blue-100 text-blue-800' :
                                            lang.level === 'Conversational' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {lang.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-gray-500 mb-2">Add languages you speak</p>
                            <button
                                onClick={() => onEditModal('languages', {})}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                            >
                                Add languages
                            </button>
                        </div>
                    )}
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                        <button
                            onClick={() => onEditModal('certifications', {})}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>
                    {userData.certifications && userData.certifications.length > 0 ? (
                        <div className="space-y-4">
                            {userData.certifications.map((cert, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-500">{cert.year}</span>
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer"
                                            >
                                                View Credential
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-gray-500 mb-2">Showcase your certifications</p>
                            <button
                                onClick={() => onEditModal('certifications', {})}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                            >
                                Add certifications
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
