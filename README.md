# MultiSig Wallet

![Zulu Republic](zulu-icon.png)

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Overview](#overview)
-   [Implementation Details](#implementation-details)
-   [Licensing](#licensing)
-   [Learn More](#learn-more)
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

## Licensing

Lite.IM is licensed under the [Creative Commons Attribution ShareAlike](https://creativecommons.org/licenses/by-sa/4.0/) (CC-BY-SA-4.0) license. This means you are free to share or adapt it in any way.

## Learn More

To learn more about Zulu Republic, visit the [Zulu Republic website](https://www.zulurepublic.io/) and [blog](www.medium.com/zulurepublic).

The Zulu Republic Telegram community can be found [here](https://t.me/ztxrepublic).

Follow Zulu Republic on Twitter at [@ztxrepublic](www.twitter.com/ztxrepublic).

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
