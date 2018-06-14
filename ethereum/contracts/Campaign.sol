pragma solidity ^0.4.17;



contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        // view means no data inside the contract is modified
        // return means returns address of type array 
        return deployedCampaigns;
    }
}




contract Campaign {
    // this is a struct definition (or Type), so it does minimumContribution
    // create an instance of a Request unlike the variables
    // below.

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        // mapping is a reference type which is why you dont have
        // to innitilise it in here.
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        // make sure person calling the function has donated!
        require(approvers[msg.sender]);
        
        // make sure person calling the function has
        // not voted before.
        ///     require(!requests[index].approvals[msg.sender]);
        
        // this person now who has not voted, can be placed inside the 
        // approvals list of this particular request
        ///     requests[index].approvals[msg.sender] = true;
        ///     requests[index].approvalCount++;
        
        //instead of doing this requests lookup 3 times ina row,
        // we can assign it to a variable instead.
        
        Request storage request = requests[index];
        // this manipulates requests and not make a local copy in memory.
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finaliseRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
        
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length, 
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}