import React from 'react';
import { QrCode, Calendar, MapPin } from 'lucide-react';

function MyTickets() {
  // Mock data - will be replaced with contract data
  const tickets = [
    {
      id: 1,
      eventName: "ETH Global London 2025",
      date: "2025-03-15",
      location: "London, UK",
      ticketId: "#1234",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      eventName: "Web3 Summit Berlin",
      date: "2025-04-20",
      location: "Berlin, Germany",
      ticketId: "#5678",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">My Tickets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={ticket.image}
                alt={ticket.eventName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white mb-2">{ticket.eventName}</h3>
                <div className="flex items-center space-x-4 text-gray-200">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{ticket.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{ticket.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Ticket ID</p>
                <p className="text-white font-medium">{ticket.ticketId}</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <QrCode className="w-4 h-4" />
                <span>View QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets