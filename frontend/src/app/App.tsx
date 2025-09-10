import { Routes, Route } from "react-router"
import Upload from "@/pages/Upload"
import Query from "@/pages/Query"
import MetricsPage from "@/pages/Metrics"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<div>Hello World</div>} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/query" element={<Query />} />
            <Route path="/metrics" element={<MetricsPage />} />
        </Routes>
    )
}