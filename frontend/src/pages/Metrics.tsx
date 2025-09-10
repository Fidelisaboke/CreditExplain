// MetricsPage.tsx
import React from "react";
import LatencyChart, { type LatencyData } from "@/components/metrics/LatencyChart";
import PrecisionChart, { type PrecisionData } from "@/components/metrics/PrecisionChart";
import ReflectionChart, { type ReflectionScores } from "@/components/metrics/ReflectionChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Timer, Calendar, Download, Activity, Target, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data (TODO: replace with API integration later)
const mockData: {
    latency: LatencyData;
    citation_precision: PrecisionData;
    reflection_scores: ReflectionScores;
    timestamp: string;
} = {
    latency: {
        min_ms: 120,
        avg_ms: 300,
        max_ms: 600,
        percentile_ms: {
            p50: 290,
            p75: 350,
            p90: 450,
            p99: 580,
        },
    },
    citation_precision: {
        p_at_5: 0.8,
        p_at_10: 0.75,
    },
    reflection_scores: {
        ISREL: [0.9, 0.85, 0.95, 0.8, 0.87],
        ISSUP: [0.7, 0.75, 0.72, 0.78, 0.74],
        ISUSE: [0.65, 0.6, 0.62, 0.58, 0.61],
    },
    timestamp: "2025-09-09T10:00:00Z",
};

// Utility for summary cards
const summary: {
    avgLatency: number;
    minLatency: number;
    maxLatency: number;
    latestPrecision: number;
    latestReflection: string;
} = {
    avgLatency: mockData.latency.avg_ms,
    minLatency: mockData.latency.min_ms,
    maxLatency: mockData.latency.max_ms,
    latestPrecision: mockData.citation_precision.p_at_5,
    latestReflection: (
        (mockData.reflection_scores.ISREL[mockData.reflection_scores.ISREL.length - 1] +
            mockData.reflection_scores.ISSUP[mockData.reflection_scores.ISSUP.length - 1] +
            mockData.reflection_scores.ISUSE[mockData.reflection_scores.ISUSE.length - 1]) /
        3
    ).toFixed(2),
};

/**
 * MetricsPage visualizes RAG metrics: latency, citation precision, and reflection scores.
 * Enhanced with professional styling and additional functionality.
 */
const MetricsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <BarChart className="w-8 h-8 text-blue-600" /> Performance Metrics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Monitor system performance, citation accuracy, and reflection scores for audit and optimization.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Last updated: {new Date(mockData.timestamp).toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Avg Latency</CardTitle>
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{summary.avgLatency} ms</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Min: {summary.minLatency}ms • Max: {summary.maxLatency}ms
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Citation Precision</CardTitle>
                            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{Math.round(summary.latestPrecision * 100)}%</div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                P@5: {Math.round(mockData.citation_precision.p_at_5 * 100)}% • P@10: {Math.round(mockData.citation_precision.p_at_10 * 100)}%
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Avg Reflection Score</CardTitle>
                            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{summary.latestReflection}</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                ISREL: {(mockData.reflection_scores.ISREL.slice(-1)[0] * 100).toFixed(0)}% • 
                                ISSUP: {(mockData.reflection_scores.ISSUP.slice(-1)[0] * 100).toFixed(0)}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Metrics Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Latency Metrics */}
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Timer className="w-5 h-5 text-blue-600" /> Latency Metrics
                            </CardTitle>
                            <CardDescription>
                                Response time statistics showing minimum, average, maximum and percentile latencies
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LatencyChart data={mockData.latency} />
                        </CardContent>
                    </Card>
                    
                    {/* Citation Precision */}
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="w-5 h-5 text-green-600" /> Citation Precision
                            </CardTitle>
                            <CardDescription>
                                Precision at different retrieval levels measuring citation accuracy
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PrecisionChart data={mockData.citation_precision} />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Reflection Scores */}
                <Card className="shadow-lg border-0 mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Brain className="w-5 h-5 text-purple-600" /> Reflection Scores
                        </CardTitle>
                        <CardDescription>
                            SELF-RAG reflection metrics tracking relevance, support, and usefulness over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReflectionChart data={mockData.reflection_scores} />
                    </CardContent>
                </Card>

                {/* Additional Metrics Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" /> Additional Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-white dark:bg-slate-950 border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Query Volume</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">142</div>
                                <p className="text-xs text-gray-500">Today</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-slate-950 border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents Processed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">28</div>
                                <p className="text-xs text-gray-500">Total</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-slate-950 border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">PII Redactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</div>
                                <p className="text-xs text-gray-500">This week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-slate-950 border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">99.8%</div>
                                <p className="text-xs text-gray-500">Last 30 days</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPage;