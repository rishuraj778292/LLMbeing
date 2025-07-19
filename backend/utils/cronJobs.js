import cron from 'node-cron';
import { autoRejectExpiredApplications } from '../controllers/application.controller.js';
import Application from '../models/application.model.js';
import User from '../models/user.model.js';

// Auto-reject expired applications daily at 2 AM
const scheduleAutoRejectApplications = () => {
    cron.schedule('0 2 * * *', async () => {
        try {
            console.log('Running auto-reject expired applications job...');

            const expiredApplications = await Application.find({
                status: 'pending',
                autoRejectDate: { $lte: new Date() }
            });

            if (expiredApplications.length > 0) {
                // Update expired applications to auto_rejected
                await Application.updateMany(
                    {
                        status: 'pending',
                        autoRejectDate: { $lte: new Date() }
                    },
                    {
                        status: 'auto_rejected',
                        rejectedAt: new Date(),
                        clientMessage: 'Application automatically rejected after 3 months of inactivity'
                    }
                );

                // Remove from users' applied projects arrays (hybrid storage cleanup)
                for (const application of expiredApplications) {
                    await User.findByIdAndUpdate(application.freelancer, {
                        $pull: { appliedProjects: application.project }
                    });
                }

                console.log(`✅ Auto-rejected ${expiredApplications.length} expired applications`);
            } else {
                console.log('✅ No expired applications found');
            }
        } catch (error) {
            console.error('❌ Error in auto-reject applications job:', error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });

    console.log('📅 Auto-reject applications cron job scheduled (daily at 2 AM UTC)');
};

// Cleanup old rejected applications (older than 1 year) - runs monthly
const scheduleCleanupOldApplications = () => {
    cron.schedule('0 3 1 * *', async () => {
        try {
            console.log('Running cleanup old applications job...');

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            const result = await Application.deleteMany({
                status: { $in: ['rejected', 'auto_rejected', 'withdrawn'] },
                rejectedAt: { $lte: oneYearAgo }
            });

            console.log(`✅ Cleaned up ${result.deletedCount} old applications`);
        } catch (error) {
            console.error('❌ Error in cleanup old applications job:', error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });

    console.log('📅 Cleanup old applications cron job scheduled (monthly on 1st at 3 AM UTC)');
};

// Start all cron jobs
const startCronJobs = () => {
    scheduleAutoRejectApplications();
    scheduleCleanupOldApplications();
    console.log('🚀 All cron jobs started successfully');
};

export { startCronJobs };
