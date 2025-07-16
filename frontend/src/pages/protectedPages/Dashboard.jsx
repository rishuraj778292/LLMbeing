import React, { useEffect } from 'react';
import ProfileCompletionBanner from '../../components/ProfileCompletionBanner';
import {
  User,
  Search,
  Bell,
  Settings,
  Plus,
  Eye,
  MessageSquare,
  Star,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Briefcase,
  Mail,
  ChevronRight,
  Filter,
  Calendar,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const userType = user?.role || 'freelancer'; // freelancer, client, admin

  // Mock data - will be replaced with Redux/API calls
  const dashboardData = {
    freelancer: {
      profile: {
        name: user?.userName || 'John Doe',
        rating: 4.9,
        completedProjects: 127,
        earnings: 89500,
        responseTime: '< 1 hour',
        successRate: 98
      },
      stats: {
        activeProposals: 8,
        unreadMessages: 12,
        ongoingProjects: 3,
        totalEarnings: 89500,
        thisMonthEarnings: 12750,
        pendingPayments: 3200,
        profileViews: 245
      },
      recentActivity: [
        { type: 'project_completed', title: 'AI Chatbot Development', amount: 5000, time: '2 hours ago' },
        { type: 'proposal_sent', title: 'E-commerce Website', time: '4 hours ago' },
        { type: 'message_received', title: 'New message from TechCorp', time: '6 hours ago' },
        { type: 'payment_received', title: 'Payment for Mobile App UI', amount: 2500, time: '1 day ago' }
      ],
      projects: [
        {
          id: 1,
          title: 'AI Chatbot Development for E-commerce',
          client: 'TechCorp Solutions',
          budget: '$5,000 - $8,000',
          timeline: '6 weeks',
          proposals: 15,
          skills: ['Python', 'TensorFlow', 'NLP'],
          posted: '2 days ago'
        },
        {
          id: 2,
          title: 'Computer Vision Model for Medical Imaging',
          client: 'HealthTech Inc.',
          budget: '$12,000 - $15,000',
          timeline: '8 weeks',
          proposals: 8,
          skills: ['Computer Vision', 'PyTorch', 'Medical AI'],
          posted: '1 day ago'
        },
        {
          id: 3,
          title: 'Natural Language Processing for Legal Documents',
          client: 'LegalAI Corp',
          budget: '$7,500 - $10,000',
          timeline: '5 weeks',
          proposals: 12,
          skills: ['NLP', 'BERT', 'Legal Tech'],
          posted: '3 days ago'
        }
      ],
      learningContent: [
        'How to write winning AI project proposals',
        'Latest trends in AI freelancing for 2025',
        'Optimizing your profile for client discovery',
        'Pricing strategies for AI consulting'
      ]
    },
    client: {
      profile: {
        name: 'Michael Chen',
        company: 'InnovateTech Ltd.',
        projectsPosted: 45,
        successRate: 94
      },
      stats: {
        activeProjects: 6,
        totalProposals: 89,
        completedProjects: 39,
        avgProjectValue: 8500
      },
      projects: [
        {
          id: 1,
          title: 'Machine Learning Model for Fraud Detection',
          status: 'Active',
          proposals: 23,
          budget: '$15,000',
          deadline: '2025-08-15',
          freelancer: 'Alex Rodriguez'
        },
        {
          id: 2,
          title: 'AI-Powered Recommendation System',
          status: 'In Review',
          proposals: 31,
          budget: '$12,000',
          deadline: '2025-07-30',
          freelancer: null
        },
        {
          id: 3,
          title: 'Deep Learning for Image Classification',
          status: 'Completed',
          proposals: 18,
          budget: '$8,500',
          deadline: '2025-06-20',
          freelancer: 'Emma Watson'
        }
      ],
      proposals: [
        {
          id: 1,
          freelancer: 'Sarah Johnson',
          rating: 4.9,
          experience: '5+ years',
          budget: '$14,500',
          timeline: '7 weeks',
          proposal: 'I have extensive experience in fraud detection systems...',
          skills: ['Machine Learning', 'Python', 'Scikit-learn']
        },
        {
          id: 2,
          freelancer: 'David Kim',
          rating: 4.8,
          experience: '4+ years',
          budget: '$13,200',
          timeline: '6 weeks',
          proposal: 'My approach to fraud detection involves...',
          skills: ['TensorFlow', 'Deep Learning', 'Anomaly Detection']
        }
      ],
      recommendedFreelancers: [
        {
          id: 1,
          name: 'Lisa Zhang',
          rating: 4.9,
          hourlyRate: 85,
          skills: ['AI/ML', 'Computer Vision', 'PyTorch'],
          completedProjects: 156,
          intro: 'AI specialist with focus on computer vision and deep learning applications.'
        },
        {
          id: 2,
          name: 'James Wilson',
          rating: 4.8,
          hourlyRate: 75,
          skills: ['NLP', 'LLMs', 'Python'],
          completedProjects: 92,
          intro: 'Natural Language Processing expert with experience in LLM fine-tuning.'
        }
      ],
      insights: [
        'How to write clear AI project requirements',
        'What budget is fair for your AI project?',
        'Effective ways to manage freelancers remotely',
        'Best practices for AI project scoping'
      ]
    }
  };

  // Simulate API call to fetch dashboard data
  useEffect(() => {
    // This would be replaced with actual API calls to your database
    const fetchDashboardData = async () => {
      try {
        // Example API structure:
        // const response = await fetch(`/api/dashboard/${userType}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const data = await response.json();
        // setDashboardData(prev => ({ ...prev, [userType]: data }));

        console.log('Fetching dashboard data for:', userType);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [userType]);

  const currentData = dashboardData[userType];

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          {Icon && <Icon className={`h-6 w-6 text-${color}-600`} />}
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project, isClient = false }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
        {isClient && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-800' :
            project.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
            {project.status}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {!isClient && (
          <>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Client:</span> {project.client}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {project.budget}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {project.timeline}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.proposals} proposals
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {isClient && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium">{project.budget}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Proposals:</span>
              <span className="font-medium">{project.proposals}</span>
            </div>
            {project.freelancer && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Freelancer:</span>
                <span className="font-medium text-blue-600">{project.freelancer}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          {isClient ? 'View Details' : 'Apply Now'}
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          {isClient ? 'Edit' : 'Save'}
        </button>
      </div>
    </div>
  );

  const FreelancerCard = ({ freelancer }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{freelancer.rating}</span>
              <span className="text-sm text-gray-500">({freelancer.completedProjects} projects)</span>
            </div>
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900">${freelancer.hourlyRate}/hr</span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{freelancer.intro}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {freelancer.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Invite to Project
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Completion Banner */}
          <ProfileCompletionBanner />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {userType === 'freelancer'
                  ? `Welcome back, ${currentData.profile.name}!`
                  : `Dashboard - ${currentData.profile.name}`
                }
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {userType === 'freelancer'
                  ? 'Ready to tackle your next AI project?'
                  : "Let's match your next AI project with the right expert."
                }
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {userType === 'freelancer' ? (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Find Projects</span>
                  </button>
                  <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    Update Profile
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Post Project</span>
                  </button>
                  <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    Browse Talent
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userType === 'freelancer' ? (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Proposals</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.activeProposals}</p>
                    <p className="text-sm text-green-600">+2 this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Unread Messages</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.unreadMessages}</p>
                    <p className="text-sm text-green-600">+5 new</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Ongoing Projects</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.ongoingProjects}</p>
                    <p className="text-sm text-slate-500">1 completing soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-slate-900">${currentData.stats.totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+12% this month</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Projects</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.activeProjects}</p>
                    <p className="text-sm text-green-600">+1 this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Proposals</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.totalProposals}</p>
                    <p className="text-sm text-green-600">+15 new</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Completed Projects</p>
                    <p className="text-2xl font-bold text-slate-900">{currentData.stats.completedProjects}</p>
                    <p className="text-sm text-green-600">+3 this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Avg Project Value</p>
                    <p className="text-2xl font-bold text-slate-900">${currentData.stats.avgProjectValue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+8% increase</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userType === 'freelancer' && currentData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {activity.type === 'project_completed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {activity.type === 'proposal_sent' && <FileText className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'message_received' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'payment_received' && <DollarSign className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                        {activity.amount && (
                          <p className="text-sm text-green-600 font-medium">+${activity.amount.toLocaleString()}</p>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {userType === 'freelancer' ? 'Recommended Projects' : 'Your Projects'}
                  </h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentData.projects.slice(0, 3).map(project => (
                    <div key={project.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-slate-900 text-base">{project.title}</h4>
                        {userType === 'client' && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-800' :
                            project.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                            {project.status}
                          </span>
                        )}
                      </div>

                      {userType === 'freelancer' && (
                        <>
                          <p className="text-sm text-slate-600 mb-3">
                            <span className="font-medium">Client:</span> {project.client}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{project.budget}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{project.timeline}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{project.proposals} proposals</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                      {userType === 'client' && (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Budget:</span>
                            <span className="font-medium">{project.budget}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Proposals:</span>
                            <span className="font-medium">{project.proposals}</span>
                          </div>
                          {project.freelancer && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Freelancer:</span>
                              <span className="font-medium text-blue-600">{project.freelancer}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          {userType === 'client' ? 'View Details' : 'Apply Now'}
                        </button>
                        <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                          {userType === 'client' ? 'Edit' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h3>
              <div className="space-y-4">
                {userType === 'freelancer' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{currentData.profile.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Completed Projects</span>
                      <span className="font-medium">{currentData.profile.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="font-medium">{currentData.profile.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Response Time</span>
                      <span className="font-medium">{currentData.profile.responseTime}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Company</span>
                      <span className="font-medium">{currentData.profile.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Projects Posted</span>
                      <span className="font-medium">{currentData.profile.projectsPosted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="font-medium">{currentData.profile.successRate}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {userType === 'freelancer' ? (
                  <>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <Search className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Browse Projects</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Update Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Messages</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <Plus className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Post New Project</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <Search className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Browse Freelancers</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Messages</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Learning Hub / Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {userType === 'freelancer' ? 'Learning Hub' : 'Tips & Insights'}
              </h3>
              <div className="space-y-3">
                {(userType === 'freelancer' ? currentData.learningContent : currentData.insights).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <span className="text-sm text-slate-700">{item}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;