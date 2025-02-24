// TicketingSFT - Smart Contract Overview

// This is an ERC1155-based SFT (Semi-Fungible Token) contract for event ticketing with the following key features:

// 1. Event Management
//    - Create events with names, supply limits, and pricing
//    - Each event has a unique ID that frontend must track
//    - Events can be activated/deactivated by the owner

// 2. Ticket Purchasing
//    - Users can purchase tickets by sending ETH to the contract
//    - Frontend should calculate correct ETH amount (eventPrice * quantity)
//    - Excess ETH is automatically refunded

// 3. Resale Marketplace
//    - Owner can enable/disable resale for specific events
//    - Users can list tickets with custom prices (up to maxResalePrice)
//    - Buyers can purchase resale tickets directly from sellers
//    - Payments are handled automatically by the contract

// 4. Entry Verification
//    - Multiple methods to validate tickets at event entrance:
//      a) verifyTicketEntry: Gate verifies and takes ownership
//      b) validateTicket: Gate verifies without transfer
//      c) verifyMyTicket: Self-verification by attendee
//    - Each ticket has a unique ID and can only be used once

// 5. Administrative Functions
//    - Owner can manage entry gates (authorize/revoke)
//    - Owner can withdraw contract balance
//    - Owner can deactivate events

// Frontend Integration Notes:
// - Track event IDs returned from createEvent()
// - Handle ETH transactions for purchases
// - Implement ticket listing UI with proper price validation
// - Track ticket ownership using balanceOf()
// - Implement verification flow based on your entry system needs
// - Consider implementing events (emit) for real-time updates
