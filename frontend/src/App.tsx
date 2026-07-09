import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
