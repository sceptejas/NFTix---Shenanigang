// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TicketingSFT is ERC1155Supply, Ownable, ReentrancyGuard {
    struct Event {
        string name;
        uint256 maxSupply;
        uint256 price;
        bool resaleAllowed;
        uint256 maxResalePrice;
        bool isActive;
        address entryGate;
        mapping(address => mapping(uint256 => uint256)) resalePrices;
        mapping(address => mapping(uint256 => bool)) isListed;
        mapping(uint256 => bool) usedTickets;
    }

    mapping(uint256 => Event) public events;
    mapping(address => bool) public authorizedEntryGates;
    uint256 public nextEventId;

    event EventCreated(uint256 indexed eventId, string name, uint256 maxSupply, uint256 price);
    event TicketPurchased(uint256 indexed eventId, address indexed buyer, uint256 amount);
    event TicketListed(uint256 indexed eventId, address indexed seller, uint256 tokenId, uint256 price);
    event TicketSold(uint256 indexed eventId, address indexed seller, address indexed buyer, uint256 tokenId, uint256 price);
    event EntryGateAdded(uint256 indexed eventId, address indexed entryGate);
    event EntryVerified(uint256 indexed eventId, uint256 indexed ticketId, address indexed attendee);

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}

    function createEvent(
        string memory _name,
        uint256 _maxSupply,
        uint256 _price,
        uint256 _maxResalePrice
    ) external onlyOwner returns (uint256) {
        require(_maxSupply > 0, "Max supply must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(_maxResalePrice >= _price, "Max resale price must be >= original price");

        uint256 eventId = nextEventId++;
        Event storage newEvent = events[eventId];
        newEvent.name = _name;
        newEvent.maxSupply = _maxSupply;
        newEvent.price = _price;
        newEvent.maxResalePrice = _maxResalePrice;
        newEvent.resaleAllowed = false;
        newEvent.isActive = true;

        emit EventCreated(eventId, _name, _maxSupply, _price);
        return eventId;
    }

    function purchaseTicket(uint256 _eventId, uint256 _amount) external payable nonReentrant {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.value >= event_.price * _amount, "Insufficient payment");
        require(totalSupply(_eventId) + _amount <= event_.maxSupply, "Exceeds max supply");
        
        _mint(msg.sender, _eventId, _amount, "");
        
        uint256 excess = msg.value - (event_.price * _amount);
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }

        emit TicketPurchased(_eventId, msg.sender, _amount);
    }

    function toggleResaleWindow(uint256 _eventId) external onlyOwner {
        require(events[_eventId].isActive, "Event does not exist");
        events[_eventId].resaleAllowed = !events[_eventId].resaleAllowed;
    }

    function listTicketForResale(
        uint256 _eventId,
        uint256 _tokenId,
        uint256 _price
    ) external {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(event_.resaleAllowed, "Resale not allowed");
        require(balanceOf(msg.sender, _eventId) > 0, "No ticket owned");
        require(_price <= event_.maxResalePrice, "Price exceeds maximum allowed");
        
        event_.resalePrices[msg.sender][_tokenId] = _price;
        event_.isListed[msg.sender][_tokenId] = true;

        emit TicketListed(_eventId, msg.sender, _tokenId, _price);
    }

    function purchaseResaleTicket(
        uint256 _eventId,
        uint256 _tokenId,
        address _seller
    ) external payable nonReentrant {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(event_.resaleAllowed, "Resale not allowed");
        require(event_.isListed[_seller][_tokenId], "Ticket not listed");
        require(balanceOf(_seller, _eventId) > 0, "Seller no longer owns ticket");
        
        uint256 price = event_.resalePrices[_seller][_tokenId];
        require(msg.value >= price, "Insufficient payment");
        
        safeTransferFrom(_seller, msg.sender, _eventId, 1, "");
        
        payable(_seller).transfer(price);
        
        uint256 excess = msg.value - price;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
        
        event_.isListed[_seller][_tokenId] = false;
        event_.resalePrices[_seller][_tokenId] = 0;

        emit TicketSold(_eventId, _seller, msg.sender, _tokenId, price);
    }

    function cancelListing(uint256 _eventId, uint256 _tokenId) external {
        Event storage event_ = events[_eventId];
        require(event_.isListed[msg.sender][_tokenId], "No active listing");
        
        event_.isListed[msg.sender][_tokenId] = false;
        event_.resalePrices[msg.sender][_tokenId] = 0;
    }

    // New functions for entry gate management and ticket verification

    function setEventEntryGate(uint256 _eventId, address _entryGate) external onlyOwner {
        require(events[_eventId].isActive, "Event is not active");
        authorizedEntryGates[_entryGate] = true;
        events[_eventId].entryGate = _entryGate;
        
        emit EntryGateAdded(_eventId, _entryGate);
    }
    
    function authorizeEntryGate(address _entryGate) external onlyOwner {
        authorizedEntryGates[_entryGate] = true;
    }
    
    function revokeEntryGate(address _entryGate) external onlyOwner {
        authorizedEntryGates[_entryGate] = false;
    }

    function verifyTicketEntry(uint256 _eventId, uint256 _ticketId) external {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(event_.entryGate == msg.sender || authorizedEntryGates[msg.sender], "Not authorized entry gate");
        require(balanceOf(tx.origin, _eventId) > 0, "No valid ticket owned");
        require(!event_.usedTickets[_ticketId], "Ticket already used");
        
        // Mark ticket as used to prevent reuse
        event_.usedTickets[_ticketId] = true;
        
        // Transfer ticket to entry gate (can be modified if you want to keep ownership with attendee)
        safeTransferFrom(tx.origin, msg.sender, _eventId, 1, "");
        
        emit EntryVerified(_eventId, _ticketId, tx.origin);
    }
    
    // Alternative implementation that doesn't require transfer, just verification
    function validateTicket(uint256 _eventId, uint256 _ticketId, address _attendee) external {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(event_.entryGate == msg.sender || authorizedEntryGates[msg.sender], "Not authorized entry gate");
        require(balanceOf(_attendee, _eventId) > 0, "No valid ticket owned");
        require(!event_.usedTickets[_ticketId], "Ticket already used");
        
        // Mark ticket as used to prevent reuse
        event_.usedTickets[_ticketId] = true;
        
        emit EntryVerified(_eventId, _ticketId, _attendee);
    }
    
    // For attendees to self-verify (scan at entry)
    function verifyMyTicket(uint256 _eventId, uint256 _ticketId) external {
        Event storage event_ = events[_eventId];
        require(event_.isActive, "Event is not active");
        require(balanceOf(msg.sender, _eventId) > 0, "No valid ticket owned");
        require(!event_.usedTickets[_ticketId], "Ticket already used");
        require(event_.entryGate != address(0), "Entry gate not set");
        
        // Mark ticket as used to prevent reuse
        event_.usedTickets[_ticketId] = true;
        
        // Transfer ticket to entry gate
        safeTransferFrom(msg.sender, event_.entryGate, _eventId, 1, "");
        
        emit EntryVerified(_eventId, _ticketId, msg.sender);
    }

    function deactivateEvent(uint256 _eventId) external onlyOwner {
        require(events[_eventId].isActive, "Event already inactive");
        events[_eventId].isActive = false;
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function withdrawBalance() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
