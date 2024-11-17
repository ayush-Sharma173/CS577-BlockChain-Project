// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Charity {
    struct Request {
        string name;
        string description;
        int256 contact;  // Changed int to int256
        uint256 amount;
        uint256 received;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
    }

    Request[] public requests;
    uint256 public numRequests;

    // Event for new request creation
    event RequestCreated(uint256 requestId, string name, uint256 amount, address recipient);

    // Function to create a new charity request
    function createRequest(
        string memory _name, 
        string memory _description, 
        int256 _contact,  // Changed int to int256
        uint256 _amount, 
        address payable _recipient
    ) public {
        Request memory newRequest = Request({
            name: _name,
            description: _description,
            contact: _contact,
            amount: _amount,
            received: 0,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
        numRequests++;

        emit RequestCreated(numRequests - 1, _name, _amount, _recipient); // Emit event
    }

    // Retrieve information about a specific request
    function getRequest(uint256 _requestId) public view returns (
        string memory name, 
        string memory description, 
        int256 contact, 
        uint256 amount, 
        uint256 received, 
        address recipient, 
        bool complete, 
        uint256 approvalCount
    ) {
        require(_requestId < requests.length, "Request does not exist"); // Validate request ID
        Request memory req = requests[_requestId];
        return (req.name, req.description, req.contact, req.amount, req.received, req.recipient, req.complete, req.approvalCount);
    }

    // Donate to a specific request
    function donate(uint256 _requestId) public payable {
        require(_requestId < requests.length, "Request does not exist"); // Validate request ID
        Request storage request = requests[_requestId];
        require(!request.complete, "Donation Request already completed");
        require(msg.value > 0, "No donation amount provided");

        // Update the received amount
        request.received += msg.value;

        // Check if the request is fully funded
        if (request.received >= request.amount) {
            request.complete = true;
        }

        // Transfer Ether to the recipient
        request.recipient.transfer(msg.value);
    }

    // Fallback function to receive donations directly to the contract
    receive() external payable {}

    // Function to check the contract's balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the number of requests
    function requestLength() public view returns (uint256) {
        return requests.length;
    }
}