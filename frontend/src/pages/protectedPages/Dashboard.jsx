import React, { useState, useEffect } from 'react';
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
  Target
} from 'lucide-react';

const Dashboard = () => {
  const [userType, setUserType] = useState('freelancer'); // 'freelancer' or 'client'
  const [dashboardData, setDashboardData] = useState({
    freelancer: {
      profile: {
        name: 'Sarah Johnson',
        rating: 4.9,
        completedProjects: 127,
        earnings: 89500
      },
      stats: {
        activeProposals: 8,
        unreadMessages: 12,
        ongoingProjects: 3,
        totalEarnings: 89500
      },
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
  });

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
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project, isClient = false }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
        {isClient && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            project.status === 'Active' ? 'bg-green-100 text-green-800' :
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === 'freelancer' 
              ? `Hello, ${currentData.profile.name}! Ready to tackle your next AI project?`
              : `Welcome back, ${currentData.profile.name}! Let's match your next AI project with the right expert.`
            }
          </h2>
          <div className="flex gap-4 mt-6">
            {userType === 'freelancer' ? (
              <>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Projects
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Update Portfolio
                </button>
              </>
            ) : (
              <>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post New Project
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Browse Freelancers
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userType === 'freelancer' ? (
            <>
              <StatCard
                icon={FileText}
                title="Active Proposals"
                value={currentData.stats.activeProposals}
                change="+2 this week"
              />
              <StatCard
                icon={MessageSquare}
                title="Unread Messages"
                value={currentData.stats.unreadMessages}
                change="+5 new"
                color="green"
              />
              <StatCard
                icon={Briefcase}
                title="Ongoing Projects"
                value={currentData.stats.ongoingProjects}
                change="1 completing soon"
                color="purple"
              />
              <StatCard
                icon={DollarSign}
                title="Total Earnings"
                value={`$${currentData.stats.totalEarnings.toLocaleString()}`}
                change="+12% this month"
                color="green"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={Briefcase}
                title="Active Projects"
                value={currentData.stats.activeProjects}
                change="+1 this week"
              />
              <StatCard
                icon={FileText}
                title="Total Proposals"
                value={currentData.stats.totalProposals}
                change="+15 new"
                color="green"
              />
              <StatCard
                icon={Award}
                title="Completed Projects"
                value={currentData.stats.completedProjects}
                change="+3 this month"
                color="purple"
              />
              <StatCard
                icon={Target}
                title="Avg Project Value"
                value={`$${currentData.stats.avgProjectValue.toLocaleString()}`}
                change="+8% increase"
                color="green"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {userType === 'freelancer' ? 'Recommended Projects' : 'Projects Overview'}
                </h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View All
                  </button>
                </div>
              </div>
              <div className="grid gap-6">
                {currentData.projects.map(project => (
                  <ProjectCard key={project.id} project={project} isClient={userType === 'client'} />
                ))}
              </div>
            </section>

            {/* Client-specific Proposals Section */}
            {userType === 'client' && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Proposals</h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {currentData.proposals.map(proposal => (
                    <div key={proposal.id} className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{proposal.freelancer}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{proposal.rating}</span>
                              <span>•</span>
                              <span>{proposal.experience}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{proposal.budget}</p>
                          <p className="text-sm text-gray-600">{proposal.timeline}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{proposal.proposal}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {proposal.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Accept & Hire
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recommended Freelancers (Client) or Learning Hub (Freelancer) */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {userType === 'freelancer' ? 'Learning Hub' : 'Recommended Freelancers'}
              </h3>
              {userType === 'freelancer' ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {currentData.learningContent.map((content, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{content}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.recommendedFreelancers.map(freelancer => (
                    <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                  ))}
                </div>
              )}
            </section>

            {/* Insights & Tips for Clients */}
            {userType === 'client' && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Insights & Tips</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {currentData.insights.map((insight, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{insight}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

  );
};

export default Dashboard;