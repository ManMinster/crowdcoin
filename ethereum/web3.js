import Web3 from 'web3';

// using the provider provided by metamask that
// is assumed to be in the browser extension and signed in.
// In other words, assuming web3 is injected into the page

// Web3 gets executed 2 times, once on the server, then on the browser.
//When its executed on server, we see the error
//‘window global variable is undefined’.

// So create conditions in which to use web3 on browser only

let web3;

if (typeof window !== 'undefined' && window.web3 !== 'undefined') {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider)

} else {

    // we are on the server, or the user is not runing metamask.
    // Set up our own provider usng infura to access the test
    // network to get access to our contract

    const provider = new Web3.providers.HttpProvider("<INFURA_URL>");

    web3 = new Web3(provider);
}


export default web3;
