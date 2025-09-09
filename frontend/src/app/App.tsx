import { Routes, Route } from "react-router"
import Upload from "../pages/Upload"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<div>Hello World</div>} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/upload" element={<Upload />} />
        </Routes>
    )
}