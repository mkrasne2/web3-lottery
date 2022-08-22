# About the Web3 Lottery

A few details about this Web3 project

## Randomness

I build this game to teach myself how to integrate the Chainlink VRF (Verifiable Random Function) into a smart contract. During every draw, the function automatically calls an existing subscription to VRF and recursively generates random values that get sent back as results to the original smart contract.

## Range

I chose the range for this game to be between 1-10, which means there is always a 1/10 chance of winning in each round. There is no change in likelihood of winning throughout gameplay

## Owner Fees

Every time a player draws a lottery number, the smart contract automatically subtracts .01 MATIC from the .3 MATIC play fee and adds it to a pool that can only be withdrawn by the creator of the smart contract. Therefore, the owner fees increase as the game is played and can be withdrawn whenever, as long as the transaction is processed by the creator of the smart contract. Other than collecting owner fees, the smart contract creator has no gameplay advantage.

## Requirements to Play

You will need a MetaMask wallet, an internet connection, testnet MATIC, and you must add Polygon Mumbai to as a network to your MetaMask wallet.

## Frontend

Built with React, ethers.js, and react-bootstrap. Go ahead and try it for yourself: https://mkrasne2.github.io/web3-lottery/#/
