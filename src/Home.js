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

const initialState = '';


const Home = () => {
	const [currentAccount, setCurrentAccount] = useState(initialState);
	const [network, setNetwork] = useState(initialState);
	const [finalStats, setStats] = useState([]);
	const [transaction, setTransactionProcess] = useState(initialState);
  const [txSuccess, setTx] = useState(initialState);
  const [success, setSuccess] = useState(initialState);
  const [winningNum, setWinningNum] = useState(initialState);
  const [won, setWon] = useState(initialState);
  

  

  const refresh =  () => {
    setWon(initialState);
    setTx(initialState);
    setTransactionProcess(initialState);
  }

	
  
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
				console.log(contract);
					
				// For each name, get the record and the address
				const p = await stats.payout._hex;
        const r = await stats.rollsincelastpayout._hex;
        const o = await stats.ownerfees._hex;
        const w = await contract.lotteryNumber().then(a => a._hex).then(a => parseInt(a, 16));
        console.log(w);
        const currentNum = await contract.assignedNumber(currentAccount).then(a => a._hex).then(a => parseInt(a, 16)).catch((error) => {console.log('Has not played')});
        

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
    
    const price =  '0.3';
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract('0xc18aB8414fE98998365b74A3dE15ECcB1f19Bc54', abi, signer);
        console.log(contract);
				setTransactionProcess(true);
        let tx = await contract.rollDice({value: ethers.utils.parseEther(price)});
        const receipt = await tx.wait();
        setTimeout(() => {
						
        }, 2000);

        if (receipt.status === 1) {
          setSuccess(true);
					console.log("Dice rolled! https://mumbai.polygonscan.com/tx/"+tx.hash);
					console.log(tx.hash);
					
          

          contract.on("DiceLanded", (requestId, result) => {
            console.log("Result is: ", result);
            //setTx(result);
            doThis(result);
          })

          async function doThis(item){
            
            
            const finalRes = await item._hex;
            const result = await parseInt(finalRes, 16);
            console.log(result);
            setTx(result);
            if(result == winningNum){
              setWon(true);
            
          }
          
        }
				
					
	
					
				} else {
					setTransactionProcess(false);
					alert("Transaction failed! Please try again");
				}

        
        
        
				
        
        
        

        

        
			}
		} catch(error){
			console.log(error);
      setTransactionProcess(false);
		}
		
	}

 const newLoad = () => {
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
            <p className="subtitle">Sign in with your wallet to participate in lottery drawings </p>
			</div>
			);

      const renderInProgressTitle = () => (
        <div >
              <p className="title">Drawing a Random Lottery Number...</p>
              <br></br>
              <p className="subtitle">Please stand by </p>
        </div>
        );

        const renderSuccessTitle = () => (
          <div >
                <p className="title">Drawing Complete</p>
                <br></br>
                <p className="subtitle">Please review your drawing results below </p>
          </div>
          );

			const renderConnectedTitle = () => (
				<div >
							<p className="title">Web3 Lottery</p>
							<br></br>
							<p className="subtitle">Enter to win the lottery pool, or view the "rules to play" to learn how to win </p>
              
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
      

      
        else {
          return(
            <div className="form-container">
            <button className="cta-button-two play-button" onClick={play}>Play for 0.3 MATIC</button>
            </div>
          )
        }
    
  }

  const processForm = () =>{
      
      
   
    if(txSuccess > 0){
      return(
        <div className="form-container">
          <p>The number you drew is: </p> <p className = "stat">{txSuccess}</p>
          {won && renderWinnerBlock()}
          <button className='cta-button mint-button' onClick = {newLoad}>Go Back</button>
        </div>
      )
    }
    else {
      
        return(
          <div className="form-container">
            <p>Please be patient - your entry could take 1-5 minutes to process depending on network congestion...</p>
            <br></br>
          <Grid color="#00BFFF" height={80} width={80} />
          </div>
        )
      
    }

  
}
  // This runs our function when the page loads.
  useEffect(() => {
        
        checkIfWalletIsConnected();
        refresh();
  }, [])

  return (
		<div className="App">
		<Helmet>
        <title>Web3 Lottery: Play to Win and View Current Prize Pool</title>
        <meta name="description" content="Go ahead and enter to win! Who knows - you might walk away with a prize." />
        
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
            {transaction && !(txSuccess > 0) && renderInProgressTitle()}
            {(txSuccess > 0) && renderSuccessTitle()}
            
						
            </div>
          
        </div>
       
				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && !transaction && renderInputForm()}
        {transaction && processForm()}
				{finalStats && renderMints()}	

        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Home;