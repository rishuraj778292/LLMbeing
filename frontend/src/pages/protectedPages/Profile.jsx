import React, { useState } from 'react';
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
  Github,
  Linkedin,
  Twitter,
  ExternalLink
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: 'John Doe',
    title: 'Full Stack Developer',
    avatar: null,
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 2023',
    rating: 4.8,
    totalReviews: 124,
    totalEarnings: 45280,
    completedProjects: 67,
    successRate: 98,
    bio: 'Experienced full-stack developer with 5+ years of expertise in React, Node.js, Python, and cloud technologies. Passionate about creating scalable web applications and delivering high-quality solutions.',
    skills: [
      'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB',
      'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Express.js', 'Next.js'
    ],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Conversational' },
      { name: 'French', level: 'Basic' }
    ],
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
      { name: 'React Developer Certification', issuer: 'Meta', year: '2022' },
      { name: 'Node.js Application Developer', issuer: 'OpenJS Foundation', year: '2022' }
    ],
    socialLinks: {
      website: 'https://johndoe.dev',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    recentProjects: [
      {
        title: 'E-commerce Platform Redesign',
        client: 'TechCorp Inc.',
        budget: '$5,000',
        duration: '6 weeks',
        rating: 5,
        status: 'Completed'
      },
      {
        title: 'Mobile App Backend Development',
        client: 'StartupXYZ',
        budget: '$3,500',
        duration: '4 weeks',
        rating: 5,
        status: 'Completed'
      },
      {
        title: 'Data Analytics Dashboard',
        client: 'Analytics Pro',
        budget: '$4,200',
        duration: '5 weeks',
        rating: 4,
        status: 'Completed'
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'portfolio', label: 'Portfolio' }
  ];

  const StatCard = ({ icon: Icon, label, value, subtext }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-600">{label}</p>
          {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Star}
                label="Average Rating"
                value={user.rating}
                subtext={`${user.totalReviews} reviews`}
              />
              <StatCard
                icon={Briefcase}
                label="Projects Completed"
                value={user.completedProjects}
                subtext={`${user.successRate}% success rate`}
              />
              <StatCard
                icon={DollarSign}
                label="Total Earnings"
                value={`$${user.totalEarnings.toLocaleString()}`}
              />
              <StatCard
                icon={Clock}
                label="Member Since"
                value={user.joinDate}
              />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">About</h3>
              <p className="text-slate-700 leading-relaxed">{user.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Languages</h3>
                <div className="space-y-3">
                  {user.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-slate-700">{lang.name}</span>
                      <span className="text-sm text-slate-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Certifications</h3>
                <div className="space-y-3">
                  {user.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{cert.name}</p>
                        <p className="text-xs text-slate-600">{cert.issuer} • {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Recent Projects</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {user.recentProjects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-slate-900">{project.title}</h4>
                      <p className="text-slate-600">Client: {project.client}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      {project.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Budget</p>
                      <p className="font-medium text-slate-900">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Duration</p>
                      <p className="font-medium text-slate-900">{project.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Rating</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-slate-900">{project.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Reviews</h3>
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Reviews will be displayed here once available.</p>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio</h3>
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Portfolio items will be displayed here.</p>
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                  Add Portfolio Item
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-lg text-slate-600 mb-2">{user.title}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{user.rating} ({user.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>

                {/* Contact & Social Links */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <a href={`mailto:${user.email}`} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                  <a href={user.socialLinks.website} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                  <a href={user.socialLinks.github} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a href={user.socialLinks.linkedin} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <button className="mt-4 lg:mt-0 flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
    </div>
  );
};

export default Profile;