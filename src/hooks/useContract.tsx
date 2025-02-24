import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import TicketingSFTAbi from '../contracts/TicketingSFT.json';
import { toast } from 'react-hot-toast';

const CONTRACT_ADDRESS = ''; // TODO: Add your deployed contract address

export function useContract() {
  const { signer, provider } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider && signer) {
      const ticketingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        TicketingSFTAbi,
        signer
      );
      setContract(ticketingContract);
    }
  }, [provider, signer]);

  const createEvent = async (
    name: string,
    maxSupply: number,
    price: string,
    maxResalePrice: string
  ) => {
    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const priceInWei = ethers.parseEther(price);
      const maxResalePriceInWei = ethers.parseEther(maxResalePrice);

      const tx = await contract.createEvent(
        name,
        maxSupply,
        priceInWei,
        maxResalePriceInWei
      );
      await tx.wait();

      toast.success('Event created successfully!');
      return tx;
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  const purchaseTicket = async (eventId: number, amount: number, price: string) => {
    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const totalPrice = ethers.parseEther(price).mul(amount);
      const tx = await contract.purchaseTicket(eventId, amount, {
        value: totalPrice,
      });
      await tx.wait();

      toast.success('Tickets purchased successfully!');
      return tx;
    } catch (error: any) {
      console.error('Error purchasing ticket:', error);
      toast.error(error.message || 'Failed to purchase ticket');
    }
  };

  const listTicketForResale = async (
    eventId: number,
    tokenId: number,
    price: string
  ) => {
    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.listTicketForResale(eventId, tokenId, priceInWei);
      await tx.wait();

      toast.success('Ticket listed for resale!');
      return tx;
    } catch (error: any) {
      console.error('Error listing ticket:', error);
      toast.error(error.message || 'Failed to list ticket');
    }
  };

  const purchaseResaleTicket = async (
    eventId: number,
    tokenId: number,
    seller: string,
    price: string
  ) => {
    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.purchaseResaleTicket(eventId, tokenId, seller, {
        value: priceInWei,
      });
      await tx.wait();

      toast.success('Resale ticket purchased successfully!');
      return tx;
    } catch (error: any) {
      console.error('Error purchasing resale ticket:', error);
      toast.error(error.message || 'Failed to purchase resale ticket');
    }
  };

  const getEventDetails = async (eventId: number) => {
    if (!contract) return null;

    try {
      const event = await contract.events(eventId);
      return {
        name: event.name,
        maxSupply: event.maxSupply.toNumber(),
        price: ethers.formatEther(event.price),
        resaleAllowed: event.resaleAllowed,
        maxResalePrice: ethers.formatEther(event.maxResalePrice),
        isActive: event.isActive,
      };
    } catch (error) {
      console.error('Error fetching event details:', error);
      return null;
    }
  };

  return {
    contract,
    createEvent,
    purchaseTicket,
    listTicketForResale,
    purchaseResaleTicket,
    getEventDetails,
  };
}