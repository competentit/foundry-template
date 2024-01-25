// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "forge-deploy/DeployScript.sol";
import "generated/deployer/DeployerFunctions.g.sol";

contract Deployments is DeployScript {
    using DeployerFunctions for Deployer;

    function deploy() external returns (Greeter) {
        return deployer.deploy_Greeter("Greeter", "Hello");
    }
}
