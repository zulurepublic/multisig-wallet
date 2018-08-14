# MultiSig Wallet

<img src="zulu-icon.png" width="250" height="250">

## 1. What is the MultiSig Wallet

The purpose of multisig wallets is to increase security by requiring multiple parties to agree on transactions before execution.

## 2. How does it work?

Transactions within the multisig wallet is only executed only when confirmed by a predefined number of owners.

## 3. Why a MultiSig Wallet?

Zulu Republic believes that security is paramount in its application, so it is uses a modified yet secure version of [Gnosis multisig wallet](https://github.com/gnosis/MultiSigWallet) for its purposes.

### Smart Contracts

-   MultiSigWallet.sol

Based on the Gnosis wallet, this multisig contract allows the storing of ether as well as tokens in a secure manner. It permits the addition/removal od owners that will manage the contract as well as the number of required confirmation for funds to leave the contract.

-   MultiSigWalletFactory.sol

Used for deployment of multisig contracts, this contract keeps track of the MultiSig created within Zulu applications.

## 4. Development

**Dependencies**

-   `node@9.5.x`

**Setting Up**

-   Clone this repository.

-   Install all [system dependencies](#development).

    -   `npm install`

-   Compile contract code

    -   `node_modules/.bin/truffle compile`

**Running Tests**

-   `npm run test`

**Test Coverage**

To see current test coverage, open `coverage/index.html` in a browser.

To generate test coverage, type:

-   `npm run cov`

## 5. Licensing

Zulu-Passport is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](https://www.gnu.org/licenses/agpl-3.0.en.html) (agpl-3.0) license.

## 6. What is the Zulu Republic Foundation?

The Zulu Republic Foundation is a Swiss organization charged with managing the underlying technology of the Zulu Republic blockchain ecosystem. The foundation’s mission is to advance the development of decentralized technologies, to promote human rights and empowerment around the globe, and to reduce the global digital divide.

In support of this mission, the Zulu Republic Foundation is responsible for the following activity:

-   Developing open-source distributed ledger technologies (DLT)
-   Developing self-sovereign identity technologies (SSI)
-   Creating and distributing educational content on the subjects of digital security, privacy, and blockchain technology.
-   Maintaining and managing the ZTX token and reserve, and all Zulu Republic smart contracts.
-   Incubating and seeding initiatives, businesses, and non-profit organizations that utilize ZTX and/or its underlying open-source technologies in their daily operations.

Currently the Zulu Republic Foundation is developing an ecosystem of platforms on the Ethereum blockchain, combining solutions for both self-sovereign identity (the Zulu Republic Passport) and economic agency (ZTX token and Zulu Pay financial platform).

## 7. Learn More

To learn more about Zulu Republic, visit the [Zulu Republic website](https://www.zulurepublic.io/), [blog](www.medium.com/zulurepublic), and on Twitter at [@ztxrepublic](www.twitter.com/ztxrepublic).
