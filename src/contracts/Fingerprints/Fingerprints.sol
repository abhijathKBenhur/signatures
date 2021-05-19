// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "../Standards/ERC1155_FULL/ERC1155FULL.sol";

/**
 *
 * @dev Our own Implementation of the basic standard multi-token.
 *
 * Saurabh Santhosh
 */
contract Fingerprints is ERC1155 {

    uint256 private _totalTokens = 0;

    // Mapping from token ID to metadata
    mapping(uint256 => NFTDetails) private _metadata;

    struct NFTDetails {
        string name;
        string category;
        string uri;
        uint256 amount;
        uint256 price;
    }

    constructor (string memory uri_) ERC1155(uri_) {

    }

    /**
     *
     * The mint function of the NFT.
     * Used to create new NFTs in the system
     */
    function mint(address account, string memory name, string memory category, uint256 amount, uint256 price, string memory uri) public virtual returns (uint256) {
        require(!_isEmpty(name), "MyERC1155: NFT Name cannot be empty");
        _totalTokens += 1;
        require(_isEmpty(_metadata[_totalTokens].name), "MyERC1155: NFT with id already exist");
        _metadata[_totalTokens] = NFTDetails(name, category, uri, amount, price);
        _mint(account, _totalTokens, amount, "");
        return _totalTokens;
    }

    function buy_nft(address payable owner, uint256 id) public payable {
        NFTDetails memory details = _metadata[id];
        require(!_isEmpty(details.name), "MyERC1155: NFT with id does not exist");
        require(msg.value >= details.price, "MyERC1155: Transferred ETH is less than price of NFT");
        this.safeTransferFrom(owner, msg.sender, id, 1, "");
        owner.transfer(details.price);
        if (msg.value > details.price) {
            payable(msg.sender).transfer(msg.value - details.price);
        }
    }

    /**
     *
     * Return the metadata of a given NFT
     */
    function metadataOf(uint256 id) public view virtual returns (string memory name, string memory category, uint256 amount, uint256 price, string memory uri) {
        NFTDetails memory details = _metadata[id];
        return (details.name, details.category, details.amount, details.price, details.uri);
    }

    function showSender() public view returns (address) {
        return msg.sender;
    }

    function totalTokens() public view returns (uint256) {
        return _totalTokens;
    }

    function _isEmpty(string memory str) private pure returns (bool) {
        return bytes(str).length == 0;
    }
}
