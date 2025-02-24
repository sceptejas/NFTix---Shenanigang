import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Info, Tag } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useEvents } from '../hooks/useEvents';
import { toast } from 'react-hot-toast';

function EventDetails() {
  const { id } = useParams();
  const { account, connectWallet } = useWallet();
  const { getEventById, tickets, isResaleActive } = useEvents();
  const [ticketCount, setTicketCount] = useState(1);

  const event = getEventById(Number(id));

  // Filter tickets for this event that are active for resale
  const resaleTickets = tickets
    .filter(ticket => ticket.eventId === Number(id) && isResaleActive(ticket.id))
    .map(ticket => ({
      id: ticket.id,
      price: "0.12", // This would come from the contract in production
      seller: "0x1234...5678" // This would come from the contract in production
    }));

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!account) {
      toast.error('Please connect your wallet to purchase tickets');
      connectWallet();
      return;
    }

    try {
      toast.loading('Processing purchase...');
      // Contract interaction will be added here
      toast.success('Tickets purchased successfully!');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase tickets');
    }
  };

  const handleResalePurchase = async (ticketId: string, price: string) => {
    if (!account) {
      toast.error('Please connect your wallet to purchase tickets');
      connectWallet();
      return;
    }

    try {
      toast.loading(`Processing purchase of ticket ${ticketId}...`);
      // Contract interaction for resale purchase will be added here
      toast.success('Resale ticket purchased successfully!');
    } catch (error) {
      console.error('Resale purchase error:', error);
      toast.error('Failed to purchase resale ticket');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6">
      <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-200 text-sm sm:text-base">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">About Event</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{event.description}</p>
          </div>

          {resaleTickets.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Resale Tickets</h2>
              <div className="space-y-4">
                {resaleTickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <Tag className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Ticket {ticket.id}</p>
                        <p className="text-gray-400 text-sm">Seller: {ticket.seller}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-white font-medium">{ticket.price} ETH</p>
                      <button
                        onClick={() => handleResalePurchase(ticket.id, ticket.price)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Location</h2>
            <div className="aspect-video bg-gray-700 rounded-lg">
              {/* Map will be added here */}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 sticky top-20 sm:top-24">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price</span>
                <span className="text-xl sm:text-2xl font-bold text-white">{event.price} ETH</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>Available tickets</span>
                  <span>{event.available} of {event.maxSupply}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${((event.maxSupply - event.available) / event.maxSupply) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <select 
                    className="bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 sm:w-32 text-sm"
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-gray-300 text-sm">tickets</span>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {account ? 'Purchase Tickets' : 'Connect Wallet to Purchase'}
                </button>
              </div>

              <div className="pt-4">
                <div className="flex items-start space-x-2 text-xs sm:text-sm text-gray-400">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Tickets are non-refundable. Please make sure to verify all details before purchasing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;