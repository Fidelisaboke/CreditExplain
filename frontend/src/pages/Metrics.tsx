import React from "react";
import LatencyChart, { type LatencyData } from "@/components/metrics/LatencyChart";
import PrecisionChart, { type PrecisionData } from "@/components/metrics/PrecisionChart";
import ReflectionChart, { type ReflectionScores } from "@/components/metrics/ReflectionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Timer, Gauge, TrendingUp } from "lucide-react";

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
 * Responsive, themed, and modular. Uses ShadCN UI and lucide-react icons.
 */
const MetricsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex justify-center items-start px-2 py-6 md:px-8">
            {/*
                Use a max-w-screen-xl container to prevent excessive stretching on large screens/zoom out.
                Center the content for better readability and maintain responsive design.
            */}
            <div className="w-full max-w-screen-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <BarChart className="w-8 h-8 text-primary" /> Metrics Dashboard
                </h1>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-card shadow">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <Timer className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Avg Latency</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{summary.avgLatency} ms</CardContent>
                    </Card>
                    <Card className="bg-card shadow">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <Gauge className="w-5 h-5 text-accent" />
                            <CardTitle className="text-lg">Latest Precision</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{Math.round(summary.latestPrecision * 100)}%</CardContent>
                    </Card>
                    <Card className="bg-card shadow">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Avg Reflection</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{summary.latestReflection}</CardContent>
                    </Card>
                </div>
                {/* Metrics Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Latency Metrics */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                            <Timer className="w-5 h-5 text-primary" /> Latency Metrics
                        </h2>
                        <LatencyChart data={mockData.latency} />
                    </section>
                    {/* Citation Precision */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-accent">
                            <Gauge className="w-5 h-5 text-accent" /> Citation Precision
                        </h2>
                        <PrecisionChart data={mockData.citation_precision} />
                    </section>
                </div>
                {/* Reflection Scores */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="w-5 h-5 text-muted-foreground" /> Reflection Scores
                    </h2>
                    <ReflectionChart data={mockData.reflection_scores} />
                </section>
            </div>
        </div>
    );
};

export default MetricsPage;
