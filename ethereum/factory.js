import web3 from './web3';
const CampaignFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'<FACTORY_CONTRACT_ADDRESS>'
);

export default instance;

