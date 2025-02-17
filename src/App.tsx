import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import EventDetails from './pages/EventDetails';
import { WalletProvider } from './hooks/useWallet';
import { EventsProvider } from './hooks/useEvents';

function App() {
  return (
    <WalletProvider>
      <EventsProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 transition-colors pt-16">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/events" element={<Home />} />
                    <Route path="/create" element={<CreateEvent />} />
                    <Route path="/my-tickets" element={<MyTickets />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="*" element={<Navigate to="/events" replace />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </EventsProvider>
    </WalletProvider>
  );
}

export default App