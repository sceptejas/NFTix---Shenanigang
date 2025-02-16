import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Info } from 'lucide-react';

function EventDetails() {
  const { id } = useParams();

  // Mock data - will be replaced with contract data
  const event = {
    id: 1,
    name: "ETH Global London 2025",
    date: "2025-03-15",
    time: "09:00",
    location: "London, UK",
    price: "0.1",
    available: 150,
    maxSupply: 500,
    description: "Join us for the biggest Ethereum event in London! Connect with developers, entrepreneurs, and enthusiasts from around the world. Experience three days of intensive learning, building, and networking.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl font-bold text-white mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About Event</h2>
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
            <div className="aspect-video bg-gray-700 rounded-lg">
              {/* Map will be added here */}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 sticky top-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price</span>
                <span className="text-2xl font-bold text-white">{event.price} ETH</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-300">
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
                  <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32">
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-gray-300">tickets</span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Purchase Tickets
                </button>
              </div>

              <div className="pt-4">
                <div className="flex items-start space-x-2 text-sm text-gray-400">
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

export default EventDetails