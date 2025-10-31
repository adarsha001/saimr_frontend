// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import FeaturedProperties from "./pages/FeaturedProperties";
import AddProperty from "./pages/AddProperty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { LikesProvider } from "./context/LikesContext"; // Import LikesProvider
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute  from "./components/AdminRoute";  // Import AdminRoute
import Home from "./container/Home";
import { ViewModeProvider } from "./context/ViewModeContext";

// Admin Pages
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminProperties from "./components/AdminProperties";
// import AdminProperties from "./pages/admin/AdminProperties";
// import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <AuthProvider>
      <LikesProvider> {/* Wrap with LikesProvider */}
        <ViewModeProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home/>} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/featured" element={<FeaturedProperties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-property"
                element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
             <Route
  path="/admin/properties"
  element={
    <AdminRoute>
      <AdminProperties />
    </AdminRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsers />
    </AdminRoute>
  }
/>
            </Routes>
          </BrowserRouter>
        </ViewModeProvider>
      </LikesProvider>
    </AuthProvider>
  );
}