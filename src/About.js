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

const About = () => {
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
        <title>About the Web3 Lottery</title>
        <meta name="description" content="Learn about the technical fundamentals that power this game." />
        
      </Helmet>
		
      <div className="container">
        <div className="header-container">
        <header>
        
          
         </header>
				<div >
        <p className="title">About This Game</p>
        <br></br>
        <p className="subtitle">A few technical details</p>
            
						
            </div>
          
        </div>
       
				<p className = "rules"><strong>Randomness:</strong>
        <br></br>
        <br></br>
        The smart contract that powers this game uses the Chainlink VRF (Verifiable Random Function) to ensure the randomness of results. After drawing
        a number, the smart contract automatically assigns the result to your wallet address until the next time you play. 
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <strong>Winning:</strong>
        <br></br>
        <br></br>
        If you look inside the code of the smart contract, you will notice that a winning number constructor variable is assigned upon initiation of the
        contract. This means that the winning number will never change. The smart contract also allows only for numbers to be drawn between a specific
        range of 0-10, which means you have 1/10 chance of winning upon each spin. Previous non-winning spin results can still be rendered as future 
        results, which means that the chances of winning remain constant throughout the entirety of gameplay. If you draw a winning number, it is recommended
        that you immediately withdraw your winnings since it is possible that other players could also draw a winning number and withdraw their winnings before
        you do. 
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <strong>Smart Contract Code:</strong>
        <br></br>
        <br></br>
        Please feel free to explore the smart contract code that powers this game on Polygonscan: <a className = "etherscan" href="https://mumbai.polygonscan.com/address/0xbD267D6a45eFD258D598bF8fFb2fDfbA3676468B#code" target="_blank">Contract</a>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <strong>Owner Fees:</strong>
        <br></br>
        <br></br>
        Every time a player draws a lottery number, the smart contract automatically subtracts .01 MATIC from the .3 MATIC play fee and adds it to a pool that can only be
        withdrawn by the creator of the smart contract. Therefore, the owner fees increase as the game is played and can be withdrawn whenever, as long as the
        transaction is processed by the creator of the smart contract. Other than collecting owner fees, the smart contract creator has no gameplay advantage.

        </p>
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default About;