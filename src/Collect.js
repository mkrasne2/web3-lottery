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



const Collect = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
	const [finalStats, setStats] = useState([]);
	const [transaction, setTransactionProcess] = useState('');
  const [txSuccess, setTx] = useState('');
  const [success, setSuccess] = useState('');
  const [winningNum, setWinningNum] = useState('');
  const [won, setWon] = useState('');
	
	
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
	
	const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

		const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);
    ethereum.on('chainChanged', handleChainChanged);
    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '8001',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

	

	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract('0xc18aB8414fE98998365b74A3dE15ECcB1f19Bc54', abi, signer);
				var base64 = require('base-64');
				//var svgtojsx = require('svg-to-jsx');
				// Get all the domain names from our contract
				const stats = await contract.viewCurrentStats();
        const currentNum = await contract.assignedNumber(currentAccount).then(a => a._hex).then(a => parseInt(a, 16)).catch((error) => {console.log('Has not played')});
        console.log(currentNum);
				console.log(contract);
					
				// For each name, get the record and the address
				const p = await stats.payout._hex;
        const r = await stats.rollsincelastpayout._hex;
        const o = await stats.ownerfees._hex;
        const w = await contract.lotteryNumber().then(a => a._hex).then(a => parseInt(a, 16));
        console.log(w);
        if(w == currentNum){
          setWon(true);
        }
        

        const payout = await parseInt(p, 16) / 1000000000000000000;
        const rollsince = await parseInt(r, 16);
        const ownerfees = await parseInt(o, 16) / 1000000000000000000;
        setWinningNum(w);
				
				if(!(currentNum > 0)){
          const statistics = [payout, rollsince, ownerfees, w, "N/A"];
          console.log("MINTS FETCHED ", statistics);
			setStats(statistics);
        } else if (currentNum > 0){
          const statistics = [payout, rollsince, ownerfees, w, currentNum];
          console.log("MINTS FETCHED ", statistics);
          setStats(statistics);
        }
			}
		} catch(error){
			console.log(error);
		}
		
	}
	
	// This will run any time currentAccount or network are changed
	useEffect(() => {
		if (network === 'Polygon Mumbai Testnet') {
			fetchMints();
		}
	}, [currentAccount, network]);

  const play = async () => {
    
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract('0xc18aB8414fE98998365b74A3dE15ECcB1f19Bc54', abi, signer);
        

        
				console.log(contract);
				setTransactionProcess(true);
        let tx = await contract.claimPrize();
        
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          setSuccess(true);
					console.log("Prize money collected! https://mumbai.polygonscan.com/tx/"+tx.hash);
					console.log(tx.hash);
					
				
					setTimeout(() => {
						fetchMints();
					}, 2000);
	
					
				} else {
					setTransactionProcess(false);
          fetchMints();
					alert("Transaction failed! If your number matches the winning number, please try again");
				}

        
			}
		} catch(error){
			console.log(error);
      fetchMints();
      setTransactionProcess(false);
		}
		
	}

  const clearSettings = async () => {
    setTransactionProcess('');
  setTx('');
  setSuccess('');
  setWinningNum('');
  setWon('');
    window.location.reload(true);
  }

  

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
    );

		const renderNotConnectedTitle = () => (
			<div >
						<p className="title">Web3 Lottery</p>
						<br></br>
            <p className="subtitle">Sign in with your wallet to collect lottery winnings </p>
			</div>
			);

      const renderInProgressTitle = () => (
        <div >
              <p className="title">Transferring winnings to your address...</p>
              <br></br>
              <p className="subtitle">Please stand by </p>
        </div>
        );

        const renderSuccessTitle = () => (
          <div >
                <p className="title">Transfer Complete</p>
                <br></br>
                <p className="subtitle">Your winnings have been transferred to your account</p>
          </div>
          );

			const renderConnectedTitle = () => (
				<div >
							<p className="title">Web3 Lottery</p>
							<br></br>
							<p className="subtitle">If your current lottery number matches the winning number, a "collect winnings" button will appear below.  </p>
              <br></br>
              <p >For more rule details, please go to the "rules to play" page  </p>
              
				</div>
				);

        const renderWinnerBlock = () => (
             
                <p className="subtitle">You won! Go to the "Collect" page to claim your winnings! </p>
                
                
          
          );

				
				//render minted blogs
					const renderMints = () => {
						if (currentAccount && finalStats.length > 0) {
							return (
								<div className="mint-container">
									<p className="subtitle"> Current lottery stats: </p>
									<div className="mint-list">
										
                    <div className="mint-item">
                    <p className = 'nft-name'> Current Payout: </p>
                    <br></br>
                    <p className = 'stat'> {finalStats[0]} MATIC</p>
                    </div>
                    <div className="mint-item">
                    <p className = 'nft-name'> Rolls Since Last Win: </p>
                    <br></br>
                    <p className = 'stat'> {finalStats[1]} Rolls</p>
                    </div>
                    <div className="mint-item">
                    <p className = 'nft-name'> Owner Fees: </p>
                    <br></br>
                    <p className = 'stat'> {finalStats[2]} MATIC</p>
                    </div>
                    <div className="mint-item">
                    <p className = 'nft-name'> Winning Number: </p>
                    <br></br>
                    <p className = 'stat'> {finalStats[3]}</p>
                    </div>
                    <div className="mint-item">
                    <p className = 'nft-name'> Your Current Number: </p>
                    <br></br>
                    <p className = 'stat'> {finalStats[4]}</p>
                    </div>
                  
								</div>
                
							</div>);
						}
					};
					
				
					
		//I was lazy and did not change the name of this component - it's just to switch to testnet
		const renderInputForm = () =>{
			if (network !== 'Polygon Mumbai Testnet') {
				return (
					<div className="connect-wallet-container">
						<h2>Please switch to Polygon Mumbai Testnet</h2>
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
					</div>
				);
			}
      if(!won){
        return(
          <div className="form-container">
          <p>Your current lottery number does not match the winning number, so you are not eligible to withdraw winnings. </p>
          </div>
        )
      }
      if(won){
        if(!transaction){
          return(
            <div className="form-container">
            <button className="cta-button-two win-button" onClick={play}>Collect Winnings</button>
            </div>
          )
    }
        if(transaction){
          if(!success){
            return(
              <div className="form-container">
                <p>Please be patient while your prize is transferred</p>
                <br></br>
              <Grid color="#00BFFF" height={80} width={80} />
              </div>
            )
          } if(success){
            return(
              <div className="form-container">
                <p>You've successfully collected your prize money!</p>
                
                <button className='cta-button mint-button' onClick={clearSettings}>Go Back</button>
              </div>
            )
          }
          
        }	
      }
      
  }
  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
		
  }, [])

  return (
		<div className="App">
		<Helmet>
        <title>Collect Web3 Lotery Winnings</title>
        <meta name="description" content="If you have drawn a match you can collect your winnings here." />
        
      </Helmet>
      <div className="container">
        <div className="header-container">
        <header>
           
           <div className="right">
             <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
             { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
           </div>
         </header>
				<div >
            {!currentAccount && renderNotConnectedTitle()}
            {currentAccount && !(transaction) && renderConnectedTitle()}
            {transaction && !(txSuccess) && renderInProgressTitle()}
            {txSuccess && renderSuccessTitle()}
            </div>
        </div>
				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderInputForm()}
				{finalStats && renderMints()}	
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Collect;