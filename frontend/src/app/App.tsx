import { Routes, Route } from "react-router"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<div>Hello World</div>} />
            <Route path="/about" element={<div>About Page</div>} />
        </Routes>
    )
}