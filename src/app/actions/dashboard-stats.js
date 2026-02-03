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

            let totalRevenue = 0;
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
                        totalRevenue += amount;
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

            // 5. Trending Data Calculation (This Month vs Last Month)
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            // Fetch counts for specific ranges
            const [
                currentMonthReceipts,
                lastMonthReceipts,
                currentMonthUsers,
                lastMonthUsers,
                currentMonthCompanyStats,
                lastMonthCompanyStats
            ] = await Promise.all([
                // Receipts
                receiptsCollection.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
                receiptsCollection.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),

                // Users
                usersCollection.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
                usersCollection.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),

                // Company Stats (Current Month)
                receiptsCollection.aggregate([
                    { $match: { createdAt: { $gte: startOfCurrentMonth } } },
                    { $group: { _id: "$companyType", count: { $sum: 1 } } }
                ]).toArray(),

                // Company Stats (Last Month)
                receiptsCollection.aggregate([
                    { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
                    { $group: { _id: "$companyType", count: { $sum: 1 } } }
                ]).toArray()
            ]);

            // Helper to calculate trend
            const calculateTrend = (current, previous) => {
                if (previous === 0) {
                    return current > 0 ? { value: "+100%", direction: "up" } : { value: "0%", direction: "neutral" };
                }
                const change = ((current - previous) / previous) * 100;
                return {
                    value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
                    direction: change >= 0 ? "up" : "down"
                };
            };

            // Map Company Stats to Object for easier lookup
            const mapStats = (statsArr) => {
                const map = { GLOBAL: 0, FEDERAL: 0, TAKAFUL: 0 };
                statsArr.forEach(s => { if (s._id) map[s._id] = s.count; });
                return map;
            };

            const currCompMap = mapStats(currentMonthCompanyStats);
            const prevCompMap = mapStats(lastMonthCompanyStats);

            const trends = {
                totalReceipts: calculateTrend(currentMonthReceipts, lastMonthReceipts),
                totalUsers: calculateTrend(currentMonthUsers, lastMonthUsers),
                GLOBAL: calculateTrend(currCompMap.GLOBAL, prevCompMap.GLOBAL),
                FEDERAL: calculateTrend(currCompMap.FEDERAL, prevCompMap.FEDERAL),
                TAKAFUL: calculateTrend(currCompMap.TAKAFUL, prevCompMap.TAKAFUL),
            };

            return {
                success: true,
                data: {
                    totalReceipts,
                    totalUsers,
                    companyCounts,
                    totalRevenue,
                    revenueChartData,
                    recentReceipts: serializedRecentReceipts,
                    trends, // Return calculated trends
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
