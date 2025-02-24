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
  maxResalePrice: string;
  available: number;
  image: string;
  creator: string | null;
  category?: string;
  gateAddress?: string;
}

interface Ticket {
  id: string;
  eventId: number;
  isResaleActive: boolean;
  isVerified?: boolean;
}

interface EventsContextType {
  events: Event[];
  tickets: Ticket[];
  addEvent: (event: Omit<Event, 'id' | 'available' | 'creator'>) => void;
  getEventById: (id: number) => Event | undefined;
  getHostedEvents: (address: string | null) => Event[];
  toggleResale: (ticketId: string) => void;
  isResaleActive: (ticketId: string) => boolean;
  verifyTicket: (ticketId: string) => void;
  isTicketVerified: (ticketId: string) => boolean;
}

const EventsContext = createContext<EventsContextType>({
  events: [],
  tickets: [],
  addEvent: () => {},
  getEventById: () => undefined,
  getHostedEvents: () => [],
  toggleResale: () => {},
  isResaleActive: () => false,
  verifyTicket: () => {},
  isTicketVerified: () => false,
});

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Coldplay concert",
      date: "2025-03-15",
      time: "09:00",
      location: "Ahmedabad, Gujarat",
      price: "0.1",
      maxResalePrice: "0.15",
      available: 150,
      maxSupply: 500,
      description:"Prepare to be swept away by a tidal wave of sound and light at a Coldplay concert!  From the moment they take the stage, the stadium explodes with energy.  Anthemic singalongs will have you raising your voice until it's hoarse, while dazzling light shows and synchronized wristbands paint the crowd in a breathtaking kaleidoscope of color. Expect soaring melodies, heartfelt lyrics that resonate with every soul present, and a euphoric atmosphere that feels less like a concert and more like a shared celebration of life, love, and music.  Chris Martin's captivating energy and the band's infectious positivity will leave you feeling utterly uplifted and buzzing long after the last note fades.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
      creator: "0x1234...5678",
      category: "concert",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 2,
      name: "Web3 Summit Berlin",
      date: "2025-04-20",
      time: "10:00",
      location: "Berlin, Germany",
      price: "0.05",
      maxResalePrice: "0.08",
      available: 200,
      maxSupply: 1000,
      description: "Experience the future of Web3 in Berlin. Connect with industry leaders and innovators.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
      creator: "0x9876...4321",
      category: "conference",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 3,
      name: "UEFA Champions League Final 2025",
      date: "2025-05-31",
      time: "20:45",
      location: "Allianz Arena, Munich",
      price: "0.5",
      maxResalePrice: "0.75",
      available: 500,
      maxSupply: 2000,
      description: "Experience the pinnacle of European club football as the continent's top teams battle for glory in the UEFA Champions League Final.",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000",
      creator: "0xabcd...efgh",
      category: "sports",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "T-001", eventId: 1, isResaleActive: false, isVerified: false },
    { id: "T-002", eventId: 1, isResaleActive: false, isVerified: false },
    { id: "T-003", eventId: 2, isResaleActive: false, isVerified: false },
  ]);

  const addEvent = (newEvent: Omit<Event, 'id' | 'available' | 'creator'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        ...newEvent,
        id: prevEvents.length + 1,
        available: Number(newEvent.maxSupply),
        creator: window.ethereum?.selectedAddress || null
      }
    ]);
  };

  const getEventById = (id: number) => {
    return events.find(event => event.id === id);
  };

  const getHostedEvents = (address: string | null) => {
    if (!address) return [];
    return events.filter(event => event.creator === address);
  };

  const toggleResale = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, isResaleActive: !ticket.isResaleActive }
          : ticket
      )
    );
  };

  const isResaleActive = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId)?.isResaleActive || false;
  };

  const verifyTicket = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, isVerified: true }
          : ticket
      )
    );
  };

  const isTicketVerified = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId)?.isVerified || false;
  };

  return (
    <EventsContext.Provider value={{ 
      events, 
      tickets, 
      addEvent, 
      getEventById, 
      getHostedEvents, 
      toggleResale,
      isResaleActive,
      verifyTicket,
      isTicketVerified
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);