import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Wallet, ChevronDown, ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useWallet } from '../hooks/useWallet';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { account, connectWallet, disconnectWallet } = useWallet();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700 dark:bg-blue-600' : 'hover:bg-blue-800 dark:hover:bg-blue-700';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <Link to="/events" className="flex items-center space-x-2">
              <img src="https://i.imgur.com/C2cutQL.png" alt="NFTix Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">NFTix</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-montserrat"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isOpen && (
                <div className="dropdown-menu">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-montserrat">
                    Conferences
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-montserrat">
                    Concerts
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-montserrat">
                    Sports
                  </a>
                </div>
              )}
            </div>
            
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
            
            <ThemeToggle />
            
            {account ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-montserrat">
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
      </div>
    </nav>
  );
}

export default Navbar;