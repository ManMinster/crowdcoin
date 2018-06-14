

#### Overview


**Network:** Rinkeby hosted by Infura

**Provider:** [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider)

**Account creation:** [Metamask](https://metamask.io/)

**Getting Ether:** [faucet.rinkeby.io](https://faucet.rinkeby.io/)

**Front-end:** [React](https://reactjs.org/) and [Semantic ui](https://semantic-ui.com/)


#### Setting up
run `npm install`

1. Sign up to [infura.io](https://infura.io/signup) and get your url that allows access to the **Rinkeby** network.

2. Install chrome extension [Metamask](https://metamask.io/). Save the mnemonic somwhere safe.

3. Visit [faucet.rinkeby.io](https://faucet.rinkeby.io/) and follow instructions to get ether.


Navigate to directory `/ethereum/deploy.js` and replace:

- `<MNEMONIC>` with your mnemonic given by metamask.
- `<INFURA_URL>` with the url given by infura.
   


Navigate to directory `/ethereum/web3.js` and replace:
- `<INFURA_URL>` with the url given by infura.


Navigate to route directory and run: 
 - `node compile.js`
 
This will compile solidity code and output into the `/build` directory.

run:
 - `node deploy.js`
 
Navigate to `./contractDeploymentInfo.txt`.
 Copy the address after the text `to:`. This is the deployed contract address.


Navigate to `./ethereum/factory.js` and replace:
- `<FACTORY_CONTRACT_ADDRESS>` with the address you just copied.  


#### Test
run `npm run test`

#### Start

run `npm run dev`
open `localhost:3000` in browser!


