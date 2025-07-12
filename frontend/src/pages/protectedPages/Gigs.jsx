import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Package
} from 'lucide-react';

const Gigs = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock gigs data
  const gigs = [
    {
      id: '1',
      title: 'I will develop a responsive React web application',
      description: 'Professional React development with modern best practices, responsive design, and clean code.',
      category: 'Web Development',
      price: 150,
      deliveryTime: 5,
      status: 'active',
      views: 234,
      impressions: 1250,
      clicks: 89,
      orders: 12,
      rating: 4.9,
      reviews: 28,
      image: null,
      tags: ['React', 'JavaScript', 'Responsive Design', 'Modern UI']
    },
    {
      id: '2',
      title: 'I will create custom Node.js backend APIs',
      description: 'RESTful API development with Node.js, Express, and database integration.',
      category: 'Backend Development',
      price: 200,
      deliveryTime: 7,
      status: 'active',
      views: 189,
      impressions: 980,
      clicks: 67,
      orders: 8,
      rating: 5.0,
      reviews: 15,
      image: null,
      tags: ['Node.js', 'Express', 'API', 'Database']
    },
    {
      id: '3',
      title: 'I will design modern UI/UX for mobile apps',
      description: 'User-centered design with modern aesthetics and intuitive user experience.',
      category: 'UI/UX Design',
      price: 120,
      deliveryTime: 4,
      status: 'paused',
      views: 156,
      impressions: 720,
      clicks: 43,
      orders: 5,
      rating: 4.7,
      reviews: 12,
      image: null,
      tags: ['UI/UX', 'Mobile Design', 'Figma', 'Prototyping']
    },
    {
      id: '4',
      title: 'I will provide Python data analysis and visualization',
      description: 'Comprehensive data analysis with interactive visualizations and insights.',
      category: 'Data Science',
      price: 180,
      deliveryTime: 6,
      status: 'draft',
      views: 0,
      impressions: 0,
      clicks: 0,
      orders: 0,
      rating: 0,
      reviews: 0,
      image: null,
      tags: ['Python', 'Data Analysis', 'Pandas', 'Matplotlib']
    }
  ];

  const tabs = [
    { id: 'active', label: 'Active', count: gigs.filter(g => g.status === 'active').length },
    { id: 'paused', label: 'Paused', count: gigs.filter(g => g.status === 'paused').length },
    { id: 'draft', label: 'Drafts', count: gigs.filter(g => g.status === 'draft').length },
    { id: 'analytics', label: 'Analytics', count: null }
  ];

  const filteredGigs = gigs.filter(gig => {
    const matchesTab = activeTab === 'analytics' || gig.status === activeTab;
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, trend }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
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
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'analytics') {
      const totalViews = gigs.reduce((sum, gig) => sum + gig.views, 0);
      const totalOrders = gigs.reduce((sum, gig) => sum + gig.orders, 0);
      const totalEarnings = gigs.reduce((sum, gig) => sum + (gig.orders * gig.price), 0);
      const activeGigs = gigs.filter(g => g.status === 'active').length;

      return (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={BarChart3}
              label="Total Views"
              value={totalViews.toLocaleString()}
              trend={12}
            />
            <StatCard
              icon={Package}
              label="Total Orders"
              value={totalOrders}
              trend={8}
            />
            <StatCard
              icon={DollarSign}
              label="Total Earnings"
              value={`$${totalEarnings.toLocaleString()}`}
              trend={15}
            />
            <StatCard
              icon={Star}
              label="Active Gigs"
              value={activeGigs}
            />
          </div>

          {/* Performance Table */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Gig Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gig</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {gigs.filter(g => g.status === 'active').map((gig) => (
                    <tr key={gig.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 truncate max-w-xs">{gig.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{gig.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{gig.clicks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{gig.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${(gig.orders * gig.price).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-500">{gig.rating || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredGigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Gig Image Placeholder */}
              <div className="w-full lg:w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-400" />
              </div>

              {/* Gig Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-slate-900 mb-1">{gig.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(gig.status)}`}>
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{gig.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {gig.tags.map((tag, index) => (
                    <span key={index} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${gig.price}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{gig.deliveryTime} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{gig.views} views</span>
                  </div>
                  {gig.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{gig.rating} ({gig.reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-2">
                <button className="flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredGigs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No gigs found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? "No gigs match your search criteria."
                : `You don't have any ${activeTab} gigs yet.`
              }
            </p>
            {activeTab !== 'analytics' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create New Gig
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Gigs</h1>
            <p className="text-slate-600">Manage your services and track performance</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create New Gig</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Search - Only show for gig tabs */}
          {activeTab !== 'analytics' && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Gigs;