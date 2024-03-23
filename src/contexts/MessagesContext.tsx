import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Status } from '@/consts/Status';
import { Ticket } from '@/types/ticket';

interface TicketContextProps {
  tickets: Ticket[];
  getTicketsByStatus: (status: Status) => Ticket[];
  addTicket: (ticket: Ticket) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  updateTicket: (id: string, ticket: Ticket) => Promise<void>;
  respondToTicket: (id: string, responseToTicket: string) => Promise<void>;
}

const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tickets` || '');
        console.log(response.data);
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const getTicketsByStatus = (status: Status) =>
    tickets.filter((ticket) => ticket.status === status);

  const addTicket = async (ticket: Ticket) => {
    try {
      console.log(ticket);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/tickets`, ticket);
      setTickets([...tickets, response.data]);
    } catch (error) {
      console.error('Failed to add ticket:', error);
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tickets/${id}`);
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const updateTicket = async (id: string, updatedTicket: Ticket) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tickets/${id}`,
        updatedTicket
      );
      setTickets(tickets.map((ticket) => (ticket.id === id ? response.data : ticket)));
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const respondToTicket = async (id: string, responseToTicket: string) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/tickets/${id}/response`, {
        responseToTicket,
      });
      setTickets(tickets.map((ticket) => (ticket.id === id ? response.data : ticket)));
    } catch (error) {
      console.error('Failed to respond to ticket:', error);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        getTicketsByStatus,
        addTicket,
        deleteTicket,
        updateTicket,
        respondToTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
