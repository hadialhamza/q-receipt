"use server";

import { getDB, COLLECTIONS, count } from "@/lib/db/helpers";
import { unstable_cache } from "next/cache";

/**
 * Get dashboard statistics (Cached)
 */
export const getDashboardStats = unstable_cache(
    async () => {
        try {
            const db = await getDB();
            const receiptsCollection = db.collection(COLLECTIONS.RECEIPTS);
            const usersCollection = db.collection(COLLECTIONS.USERS);

            // 1. Total Counts
            const totalReceipts = await count(COLLECTIONS.RECEIPTS);
            const totalUsers = await count(COLLECTIONS.USERS);

            // 2. Company Categorized Count
            const companyStats = await receiptsCollection.aggregate([
                {
                    $group: {
                        _id: "$companyType",
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();

            // Map to easier format
            const companyCounts = {
                GLOBAL: 0,
                FEDERAL: 0,
                TAKAFUL: 0,
            };
            companyStats.forEach((stat) => {
                if (stat._id && companyCounts.hasOwnProperty(stat._id)) {
                    companyCounts[stat._id] = stat.count;
                }
            });

            // 3. Revenue Chart Data
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

            // Fetch ONLY this year's lightweight docs for revenue calculation
            const yearReceipts = await receiptsCollection
                .find({
                    $or: [
                        { createdAt: { $gte: startOfYear, $lte: endOfYear } },
                        // Fallback check for string dates if necessary
                    ]
                }, {
                    projection: { total: 1, createdAt: 1 }
                })
                .toArray();

            const revenueByMonth = {};
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            months.forEach(m => revenueByMonth[m] = 0);

            yearReceipts.forEach(r => {
                try {
                    const d = new Date(r.createdAt);
                    if (!isNaN(d)) {
                        const m = months[d.getMonth()];
                        let amount = 0;
                        if (typeof r.total === 'number') {
                            amount = r.total;
                        } else if (typeof r.total === 'string') {
                            amount = parseFloat(r.total.replace(/[^0-9.-]+/g, "")) || 0;
                        }
                        if (m) revenueByMonth[m] += amount;
                    }
                } catch (e) { }
            });

            const revenueChartData = Object.keys(revenueByMonth).map(name => ({
                name,
                total: revenueByMonth[name]
            }));

            // 4. Recent Receipts
            const recentReceipts = await receiptsCollection
                .find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .toArray();

            const serializedRecentReceipts = recentReceipts.map(r => ({
                ...r,
                _id: r._id.toString(),
            }));

            return {
                success: true,
                data: {
                    totalReceipts,
                    totalUsers,
                    companyCounts,
                    revenueChartData,
                    recentReceipts: serializedRecentReceipts,
                },
            };
        } catch (error) {
            console.error("Dashboard stats error:", error);
            return {
                success: false,
                error: error.message || "Failed to fetch dashboard stats",
            };
        }
    },
    ["dashboard-stats"], // Cache key
    { tags: ["dashboard"], revalidate: 3600 } // Revalidate every hour by default (or when tag is purged)
);
