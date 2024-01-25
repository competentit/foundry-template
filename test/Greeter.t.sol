// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Greeter.sol";

contract ContractTest is Test {
    Greeter public greeter;
    address payable[] internal users;

    function setUp() public {
        greeter = new Greeter("Hello world!");
    }

    function testExample() public {
        uint256 balances = 10 ether;
        address payable alice = payable(address(1));
        // labels alice's address in call traces as "Alice [<address>]"
        vm.label(alice, "Alice");
        vm.deal(alice, balances);
        console.log("alice's address", alice);

        address payable bob = payable(address(2));
        vm.label(bob, "Bob");
        vm.deal(bob, balances);

        vm.prank(alice);
        (bool sent, ) = bob.call{value: 10 ether}("");
        assertTrue(sent);
        assertGt(bob.balance, alice.balance);
    }

    function testGreetingIsRight() public {
        greeter.setGreeting("Hi, I am fine!");
        assertEq(greeter.greet(), "Hi, I am fine!");
    }
}
