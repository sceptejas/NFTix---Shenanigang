import React from 'react';
import { Calendar, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useWallet } from '../hooks/useWallet';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function MyTickets() {
  const { tickets, events, toggleResale, isResaleActive, verifyTicket, isTicketVerified } = useEvents();
  const { account } = useWallet();

  const handleVerify = async (ticketId: string, gateAddress: string) => {
    try {
      // In production, this would verify the ticket with the gate's address
      verifyTicket(ticketId);
      toast.success('Ticket verified successfully!');
    } catch (error) {
      console.error('Error verifying ticket:', error);
      toast.error('Failed to verify ticket');
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Connect your wallet to view your tickets</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">My Tickets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => {
          const event = events.find(e => e.id === ticket.eventId);
          if (!event) return null;

          return (
            <div
              key={ticket.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <Link to={`/event/${event.id}`}>
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-200">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">Ticket {ticket.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleResale(ticket.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isResaleActive(ticket.id)
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isResaleActive(ticket.id) ? 'Deactivate Resale' : 'Activate Resale'}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleVerify(ticket.id, event.gateAddress || '')}
                    disabled={isTicketVerified(ticket.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isTicketVerified(ticket.id)
                        ? 'bg-green-600 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isTicketVerified(ticket.id) ? 'Verified' : 'Verify at Gate'}</span>
                  </button>
                </div>

                {isResaleActive(ticket.id) && (
                  <p className="text-green-400 text-sm">
                    Resale is active - This ticket will appear in the resale section
                  </p>
                )}
                {isTicketVerified(ticket.id) && (
                  <p className="text-green-400 text-sm">
                    Ticket has been verified at the gate
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyTickets;