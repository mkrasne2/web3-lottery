import React, { useEffect, useState } from "react";
import './App.css';
import {ethers} from "ethers";
import abi from "./components/abi.json";
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import InlineSVG from 'svg-inline-react';
import { Grid } from  'react-loader-spinner'
import { Helmet } from 'react-helmet';

const Rules = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
	const [finalStats, setStats] = useState([]);
	const [transaction, setTransactionProcess] = useState('');
  const [txSuccess, setTx] = useState('');
  const [success, setSuccess] = useState('');
  const [winningNum, setWinningNum] = useState('');
  const [won, setWon] = useState('');
	
	
  

  return (
		<div className="App">
		<Helmet>
        <title>Rules to Play the Web3 Lottery</title>
        <meta name="description" content="Please review the Web3 lottery rules and instructions here." />
        
      </Helmet>
      <div className="container">
        <div className="header-container">
        <header>
        
          
         </header>
				<div >
        <p className="title">Lottery Rules</p>
        <br></br>
        <p className="subtitle">Please read rule details before playing</p>
            
						
            </div>
          
        </div>
       
				<p className = "rules"><strong>In order to play, simply follow the instructions below:</strong>
        <br></br>
        <br></br>
        <br></br>
        1. Press the "play" button on the application homepage
        <br></br>
        <br></br>
        2. When prompted, accept the transaction in your MetaMask account (0.3 MATIC for buy-in + gas fees)
        <br></br>
        <br></br>
        3. Please wait for your random lottery number to be assigned - this may take 1-2 minutes
        <br></br>
        <br></br>
        4. At the bottom of the home page you will see the winning number for the lottery - this number is what you want to match
        <br></br>
        <br></br>
        5. Once your number has been assigned, the application will reveal your lottery number to you. This number will stay your
        assigned number until you play again
        <br></br>
        <br></br>
        6. If your number matches the lottery number, you are eligible to withdraw your winnings. In order to withdraw, navigate
        to the "withdraw" page
        <br></br>
        <br></br>
        7. Since your winning number is assigned to your wallet address in the smart contract, the application will allow you to successfully 
        process the withdrawal
        <br></br>
        <br></br>
        To learn more about the mechanisms that make this game possible, please go to the "about" page
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <strong>Requirements:</strong>
        <br></br>
        <br></br>
        <br></br>
        You must have MetaMask installed and funded with testnet MATIC to play. You must be connected to the Polygon Mumbai testnet. Each round costs
        .5 testnet MATIC to play. Your browser must have javascript enabled. You may also interact with the smart contract and submit transactions on
        Polygonscan using the following link: <a className = "etherscan" href="https://mumbai.polygonscan.com/address/0xc18aB8414fE98998365b74A3dE15ECcB1f19Bc54#code" target="_blank">Contract</a>
        </p>
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Rules;