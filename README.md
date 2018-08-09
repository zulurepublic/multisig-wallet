# MultiSig Wallet

![Zulu Republic](zulu-icon.png)

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Overview](#overview)
-   [Implementation Details](#implementation-details)
-   [Development](#development)
-   [Setting Up](#setting-up)
-   [Running Tests](#running-tests)
-   [Test Coverage](#test-coverage)

## Overview

Smart contracts for multi signature wallets used in the Zulu Republic applications

## Implementation Details

-   MultiSigWallet.sol

Based on the Gnosis wallet, this multisig contract allows the storing of ether as well as tokens in a secure manner. It permits the addition/removal od owners that will manage the contract as well as the number of required confirmation for funds to leave the contract.

-   MultiSigWalletFactory.sol

Used for deployment of multisig contracts, this contract keeps track of the MultiSig created within Zulu applications.

## Development

**Dependencies**

-   `node@9.5.x`

## Setting Up

-   Clone this repository.

-   Install all [system dependencies](#development).

    -   `npm install`

-   Compile contract code

    -   `node_modules/.bin/truffle compile`

## Running Tests

-   `npm run test`

## Test Coverage

To see current test coverage open `coverage/index.html` in a browser.

To generate test coverage, type:

-   `npm run cov`
