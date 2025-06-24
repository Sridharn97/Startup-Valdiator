import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import IdeaDetails from './pages/IdeaDetails';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
       <Routes>
  <Route path="/" element={
    <AdminRoute>
      <Home />
    </AdminRoute>
  } />
  <Route path="/ideas/:id" element={<IdeaDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } />
  <Route path="/admin" element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  } />
  <Route path="*" element={<NotFound />} />
</Routes>

      </main>
      <Footer />
    </div>
  );
}

export default App;