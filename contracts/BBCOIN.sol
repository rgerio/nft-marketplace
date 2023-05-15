// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.3/token/ERC20/ERC20.sol";

contract BBCOIN is ERC20 {
    constructor() ERC20("BBCOIN", "BBCOIN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
