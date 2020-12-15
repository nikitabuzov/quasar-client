import Web3Provider, { Connectors, useWeb3Context } from "web3-react";
import { MetaMaskButton } from 'rimble-ui';

const { MetaMaskConnector } = Connectors;
const MetaMask = new MetaMaskConnector();
const connectors = { MetaMask };

function web3connection() {
  const context = useWeb3Context();
  const ether = context.library;

  React.useEffect(() => {
    context.setConnector("MetaMask")
  }, []);
  console.log(context);

//   const connectWallet = () => {
//     window.ethereum.enable().then(
//         provider = new ethers.providers.Web3Provider(window.ethereum)
//     );
//     signer = provider.getSigner();
//     // quasar = new ethers.Contract(quasarAddress, QuasarToken.abi, signer);
//     // pool = new ethers.Contract(poolAddress, Pool.abi, signer);
//   }

  return (
    <React.Fragment>
      {context.active ? (
        <React.Fragment>
          <p>Active Connector: {context.connectorName || "None"}</p>
          <p>Account: {context.account || "None"}</p>
          <p>Network ID: {context.networkId || "None"}</p>
          <p>test: {ether.s} </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <MetaMaskButton onClick={() => window.ethereum.enable()}>Connect with Metamask</MetaMaskButton>
        </React.Fragment>
      )}
      {context.error && <p>{context.error.toString()}</p>}
    </React.Fragment>
  );
}