import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';

const ReviewsTab = ({ userData }) => {
    const [filter, setFilter] = useState('all');
    const [expandedReviews, setExpandedReviews] = useState(new Set());

    const toggleReviewExpansion = (reviewIndex) => {
        const newExpanded = new Set(expandedReviews);
        if (newExpanded.has(reviewIndex)) {
            newExpanded.delete(reviewIndex);
        } else {
            newExpanded.add(reviewIndex);
        }
        setExpandedReviews(newExpanded);
    };

    // Mock reviews data for display purposes
    const reviews = userData.reviews || [];
    const stats = {
        average: userData.rating || 0,
        total: reviews.length || 0,
        distribution: {
            5: reviews.filter(r => r.rating === 5).length || 0,
            4: reviews.filter(r => r.rating === 4).length || 0,
            3: reviews.filter(r => r.rating === 3).length || 0,
            2: reviews.filter(r => r.rating === 2).length || 0,
            1: reviews.filter(r => r.rating === 1).length || 0,
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        if (filter === 'recent') return new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (filter === 'high') return review.rating >= 4;
        return false;
    });

    const renderStars = (rating, size = 'sm') => {
        const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Reviews & Ratings Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reviews & Ratings</h3>
                    {reviews.length > 0 && (
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('recent')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'recent'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Recent
                            </button>
                            <button
                                onClick={() => setFilter('high')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'high'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                4+ Stars
                            </button>
                        </div>
                    )}
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {/* Rating Summary */}
                        <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{stats.average.toFixed(1)}</div>
                                <div className="flex justify-center mt-1">{renderStars(Math.round(stats.average))}</div>
                                <div className="text-sm text-gray-500 mt-1">{stats.total} reviews</div>
                            </div>
                            <div className="flex-1">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center space-x-2 mb-1">
                                        <span className="text-sm text-gray-600 w-6">{rating}</span>
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{
                                                    width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-8">{stats.distribution[rating]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {filteredReviews.map((review, index) => {
                                const isExpanded = expandedReviews.has(index);
                                const shouldTruncate = review.comment && review.comment.length > 150;

                                return (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{review.clientName || 'Anonymous'}</p>
                                                    <div className="flex items-center space-x-2">
                                                        {renderStars(review.rating)}
                                                        <span className="text-sm text-gray-500">
                                                            <Calendar className="w-3 h-3 inline mr-1" />
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {review.projectTitle && (
                                            <p className="text-sm text-blue-600 font-medium mb-2">
                                                Project: {review.projectTitle}
                                            </p>
                                        )}

                                        {review.comment && (
                                            <div>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {shouldTruncate && !isExpanded
                                                        ? `${review.comment.substring(0, 150)}...`
                                                        : review.comment
                                                    }
                                                </p>
                                                {shouldTruncate && (
                                                    <button
                                                        onClick={() => toggleReviewExpansion(index)}
                                                        className="text-blue-600 hover:text-blue-700 text-xs mt-1"
                                                    >
                                                        {isExpanded ? 'Show less' : 'Read more'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-2">No reviews yet</p>
                        <p className="text-gray-400 text-sm">Complete projects to start receiving reviews from clients</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;
