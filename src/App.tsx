import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import MyHostedEvents from './pages/MyHostedEvents';
import { WalletProvider } from './hooks/useWallet';
import { EventsProvider } from './hooks/useEvents';

function App() {
  return (
    <WalletProvider>
      <EventsProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="container mx-auto px-4 py-24">
                    <Routes>
                      <Route path="/events" element={<Home />} />
                      <Route path="/create" element={<CreateEvent />} />
                      <Route path="/event/:id" element={<EventDetails />} />
                      <Route path="/my-tickets" element={<MyTickets />} />
                      <Route path="/my-hosted-events" element={<MyHostedEvents />} />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
          <Toaster position="bottom-right" />
        </div>
      </EventsProvider>
    </WalletProvider>
  );
}

export default App;