// Centralized route definitions for navigation
import { Home, Upload, MessageCircle, BarChart } from "lucide-react";

export const ROUTES = [
	{
		path: "/",
		label: "Home",
		icon: Home,
	},
	{
		path: "/upload",
		label: "Upload",
		icon: Upload,
	},
	{
		path: "/query",
		label: "Query",
		icon: MessageCircle,
	},
	{
		path: "/metrics",
		label: "Metrics",
		icon: BarChart,
	},
];
