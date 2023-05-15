// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts@4.8.3/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts@4.8.3/utils/Counters.sol";

contract NFTMarketplace is IERC721Receiver {
    using Counters for Counters.Counter;

    Counters.Counter private _listingIdCounter;

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        address tokenContract;
        uint256 price;
        bool active;
    }

    mapping(uint256 listingId => Listing) public listings;

    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, address tokenContract, uint256 price);
    event NFTSold(uint256 indexed listingId, address indexed seller, address indexed buyer, address nftContract, uint256 tokenId, address tokenContract, uint256 price);
    event NFTUnlisted(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId);

    function listNFTForSale(address nftContract, uint256 tokenId, address tokenContract, uint256 price) external {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You do not own this NFT");
        require(price > 0, "Price must be greater than zero");

        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        uint256 listingId = _listingIdCounter.current();
        _listingIdCounter.increment();
        listings[listingId] = Listing(msg.sender, nftContract, tokenId, tokenContract, price, true);
        emit NFTListed(listingId, msg.sender, nftContract, tokenId, tokenContract, price);
    }

    function unlistNFT(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "You are not the seller of this listing");
        require(listing.active, "NFT is not listed for sale");

        IERC721 nft = IERC721(listing.nftContract);
        nft.safeTransferFrom(address(this), msg.sender, listing.tokenId);

        listing.active = false;
        emit NFTUnlisted(listingId, listing.seller, listing.nftContract, listing.tokenId);
    }

    function buyNFT(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "NFT is not listed for sale");

        IERC20 token = IERC20(listing.tokenContract);
        require(token.transferFrom(msg.sender, listing.seller, listing.price), "Failed to transfer tokens");

        IERC721 nft = IERC721(listing.nftContract);
        nft.safeTransferFrom(address(this), msg.sender, listingId);

        listing.active = false;
        emit NFTSold(listingId, listing.seller, msg.sender, listing.nftContract, listing.tokenId, listing.tokenContract, listing.price);
    }

    function getListingsCount() external view returns (uint256) {
        return _listingIdCounter.current();
    }

    // The following functions are overrides required by Solidity.

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
