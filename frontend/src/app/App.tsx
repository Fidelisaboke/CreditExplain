import { Routes, Route } from "react-router"
import HomePage from "@/pages/Home"
import UploadPage from "@/pages/Upload"
import Query from "@/pages/Query"
import MetricsPage from "@/pages/Metrics"
import Layout from "@/components/Layout"
import { ThemeProvider } from "@/providers/ThemeProvider"

export default function App() {
    return (
        <ThemeProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/query" element={<Query />} />
                    <Route path="/metrics" element={<MetricsPage />} />
                </Route>
            </Routes>
        </ThemeProvider>
    )
}