import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Wallet, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700 dark:bg-blue-600' : 'hover:bg-blue-800 dark:hover:bg-blue-700';
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/events" className="flex items-center space-x-2">
            <img src="https://i.imgur.com/C2cutQL.png" alt="NFTix Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">NFTix</span>
          </Link>
          
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
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-montserrat">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;