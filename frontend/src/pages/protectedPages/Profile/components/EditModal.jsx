import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    updateProfile,
    addLanguage,
    addCertification,
    addPortfolioItem,
    addExperience,
    addEducation,
    getProfile
} from '../../../../../Redux/Slice/profileSlice';

// Input components defined outside to prevent re-renders
const InputField = ({ type = "text", placeholder, field, value, onChange, className = "", ...props }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${className}`}
        {...props}
    />
);

const TextAreaField = ({ placeholder, field, value, onChange, rows = 4, ...props }) => (
    <textarea
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        rows={rows}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
        {...props}
    />
);

const SelectField = ({ field, value, onChange, children, ...props }) => (
    <select
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        {...props}
    >
        {children}
    </select>
);

const EditModal = ({ isOpen, section, formData, setFormData, onClose }) => {
    const dispatch = useDispatch();

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, [setFormData]);

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            switch (section) {
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
                    console.log(`Saving ${section} changes...`);
            }

            onClose();
            dispatch(getProfile());
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const getModalContent = () => {
        switch (section) {
            case 'profile':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Edit Profile</h3>
                        <div className="space-y-3">
                            <InputField placeholder="Full Name" field="fullName" value={formData.fullName} onChange={handleInputChange} />
                            <InputField placeholder="Professional Title" field="professionalTitle" value={formData.professionalTitle} onChange={handleInputChange} />
                            <InputField placeholder="Phone Number" field="phone" value={formData.phone} onChange={handleInputChange} />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField placeholder="Country" field="country" value={formData.country} onChange={handleInputChange} />
                                <InputField placeholder="City" field="city" value={formData.city} onChange={handleInputChange} />
                            </div>
                            <InputField type="url" placeholder="Website URL" field="website" value={formData.website} onChange={handleInputChange} />
                            <InputField type="number" placeholder="Hourly Rate (USD)" field="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} />
                            <InputField type="url" placeholder="GitHub URL" field="github" value={formData.github} onChange={handleInputChange} />
                            <InputField type="url" placeholder="LinkedIn URL" field="linkedin" value={formData.linkedin} onChange={handleInputChange} />
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                        <p className="text-sm text-gray-500">Add skills that showcase your expertise and help clients find you.</p>
                    </div>
                );

            case 'languages':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Add Language</h3>
                        <div className="space-y-3">
                            <InputField placeholder="Language (e.g., English, Spanish)" field="name" value={formData.name} onChange={handleInputChange} />
                            <SelectField field="level" value={formData.level} onChange={handleInputChange}>
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
                            <InputField placeholder="Certification Name" field="name" value={formData.name} onChange={handleInputChange} />
                            <InputField placeholder="Issuing Organization" field="issuer" value={formData.issuer} onChange={handleInputChange} />
                            <InputField type="number" placeholder="Year Obtained" field="year" value={formData.year} onChange={handleInputChange} />
                            <InputField placeholder="Credential ID (Optional)" field="credentialId" value={formData.credentialId} onChange={handleInputChange} />
                            <InputField type="url" placeholder="Credential URL (Optional)" field="credentialUrl" value={formData.credentialUrl} onChange={handleInputChange} />
                        </div>
                    </div>
                );

            case 'phone':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Add Phone Number</h3>
                        <InputField type="tel" placeholder="Enter your phone number" field="phone" value={formData.phone} onChange={handleInputChange} />
                        <p className="text-sm text-gray-500">Adding a phone number helps build trust with clients.</p>
                    </div>
                );

            case 'portfolio':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Add Project</h3>
                        <div className="space-y-3">
                            <InputField placeholder="Project Title" field="title" value={formData.title} onChange={handleInputChange} />
                            <TextAreaField placeholder="Project Description" field="description" value={formData.description} rows={4} onChange={handleInputChange} />
                            <InputField placeholder="Technologies Used (comma separated)" field="technologies" value={formData.technologies} onChange={handleInputChange} />
                            <InputField type="url" placeholder="Project URL (optional)" field="projectUrl" value={formData.projectUrl} onChange={handleInputChange} />
                            <InputField type="url" placeholder="GitHub Repository (optional)" field="githubUrl" value={formData.githubUrl} onChange={handleInputChange} />
                            <SelectField field="category" value={formData.category || 'Personal Project'} onChange={handleInputChange}>
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
                            <InputField placeholder="Job Title" field="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                            <InputField placeholder="Company Name" field="company" value={formData.company} onChange={handleInputChange} />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField type="date" placeholder="Start Date" field="startDate" value={formData.startDate} onChange={handleInputChange} />
                                <InputField
                                    type="date"
                                    placeholder="End Date"
                                    field="endDate"
                                    value={formData.endDate}
                                    disabled={formData.current}
                                    className={formData.current ? "disabled:bg-gray-100" : ""}
                                    onChange={handleInputChange}
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
                            <TextAreaField placeholder="Job Description and Achievements" field="description" value={formData.description} rows={4} onChange={handleInputChange} />
                        </div>
                    </div>
                );

            case 'education':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Add Education</h3>
                        <div className="space-y-3">
                            <InputField placeholder="Degree/Qualification" field="degree" value={formData.degree} onChange={handleInputChange} />
                            <InputField placeholder="Institution Name" field="institution" value={formData.institution} onChange={handleInputChange} />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField type="number" placeholder="Start Year" field="startYear" value={formData.startYear} onChange={handleInputChange} />
                                <InputField type="number" placeholder="End Year" field="endYear" value={formData.endYear} onChange={handleInputChange} />
                            </div>
                            <InputField placeholder="Grade/GPA (optional)" field="grade" value={formData.grade} onChange={handleInputChange} />
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
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
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

export default EditModal;
