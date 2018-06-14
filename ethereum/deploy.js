const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const fs = require('fs-extra');

const compiledFactory = require('./build/CampaignFactory.json');

const mnemonic = "<MNEMONIC>";
const provider = new HDWalletProvider(mnemonic, "<INFURA_URL>");
const web3 = new Web3(provider);


// only making function so we can use async/await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // value of 'interface' property is the ABI
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: '0x' + compiledFactory.bytecode})
        .send({gas: '3000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);

    const deploymentInfo = `
/////// Contract deployed ///////
	from: ${accounts[0]}
	to: ${result.options.address}
	`;

    fs.writeFile('contractDeploymentInfo.txt', deploymentInfo, (err) => {
        if (err) throw err;
        console.log(`Contract Deployment Information Successfully Saved.`)
    });
};

deploy();

