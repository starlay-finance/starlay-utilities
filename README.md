# Starlay Utilities

The Starlay Protocol is a decentralized non-custodial liquidity market protocol
where users can participate as depositors or borrowers. The protocol is a set of
open source smart contracts which facilitate the supply and borrowing of user
funds. These contracts, and all user transactions/balances are stored on a
public ledger called a blockchain, making them accessible to anyone

Starlay Utilities is a JavaScript SDK for interacting with the Starlay Protocol

The `@starlay-finance/math-utils` package contains methods for formatting raw
([ethers.js](#ethers.js)) or indexed ([subgraph](#subgraph),
[caching server](#caching-server)) contract data for usage on a frontend

The `@starlay-finance/contract-helpers` package contains methods for generating
trancations based on method and parameter inputs. Can be used to read and write
data on the protocol contracts.
