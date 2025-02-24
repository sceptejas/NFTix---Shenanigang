import React, { useState } from 'react';
import { Calendar, MapPin, Users, Music2, Trophy, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

function Home() {
  const { events } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showChatbot, setShowChatbot] = useState(false);
  const [eventIdInput, setEventIdInput] = useState('');
  const [recommendation, setRecommendation] = useState<any>(null);

  const getRecommendation = (eventId: string) => {
    const event = events.find(e => e.id === parseInt(eventId));
    if (!event) {
      return null;
    }

    // Simple recommendation logic based on event details
    const daysUntilEvent = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    const availabilityPercentage = (event.available / event.maxSupply) * 100;
    
    const recommendation = {
      recommendation: availabilityPercentage < 50 ? 'Strong Buy' : 'Buy',
      expected_roi: 99.99999900000002,
      risk_level: daysUntilEvent > 30 ? 'Low' : 'Medium',
      suggested_holding_period: '14 days before event',
      confidence_score: Math.min(100, Math.max(0, 100 - availabilityPercentage))
    };

    return recommendation;
  };

  const handleChatbotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rec = getRecommendation(eventIdInput);
    setRecommendation(rec);
  };

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'availability':
        return (b.available / b.maxSupply) - (a.available / a.maxSupply);
      default:
        return 0;
    }
  });

  const filteredEvents = selectedCategory === 'all' 
    ? sortedEvents 
    : sortedEvents.filter(event => event.category === selectedCategory);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Upcoming Events</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 w-full sm:w-auto">
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('conference')}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'conference'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Conferences</span>
            </button>
            <button
              onClick={() => setSelectedCategory('concert')}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'concert'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Music2 className="w-4 h-4" />
              <span>Concerts</span>
            </button>
            <button
              onClick={() => setSelectedCategory('sports')}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'sports'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Sports</span>
            </button>
          </div>
          <select 
            className="w-full sm:w-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredEvents.map((event) => (
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

      {/* Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Investment Assistant</h3>
            <button
              onClick={() => {
                setShowChatbot(false);
                setRecommendation(null);
                setEventIdInput('');
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={handleChatbotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Event ID
                </label>
                <input
                  type="number"
                  value={eventIdInput}
                  onChange={(e) => setEventIdInput(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Get Recommendation
              </button>
            </form>

            {recommendation && (
              <div className="mt-4 space-y-3 bg-gray-700/50 rounded-lg p-4">
                <div>
                  <span className="text-gray-300">Recommendation:</span>
                  <span className="ml-2 text-green-400 font-semibold">{recommendation.recommendation}</span>
                </div>
                <div>
                  <span className="text-gray-300">Expected ROI:</span>
                  <span className="ml-2 text-white">{recommendation.expected_roi.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-gray-300">Risk Level:</span>
                  <span className="ml-2 text-white">{recommendation.risk_level}</span>
                </div>
                <div>
                  <span className="text-gray-300">Holding Period:</span>
                  <span className="ml-2 text-white">{recommendation.suggested_holding_period}</span>
                </div>
                <div>
                  <span className="text-gray-300">Confidence Score:</span>
                  <span className="ml-2 text-white">{recommendation.confidence_score}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;