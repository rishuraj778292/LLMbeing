import { useMemo } from 'react';

export const useProfileData = (profile) => {
    return useMemo(() => {
        if (!profile) return null;

        return {
            // Basic Info
            name: profile?.fullName || '',
            userName: profile?.userName || '',
            email: profile?.email || '',
            role: profile?.role || 'freelancer',
            avatar: profile?.profileImage || null,

            // Contact & Location
            phone: profile?.phone || null,
            country: profile?.country || null,
            city: profile?.city || null,

            // Professional Info
            title: profile?.professionalTitle || (profile?.role === 'freelancer' ? 'Freelancer' : 'Client'),
            bio: profile?.bio || null,
            skills: profile?.skills || [],
            hourlyRate: profile?.hourlyRate || null,

            // Social Links
            website: profile?.website || null,
            github: profile?.github || null,
            linkedin: profile?.linkedin || null,
            twitter: profile?.twitter || null,

            // Stats
            joinDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            }) : 'Recently joined',
            rating: profile?.averageRating || null,
            totalReviews: profile?.totalReviews || profile?.reviewCount || 0,
            totalEarnings: profile?.totalEarnings || null,
            completedProjects: profile?.completedProjects || 0,
            successRate: profile?.successRate || null,

            // Additional Info
            languages: profile?.languages || [],
            certifications: profile?.certifications || [],
            experience: profile?.experience || [],
            education: profile?.education || [],
            portfolio: profile?.portfolio || [],

            // Verification status
            isEmailVerified: profile?.isEmailVerified || false,
            isPhoneVerified: profile?.isPhoneVerified || false,
            isProfileVerified: profile?.isProfileVerified || false,

            // Additional computed fields
            fullName: profile?.fullName,
            professionalTitle: profile?.professionalTitle,
        };
    }, [profile]);
};
