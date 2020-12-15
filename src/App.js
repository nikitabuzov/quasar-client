import logo from './logo.svg';
import "./App.css";
// import React, { Component } from 'react';
import React, { useState, useEffect } from 'react';
// import Web3 from "web3";
import { ethers } from 'ethers';
// import { useState, useEffect, useCallback } from 'react';
// import { useWallet, UseWalletProvider } from 'use-wallet';
import { MetaMaskButton, Button, ToastMessage } from 'rimble-ui';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BigNumber from 'bignumber.js';

// import { Web3ReactProvider } from '@web3-react/core'
// import { useWeb3React } from '@web3-react/core'
// import { InjectedConnector } from '@web3-react/injected-connector'

// import { web3connect } from './web3window.js';

import Pool from './contracts/Pool.json';
import QuasarToken from './contracts/QuasarToken.json';

const poolAddress = '0xE563C51587F7Baf357B2088503602e57C765C257';
const quasarAddress = '0x5aA33655504051F5cA05efa7871d9F15d70DBBb4';

let provider;
let signer;
let quasar;
let pool;
let noProviderAbort = true;
let providerNotConnected = true;

// export const injectedConnector = new InjectedConnector({
//   supportedChainIds: [
//     1, // Mainet
//     3, // Ropsten
//     4, // Rinkeby
//     5, // Goerli
//     42, // Kovan
//     1337 // Ganache local
//   ],
// })

// function getLibrary(provider: any): Web3Provider {
//   const library = new Web3Provider(provider)
//   library.pollingInterval = 12000
//   return library
// }

// export const Wallet = () => {
//   const { chainId, account, activate, active } = useWeb3React()

//   const onClick = () => {
//     activate(injectedConnector)
//   }

//   return (
//     <div>
//       <div>ChainId: {chainId}</div>
//       <div>Account: {account}</div>
//       {active ? (
//         <div>✅ </div>
//       ) : (
//         <MetaMaskButton type="button" onClick={onClick}>
//           Connect to Metamask
//         </MetaMaskButton>
//       )}
//     </div>
//   )
// }

// export const walletConnect = () => {
  
  
//   return (
//     <div>
      
//       {providerNotConnected ? (
//         <div>✅ </div>
//       ) : (
//         <MetaMaskButton type="button" onClick={onClick}>
//           Connect to Metamask
//         </MetaMaskButton>
//       )}
//     </div>
//   )
// }

// Ensures metamask or similar installed
if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
	try{
		// Ethers.js set up, gets data from MetaMask and blockchain
		window.ethereum.enable().then(
			provider = new ethers.providers.Web3Provider(window.ethereum)
		);
    signer = provider.getSigner();
    quasar = new ethers.Contract(quasarAddress, QuasarToken.abi, signer);
		pool = new ethers.Contract(poolAddress, Pool.abi, signer);
    noProviderAbort = false;
    providerNotConnected = false;
	} catch(e) {
		noProviderAbort = true;
	}
}


function App() {

  const [walAddress, setWalAddress] = useState('0x00');
	const [quasarBalance, setQuasarBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [DepositBalance, setDepositBalance] = useState(0);
  const [RewardsBalance, setRewardsBalance] = useState(0);
	const [coinSymbol, setCoinSymbol] = useState('QSR');
  const [transAmount, setTransAmount] = useState('0');
  const [buyCoverAmount, setBuyCoverAmount] = useState(0);
  const [buyCoverPeriod, setBuyCoverPeriod] = useState(0);
  const [buyCoverPrice, setBuyCoverPrice] = useState(0);
	const [pendingFrom, setPendingFrom] = useState('0x00');
	const [pendingTo, setPendingTo] = useState('0x00');
	const [pendingAmount, setPendingAmount] = useState('0');
	const [isPending, setIsPending] = useState(false);
	const [errMsg, setErrMsg] = useState("Transaction failed!");
	const [isError, setIsError] = useState(false);
  // const { account, connect, ethereum } = useWallet();
  // const wallet = useWallet();
  // const [isLoading, setIsLoading] = useState(false);
  
  // const [contract, setContract] = useState();
  // const [DepositBalance, setDepositBalance] = useState();
  // const [RewardsBalance, setRewardsBalance] = useState();
  // const [depositAmount] = useState();



  // Aborts app if metamask etc not present
	if (noProviderAbort) {
		return (
			<div>
			<h1>Error</h1>
			<p><a href="https://metamask.io">Metamask</a> or equivalent required to access this page.</p>
			</div>
		);
  }
  
  // const connectWallet = () => {
  //   window.ethereum.enable().then(
	// 		provider = new ethers.providers.Web3Provider(window.ethereum)
	// 	);
  //   signer = provider.getSigner();
  //   quasar = new ethers.Contract(quasarAddress, QuasarToken.abi, signer);
  //   pool = new ethers.Contract(poolAddress, Pool.abi, signer);
  //   getAccData();
  //   noProviderAbort = false;
  //   providerNotConnected = false;
  // };

  // Notification to user that transaction sent to blockchain
  const PendingAlert = () => {
		if (!isPending) return null;
		return (

			<Alert key="pending" variant="info" 
			style={{position: 'absolute', top: 0}}>
			Blockchain event notification: transaction of {pendingAmount} 
			&#x39e; from <br />
			{pendingFrom} <br /> to <br /> {pendingTo}.
			</Alert>
		);
  };
  
  // Notification to user of blockchain error
	const ErrorAlert = () => {
		if (!isError) return null;
		return (
			<Alert key="error" variant="danger" 
			style={{position: 'absolute', top: 0}}>
			{errMsg}
			</Alert>
		);
  };

  // const getAccData = () => {
  //   // Sets current balance of QSR for user
  //   signer.getAddress().then(response => {
  //     setWalAddress(response);
  //     return quasar.balanceOf(response);
  //   }).then(balance => {
  //     setQuasarBalance(balance.toString())
  //   });
  //   // Sets current balance of deposited Eth for user
  //   signer.getAddress().then(response => {
  //     return pool.balanceOf(response);
  //   }).then(balance => {
  //     let formattedBalance = ethers.utils.formatUnits(balance, 18);
  //     setEthBalance(formattedBalance.toString())
  //   });

  //   let symbol = getSymbol();
  //   symbol.then(x => setCoinSymbol(x.toString()));

  // };
  
  // Sets current balance of QSR for user
	signer.getAddress().then(response => {
		setWalAddress(response);
		return quasar.balanceOf(response);
	}).then(balance => {
		setQuasarBalance(balance.toString())
  });
  
  // Sets current balance of deposited Eth for user
	signer.getAddress().then(response => {
		return pool.balanceOf(response);
	}).then(balance => {
		let formattedBalance = ethers.utils.formatUnits(balance, 18);
		setEthBalance(formattedBalance.toString())
	});

  // Sets symbol of ERC20 token (i.e. PCT)
	async function getSymbol() {
		let symbol = await quasar.symbol();
		return symbol;
	}
	let symbol = getSymbol();
  symbol.then(x => setCoinSymbol(x.toString()));

  // Interacts with the pool to make a deposit
	async function deposit() {
		// Converts integer as Eth to Wei,
		let amount = await ethers.utils.parseEther(transAmount.toString());
		try {
			await pool.deposit({value: amount});
			// Listens for event on blockchain
			await pool.on("Deposited", (from, amount) => {
				setPendingFrom(from.toString());
				// setPendingTo(to.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
		} catch(err) {
			if(typeof err.data !== 'undefined') {
				setErrMsg("Error: "+ err.data.message);
			} 
			setIsError(true);
		} 	
  }
  
  // Interacts with the pool to make a withdrawal
	async function withdraw() {
		// Converts integer as Eth to Wei,
		let amount = await ethers.utils.parseEther(transAmount.toString());
		try {
			await pool.withdraw(amount);
			// Listens for event on blockchain
			await pool.on("Withdrawn", (from, amount) => {
				setPendingFrom(from.toString());
				// setPendingTo(to.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
		} catch(err) {
			if(typeof err.data !== 'undefined') {
				setErrMsg("Error: "+ err.data.message);
			} 
			setIsError(true);
		} 	
  }
  
  // Interacts with the pool to buy coverage
  async function buyCoverage() {
    let price = new BigNumber(buyCoverAmount*buyCoverPeriod/365/86400*0.02);
    try {
      await pool.buyCoverage(buyCoverPeriod,buyCoverAmount.toString(),{value:"0x"+price.toString(16)});
      // Listens for event on blockchain
			await pool.on("CoverPurchased", (from, period, amount) => {
				setPendingFrom(from.toString());
				setPendingTo(period.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
    } catch(err) {
      if(typeof err.data !== 'undefined') {
				setErrMsg("Error: "+ err.data.message);
      } 
			setIsError(true);
    }
  }

  // Sets state for value to be transacted
	// Clears extant alerts
	function poolValueChange(value) {
		setTransAmount(value);
		setIsPending(false);
		setIsError(false);
  }
  
  function buyAmountValueChange(value) {
    let amnt = new BigNumber(value*10**18);
		setBuyCoverAmount(amnt);
		setIsPending(false);
		setIsError(false);
  }
  
  function buyPeriodValueChange(value) {
    let period = value*86400;
		setBuyCoverPeriod(period);
		setIsPending(false);
		setIsError(false);
  }
  
  
	// Handles user deposit form submit
	const handleDepositSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		poolValueChange(e.target.pooldeposit.value);
		deposit();
  };

  // Handles user withdraw form submit
	const handleWithdrawSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		poolValueChange(e.target.poolwithdraw.value);
		withdraw();
	};
  
  // Handles user buyCoverage form submit
	const handleBuyCoverageSubmit = (e: React.FormEvent) => {
		e.preventDefault();
    buyAmountValueChange(e.target.poolbuycoveramount.value);
    buyPeriodValueChange(e.target.poolbuycoverperiod.value);
		buyCoverage();
  };
  
  // useEffect(() => {
  //   setWalAddress(walAddress);
  // });

  return (
		<div className="App">
		<header className="App-header">

		<ErrorAlert />
		<PendingAlert />
 
    {/* <Web3ReactProvider getLibrary={getLibrary}>
      <Wallet />
    </Web3ReactProvider> */}
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/512px-Ethereum-icon-purple.svg.png" className="App-logo" alt="Ethereum logo" />

		<h2>{coinSymbol}</h2>

    {/* {(typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) ? (
      <MetaMaskButton onClick={() => connectWallet()}>Connect with Metamask</MetaMaskButton>
      ) : 
        <p>
		    User Wallet address: {walAddress}<br/>
		    ETH deposited: {ethBalance}<br />
	    	QSR reward: {quasarBalance}<br />
	    	</p>
      } */}





		<p>
		User Wallet address: {walAddress}<br/>
		ETH deposited: {ethBalance}<br />
		QSR reward: {quasarBalance}<br />
		</p>

		<form onSubmit={handleDepositSubmit}>
		<p>
		<label htmlFor="pooldeposit">Deposit ETH into the pool:</label>
		<input type="number" step="1" min="0" id="pooldeposit" 
		name="pooldeposit" onChange={e => poolValueChange(e.target.value)} required 
		style={{margin:'12px'}}/>	
		<Button type="submit" >Deposit</Button>
		</p>
		</form>

		<form onSubmit={handleWithdrawSubmit}>
		<p>
		<label htmlFor="poolwithdraw">Withdraw ETH from the pool:</label>
		<input type="number" step="1" min="0" id="poolwithdraw" 
		name="poolwithdraw" onChange={e => poolValueChange(e.target.value)} required 
		style={{margin:'12px'}}/>	
		<Button type="submit" >Withdraw</Button>
		</p>
		</form>

    <form onSubmit={handleBuyCoverageSubmit}>
		<p>
		<label htmlFor="poolbuycover">Buy coverage:</label>
		<input type="number" step="1" min="0" id="poolbuycoveramount" 
		name="poolbuycoveramount" onChange={e => buyAmountValueChange(e.target.value)} required 
		style={{margin:'12px'}}/>
    <input type="number" step="1" min="0" id="poolbuycoverperiod" 
		name="poolbuycoverperiod" onChange={e => buyPeriodValueChange(e.target.value)} required 
		style={{margin:'12px'}}/>
		<Button type="submit" >Buy</Button>
		</p>
		</form>

		<a  title="GitR0n1n / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)" href="https://commons.wikimedia.org/wiki/File:Ethereum-icon-purple.svg">
		<span style={{fontSize:'12px',color:'grey'}}>
		Ethereum logo by GitRon1n
		</span></a>
		</header>
		</div>
	);

  // const handleDeposit = useCallback(async () => {
  //   try {
  //     setIsLoading(true);

  //     const tx = await contract.deposit(ethers.utils.parseEther(depositAmount.toString()));
  //     await tx.wait();

  //     const depositedBalance = await contract.balanceOf(account);

  //     setDepositBalance(ethers.utils.formatEther(depositedBalance).toNumber());

  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [ethereum, depositAmount, contract]);

  // useEffect(() => {
  //   const loadEthereum = async () => {
  //     try {
  //       const provider = new ethers.providers.Web3Provider(ethereum)
  //       const signer = provider.getSigner(account)

  //       const poolContract = new ethers.Contract(
  //         '0xCe1c7Ca52cC61591a00Dc0A7d69d785D03e3bC85',
  //         Pool.abi,
  //         signer
  //       );

  //       const quasarTokenContract = new ethers.Contract(
  //         '0x5C181aA799Adf53386C754AeDB0dA612948f8bfe',
  //         QuasarToken.abi,
  //         signer
  //       );
  //       const depositedBalance = await poolContract.balanceOf(account);
  //       const rewardsBalance = await quasarTokenContract.balanceOf(account);

  //       setContract(poolContract);
  //       setDepositBalance(ethers.utils.formatEther(depositedBalance).toNumber());
  //       setRewardsBalance(ethers.utils.formatEther(rewardsBalance).toNumber())
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   if (ethereum) {
  //     loadEthereum();
  //   }
  // }, [ethereum, account, contract]);


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //         {wallet.status === 'connected' ? (
  //           <div>
  //             <div>Account: {account}</div>
  //             <button onClick={() => wallet.reset()}>disconnect</button>
  //           </div>
  //         ) : (
  //           <div>
  //             <MetaMaskButton onClick={() => wallet.connect()}>Connect with Metamask</MetaMaskButton>
  //           </div>
  //         )}
  //     </header>
  //   </div>
  // );

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       {!account ? (
  //           <MetaMaskButton.Outline onClick={() => connect('injected')}>
  //             Connect with Metamask
  //           </MetaMaskButton.Outline>
  //         ) : <p>
  //           Connected {account}
  //           </p>}
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
// Wrap everything in <UseWalletProvider />
// export default () => (
//   <UseWalletProvider
//     chainId={5777}
//     connectors={{
//       // This is how connectors get configured
//       portis: { dAppId: 'quasar' },
//     }}
//   >
//     <App />
//   </UseWalletProvider>
// )
