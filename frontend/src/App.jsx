// App.jsx
import React from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import HeroSection from "./pages/HeroSecotion";
import MyProfile from "./pages/MyProfile";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AddMemory from "./pages/AddMemory";
import { MemoryProvider } from "./context/MemoryContext";
import Search from "./pages/Search";
import Memory from "./pages/Memory";
import Developers from "./pages/Developers";
import Feedback from "./pages/Feedback";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}
function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const location = useLocation();
  const { token } = useAuth();

  return (
    <>
      <Navbar />
      <div className="mt-18">
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            {/* Root: hero if guest, home if logged in */}
            <Route path="/" element={token ? <Home /> : <HeroSection />} />

            {/* Public pages: only for guests */}
            <Route
              path="/developers"
              element={
                // <PrivateRoute>
                  <Developers />
                // </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupForm />
                </PublicRoute>
              }
            />

            {/* Protected pages */}
            <Route
              path="/my-profile"
              element={
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <AddMemory />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/search/:id"
              element={
                <PrivateRoute>
                  <Memory />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MemoryProvider>
        <AppContent />
      </MemoryProvider>
    </BrowserRouter>
  );
}
