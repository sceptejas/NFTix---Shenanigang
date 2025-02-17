import { createContext, useContext, useState, ReactNode } from 'react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
  maxSupply: number;
  available: number;
  image: string;
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'available'>) => void;
}

const EventsContext = createContext<EventsContextType>({
  events: [],
  addEvent: () => {},
});

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
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
    },
    {
      id: 2,
      name: "Web3 Summit Berlin",
      date: "2025-04-20",
      time: "10:00",
      location: "Berlin, Germany",
      price: "0.05",
      available: 200,
      maxSupply: 1000,
      description: "Experience the future of Web3 in Berlin. Connect with industry leaders and innovators.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000"
    }
  ]);

  const addEvent = (newEvent: Omit<Event, 'id' | 'available'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        ...newEvent,
        id: prevEvents.length + 1,
        available: Number(newEvent.maxSupply)
      }
    ]);
  };

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);