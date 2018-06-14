const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; // referenes deployed instance of the factory we will make
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'})

    await factory.methods.createCampaign('100').send({
        from: accounts[0], gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);

});


describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200', from: accounts[1]
        });

        const isContributer = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributer);
    });

    it('requires a minimum contribution', async () => {

        try {
            await campaign.methods.contribute().send({
                value: '5', from: accounts[1]
            });

        } catch (err) {
            assert(err);
            return
        }
        assert(false);
    });

    it('it allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('buy batteries', 1, accounts[2])
            .send({
                from: accounts[0], gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();
        assert.equal('buy batteries', request.description);
        assert.equal(1, request.value);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0], value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('buy plastic', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0], gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0], gas: '1000000'
        });

        await campaign.methods.finaliseRequest(0).send({
            from: accounts[0], gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        // convert the wei into ether
        balance = web3.utils.fromWei(balance, 'ether');
        // then convert string to a float
        balance = parseFloat(balance);
        console.log('balance', balance);

        assert(balance > '104');

    })
})


