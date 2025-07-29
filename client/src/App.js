// App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { useState } from "react";

// Move AdminWrapper here
function AdminWrapper({ isAdmin, setIsAdmin }) {
  const [adminTokenInput, setAdminTokenInput] = useState("");
  const ADMIN_TOKEN = "admin123";

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-xl font-bold">Enter Admin Token</h1>
      <input
        type="password"
        value={adminTokenInput}
        onChange={(e) => setAdminTokenInput(e.target.value)}
        className="p-2 mb-4 border rounded"
      />
      <button
        onClick={() => {
          if (adminTokenInput === ADMIN_TOKEN) {
            setIsAdmin(true);
          } else {
            alert("Invalid token");
            setAdminTokenInput("");
          }
        }}
        className="px-4 py-2 text-white bg-blue-600 rounded"
      >
        Submit
      </button>
    </div>
  );
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 px-8 bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:underline">JobApp</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={<AdminWrapper isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
