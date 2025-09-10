import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, FileText, Search, BarChart, Lightbulb, CheckCircle, Upload } from "lucide-react";

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            {/* Hero Section */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 mb-6">
                        <Shield className="w-4 h-4 mr-2" />
                        AI-Powered Compliance Intelligence
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
                        Understand Regulatory Decisions with <span className="text-blue-600">Clarity & Confidence</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-200 mb-10 max-w-2xl mx-auto">
                        CreditExplain helps compliance officers uncover the "why" behind regulatory decisions with transparent explanations, actionable citations, and audit-ready documentation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 py-4">
                            <Link to="/query">
                                Start Querying <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                            <Link to="/upload">
                                Upload Documents <Upload className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-white dark:bg-black">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How CreditExplain Transforms Compliance Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-fit mb-4">
                                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-200" />
                                </div>
                                <CardTitle>Document Intelligence</CardTitle>
                                <CardDescription>Ingest and analyze regulatory documents, audit reports, and model cards with precision</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mb-4">
                                    <Search className="h-8 w-8 text-green-600 dark:text-green-200" />
                                </div>
                                <CardTitle>Adaptive Query Processing</CardTitle>
                                <CardDescription>SELF-RAG loop retrieves, reranks, critiques, and generates transparent explanations</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-fit mb-4">
                                    <BarChart className="h-8 w-8 text-purple-600 dark:text-purple-200" />
                                </div>
                                <CardTitle>Actionable Insights</CardTitle>
                                <CardDescription>Get explanations with citations and ranked follow-up questions for deeper exploration</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full w-fit mb-4">
                                    <Shield className="h-8 w-8 text-red-600 dark:text-red-200" />
                                </div>
                                <CardTitle>PII Protection</CardTitle>
                                <CardDescription>Automatic redaction of sensitive information with comprehensive audit logging</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full w-fit mb-4">
                                    <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-200" />
                                </div>
                                <CardTitle>Transparent Explanations</CardTitle>
                                <CardDescription>Understand the "why" behind decisions with clear reasoning and source attribution</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-fit mb-4">
                                    <CheckCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-200" />
                                </div>
                                <CardTitle>Compliance Ready</CardTitle>
                                <CardDescription>Reflection scores and metrics provide audit trails for regulatory compliance</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 px-4 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
                    <p className="text-gray-600 dark:text-gray-200 text-center mb-12 max-w-2xl mx-auto">
                        CreditExplain's SELF-RAG process ensures accurate, well-reasoned responses with full transparency
                    </p>

                    <div className="flex flex-col md:flex-row justify-between items-center relative">
                        <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
                            <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mb-4">1</div>
                            <h3 className="font-semibold mb-2">Upload Documents</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-200">Add regulatory PDFs, audit reports, and model cards</p>
                        </div>

                        <div className="hidden md:block">
                            <ArrowRight className="h-8 w-8 text-gray-400" />
                        </div>

                        <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
                            <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mb-4">2</div>
                            <h3 className="font-semibold mb-2">Ask Questions</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-200">Query the system about regulations, decisions, or requirements</p>
                        </div>

                        <div className="hidden md:block">
                            <ArrowRight className="h-8 w-8 text-gray-400" />
                        </div>

                        <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
                            <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mb-4">3</div>
                            <h3 className="font-semibold mb-2">Get Explanations</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-200">Receive answers with citations, context, and follow-up questions</p>
                        </div>

                        <div className="hidden md:block">
                            <ArrowRight className="h-8 w-8 text-gray-400" />
                        </div>

                        <div className="flex flex-col items-center text-center md:w-1/4">
                            <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mb-4">4</div>
                            <h3 className="font-semibold mb-2">Review Metrics</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-200">Analyze performance, reflection scores, and audit trails</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Get Started Now</h2>
                    <p className="text-gray-600 dark:text-gray-200 mb-10">Jump right into exploring regulatory documents or check out system performance</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ROUTES.filter(route => route.path !== "/").map((route) => (
                            <Card key={route.path} className="hover:shadow-md transition-shadow border-2 border-transparent dark:bg-slate-950 hover:border-blue-200 dark:hover:border-blue-800">
                                <CardContent className="pt-6">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-fit mx-auto mb-4">
                                        <route.icon className="h-6 w-6 text-blue-600 dark:text-blue-200" />
                                    </div>
                                    <CardTitle className="text-lg mb-2">{route.label}</CardTitle>
                                    <Button asChild variant="outline" className="mt-4 dark:border-gray-800">
                                        <Link to={route.path}>Explore</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Compliance Process?</h2>
                    <p className="text-blue-100 mb-8 text-lg">
                        Join leading financial institutions using CreditExplain to navigate regulatory complexity with confidence
                    </p>
                    <Button asChild size="lg" variant="secondary" className="text-lg">
                        <Link to="/query">
                            Start Exploring Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default HomePage;