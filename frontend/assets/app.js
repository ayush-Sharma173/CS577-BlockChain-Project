import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.js';

// Ensure that the MetaMask connection works correctly
let myAdddress = "";

// ABI for the Charity contract
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "RequestCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "int256",
        "name": "_contact",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "createRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
      }
    ],
    "name": "getRequest",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "int256",
        "name": "contact",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "complete",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "approvalCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numRequests",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "requests",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "int256",
        "name": "contact",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "complete",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "approvalCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Web3 provider and contract setup
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0x2a3962E339B143DD8426F863035E47441752F792"; // Update this address
const contract = new ethers.Contract(contractAddress, abi, signer);
const oneRupeeEqualsToEthereum = 218546;

async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("MetaMask connected");
      myAdddress = accounts[0];
      console.log("Connected address:", myAdddress);
    } catch (error) {
      console.error("User denied account access:", error);
    }
  } else {
    alert("MetaMask not found. Please install MetaMask and try again.");
  }
}

connectMetaMask();

// Function to create a donation request
async function createRequest(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const contact = document.getElementById("contact").value;
  const amountInEth = (document.getElementById("amount").value / oneRupeeEqualsToEthereum).toString();

  if (!description || !amountInEth) {
    alert("All fields are required.");
    return;
  }

  const amount = ethers.utils.parseUnits(amountInEth, "ether");
  // console.log("Creating request with:", name, description, contact, amount.toString(), myAdddress);

  try {
    const tx = await contract.createRequest(name, description, contact, amount, myAdddress);
    console.log("Transaction submitted:", tx);
    await tx.wait();
    alert("Donation Request created successfully!");
  } catch (error) {
    console.error("Error creating request:", error);
    alert("Error donating: " + error.data.data.reason);
  }
}

// Function to donate to a request
async function donate(requestId) {
  const donationAmountInEth = (document.getElementById("donationAmount").value / oneRupeeEqualsToEthereum).toString();

  if (!requestId || !donationAmountInEth) {
    alert("Request ID and donation amount are required.");
    return;
  }

  const donationAmount = ethers.utils.parseUnits(donationAmountInEth, "ether");
  console.log("Donating:", donationAmount.toString(), "to request ID:", requestId);

  try {
    const requestDetails = await contract.getRequest(requestId);
    console.log("Request details:", requestDetails);

    const tx = await contract.donate(requestId, { value: donationAmount });
    console.log("Donation transaction submitted:", tx);
    await tx.wait();
    alert("Donation successful!");
    fetchCompletedRequests();
  } catch (error) {
    console.error("Error donating:", error);
    alert("Error donating: " + error.data.data.reason);
  }
}

// Function to fetch completed requests and populate the table
async function fetchCompletedRequests() {
  if (typeof window.ethereum !== 'undefined') {
    // Get the total number of requests
    const totalRequests = parseInt(await contract.requestLength(), 16);
    // console.log(totalRequests);
    let requestList = document.getElementById('main');

    // Clear the table before populating it
    requestList.innerHTML = '';

    console.log(totalRequests);
    let found = false;

    for (let i = 0; i < totalRequests; i++) {
      const request = await contract.getRequest(i);
      const name = request[0];
      const description = request[1];
      const contact = ethers.utils.formatEther(request[2]);
      const amount = ethers.utils.formatEther(request[3]) * oneRupeeEqualsToEthereum;
      const received = ethers.utils.formatEther(request[4]) * oneRupeeEqualsToEthereum;
      const destAddress = request[5];
      const complete = request[6];

      // Check if the request is completed
      if (!complete) {
        found = true;
        requestList.innerHTML += `<div class="donate-card">
                                    <div class="image-container">
                                    <img src="./assets/donate.png" alt="Morning Set">
                                  </div>
                                  <div class="donate-info">
                                      <h3>${name}</h3>
                                      <p>${description}</p>
                                      <div class="tags">
                                        <span class="tag">Contact : ${contact * 1000000000000000000}</span>
                                        <span class="tag">Donated : ${received}</span>
                                      </div>
                                      <div class="donate-order">
                                          <span class="price">$${amount.toFixed(0)}&nbsp;</span>
                                          <button class="donate-button" onclick="donateWidget('${i}', '${name}', '${destAddress}')">Donate Now</button>
                                      </div>
                                  </div>
                                  
                              </div>`;
      }
    }

    if (!found) {
      requestList.innerHTML += `<div class="donate-card">
                  <div class="image-container">No Charity request found</div>
                </div>`;
      return;
    }
  } else {
    console.error("Ethereum object does not exist");
  }
}

function donateWidget(requestID, name, destAddress) {
  console.log("hi");
  // Get the modal
  var modal = document.getElementById("myModal");
  document.getElementById("addContent").innerHTML = `<h2>Donate to ${name}</h2>
      <input value="Address : ${destAddress}" disabled>
      <input id="donationAmount" type="number" placeholder="Amount (in INR)" />
      <button onclick="donate('${requestID}')">Donate</button>`;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

export { connectMetaMask, createRequest, donate, fetchCompletedRequests, donateWidget };

// Add the event listener inside the DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  const createRequestButton = document.querySelector("button");
  createRequestButton.addEventListener("click", createRequest);
});

// Your other existing functions
