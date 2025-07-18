import React from 'react';

const StatCard = ({ icon: Icon, label, value, subtext, isEmpty = false }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${isEmpty ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                    <Icon className={`w-6 h-6 ${isEmpty ? 'text-gray-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                    {isEmpty ? (
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">{label}</p>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                                <span>No data yet</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            <p className="text-sm text-gray-600">{label}</p>
                            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
