const { config } = require("dotenv");
const { Bundler } = require("@biconomy/bundler"); // Biconomy bundler for managing gasless transactions
const { ethers } = require('ethers');
const { ChainId } = require('@biconomy/core-types'); // Chain IDs for different blockchains supported by Biconomy
const { BiconomyPaymaster, PaymasterMode } = require('@biconomy/paymaster')
const { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE, } = require('@biconomy/modules')
const { DEFAULT_ENTRYPOINT_ADDRESS, BiconomySmartAccountV2 } = require('@biconomy/account')
const { createSmartAccount } = require('./createSmartAccount')

config();

// Function to mint an NFT gaslessly
async function mintNFT() {
    // Create and initialize the smart account
    const smartAccount = await createSmartAccount();
    // Retrieve the address of the initialized smart account
    const address = await smartAccount.getAccountAddress();

    // Define the interface for interacting with the NFT contract
    const nftInterface = new ethers.utils.Interface([
        "function safeMint(address _to)",
    ]);

    // Encode the data for the 'safeMint' function call with the smart account address
    const data = nftInterface.encodeFunctionData("safeMint", [address]);

    // Specify the address of the NFT contract
    const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

    // Define the transaction to be sent to the NFT contract
    const transaction = {
        to: nftAddress,
        data: data,
    };

    // Build a partial User Operation (UserOp) with the transaction and set it to be sponsored
    let partialUserOp = await smartAccount.buildUserOp([transaction], {
        paymasterServiceData: {
            mode: PaymasterMode.SPONSORED,
        },
    });

    // Try to execute the UserOp and handle any errors
    try {
        // Send the UserOp through the smart account
        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        // Wait for the transaction to complete and retrieve details
        const transactionDetails = await userOpResponse.wait();
        // Log the transaction details URL and the URL to view minted NFTs
        console.log(
            `Transaction Details: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
        );
        console.log(`View Minted NFTs: https://testnets.opensea.io/${address}`);
    } catch (e) {
        // Log any errors encountered during the transaction
        console.log("Error encountered: ", e);
    }
}

mintNFT()