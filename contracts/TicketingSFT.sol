// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract TicketingSFT is ERC1155, ERC1155Supply, Ownable {
    struct Event {
        string name;
        uint256 maxSupply;
        uint256 price;
        bool resaleAllowed;
        mapping(uint256 => uint256) resalePrices;
        mapping(uint256 => bool) isListed;
    }

    mapping(uint256 => Event) public events;
    uint256 public nextEventId;

    constructor() ERC1155("") Ownable(msg.sender) {}

    // Create a new event
    function createEvent(
        string memory _name,
        uint256 _maxSupply,
        uint256 _price
    ) external onlyOwner returns (uint256) {
        uint256 eventId = nextEventId++;
        Event storage newEvent = events[eventId];
        newEvent.name = _name;
        newEvent.maxSupply = _maxSupply;
        newEvent.price = _price;
        newEvent.resaleAllowed = false;
        return eventId;
    }

    // Purchase tickets directly from organizer
    function purchaseTicket(uint256 _eventId) external payable {
        Event storage event_ = events[_eventId];
        require(msg.value >= event_.price, "Insufficient payment");
        require(totalSupply(_eventId) < event_.maxSupply, "Event sold out");
        
        _mint(msg.sender, _eventId, 1, "");
    }

    // Toggle resale window
    function toggleResaleWindow(uint256 _eventId) external onlyOwner {
        events[_eventId].resaleAllowed = !events[_eventId].resaleAllowed;
    }

    // List ticket for resale
    function listTicketForResale(
        uint256 _eventId,
        uint256 _tokenId,
        uint256 _price
    ) external {
        require(events[_eventId].resaleAllowed, "Resale not allowed");
        require(balanceOf(msg.sender, _eventId) > 0, "No ticket owned");
        
        events[_eventId].resalePrices[_tokenId] = _price;
        events[_eventId].isListed[_tokenId] = true;
    }

    // Purchase resale ticket
    function purchaseResaleTicket(
        uint256 _eventId,
        uint256 _tokenId,
        address _seller
    ) external payable {
        Event storage event_ = events[_eventId];
        require(event_.resaleAllowed, "Resale not allowed");
        require(event_.isListed[_tokenId], "Ticket not listed");
        require(msg.value >= event_.resalePrices[_tokenId], "Insufficient payment");
        
        // Transfer ticket
        safeTransferFrom(_seller, msg.sender, _eventId, 1, "");
        
        // Transfer payment to seller
        payable(_seller).transfer(msg.value);
        
        // Remove listing
        event_.isListed[_tokenId] = false;
    }

    // Override required functions
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}