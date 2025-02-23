import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

function Home() {
  const { events } = useEvents();

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
            className="bg-gray-900/70 backdrop-blur-md rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="relative h-56">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-md">
                {event.price} ETH
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-white">{event.name}</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span>
                    {event.available} of {event.maxSupply} available
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    style={{
                      width: `${
                        ((event.maxSupply - event.available) /
                          event.maxSupply) *
                        100
                      }%`,
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

export default Home;
