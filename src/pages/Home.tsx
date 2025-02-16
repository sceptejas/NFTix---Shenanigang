import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  // Mock data - will be replaced with contract data
  const events = [
    {
      id: 1,
      name: "ETH Global London 2025",
      date: "2025-03-15",
      location: "London, UK",
      price: "0.1",
      available: 150,
      maxSupply: 500,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      name: "Web3 Summit Berlin",
      date: "2025-04-20",
      location: "Berlin, Germany",
      price: "0.05",
      available: 200,
      maxSupply: 1000,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
        <div className="flex space-x-4">
          <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
            <option>All Categories</option>
            <option>Conferences</option>
            <option>Concerts</option>
            <option>Sports</option>
          </select>
          <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
            <option>Sort by Date</option>
            <option>Sort by Price</option>
            <option>Sort by Availability</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full">
                {event.price} ETH
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">{event.name}</h3>
              <div className="space-y-2 text-gray-300">
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
              <div className="pt-4">
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

export default Home