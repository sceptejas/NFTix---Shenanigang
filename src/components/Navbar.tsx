import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Wallet, ArrowLeft, Menu, X, CalendarCheck } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { account, connectWallet, disconnectWallet } = useWallet();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700 dark:bg-blue-600' : 'hover:bg-blue-800 dark:hover:bg-blue-700';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link to="/events" className="flex items-center space-x-2">
              <img src="https://i.imgur.com/C2cutQL.png" alt="NFTix Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold text-white font-montserrat">NFTix</span>
            </Link>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat ${isActive('/create')}`}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>
            
            <Link
              to="/my-tickets"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat ${isActive('/my-tickets')}`}
            >
              <Wallet className="w-4 h-4" />
              <span>My Tickets</span>
            </Link>

            {account && (
              <Link
                to="/my-hosted-events"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat ${isActive('/my-hosted-events')}`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>My Events</span>
              </Link>
            )}
            
            {account ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 font-montserrat">
                  {formatAddress(account)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-montserrat text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-montserrat"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat w-full ${isActive('/create')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>
            
            <Link
              to="/my-tickets"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat w-full ${isActive('/my-tickets')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Wallet className="w-4 h-4" />
              <span>My Tickets</span>
            </Link>

            {account && (
              <Link
                to="/my-hosted-events"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors font-montserrat w-full ${isActive('/my-hosted-events')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>My Events</span>
              </Link>
            )}

            <div className="flex items-center justify-between py-2">
              {account ? (
                <div className="flex flex-col space-y-2 w-full">
                  <span className="text-sm text-gray-300 font-montserrat">
                    {formatAddress(account)}
                  </span>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-montserrat text-sm w-full"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-montserrat w-full"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;