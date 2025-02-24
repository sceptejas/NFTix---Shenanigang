import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useWallet } from '../hooks/useWallet';

function MyHostedEvents() {
  const { account } = useWallet();
  const { getHostedEvents } = useEvents();
  const hostedEvents = getHostedEvents(account);

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Connect your wallet to view your hosted events</h2>
      </div>
    );
  }

  if (hostedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No hosted events yet</h2>
        <Link
          to="/create"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Create your first event
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white">My Hosted Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {hostedEvents.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative h-40 sm:h-48">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {event.price} ETH
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{event.name}</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{event.available} of {event.maxSupply} available</span>
                </div>
              </div>
              <div className="pt-2 sm:pt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${((event.maxSupply - event.available) / event.maxSupply) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyHostedEvents;