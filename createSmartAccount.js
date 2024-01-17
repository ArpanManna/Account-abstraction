const { config } = require("dotenv"); 
const { Bundler } = require("@biconomy/bundler"); // Biconomy bundler for managing gasless transactions
const { ethers} = require('ethers'); 
const { ChainId } = require('@biconomy/core-types'); // Chain IDs for different blockchains supported by Biconomy
const { BiconomyPaymaster } = require('@biconomy/paymaster')
const {ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE,} = require('@biconomy/modules')
const { DEFAULT_ENTRYPOINT_ADDRESS, BiconomySmartAccountV2 } = require('@biconomy/account')

config(); // Load environment variables from .env file


let provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_POLYGON_MUMBAI);
let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Configure the Biconomy Bundler
const bundler = new Bundler({
  bundlerUrl: process.env.BUNDLER_URL, // URL to the Biconomy bundler service
  chainId: ChainId.POLYGON_MUMBAI, // Chain ID for Polygon Mumbai test network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address for the bundler
});

// Configure the Paymaster
const paymaster = new BiconomyPaymaster({
  paymasterUrl: process.env.PAYMASTER_URL, // URL to the Biconomy paymaster service
});

// Function to create a module for ownership validation
async function createModule() {
  return await ECDSAOwnershipValidationModule.create({
    signer: wallet, // The wallet acting as the signer
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // Address of the default ECDSA ownership validation module
  });
}

// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  const module = await createModule(); // Create the validation module

  let smartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI, // Chain ID for the Polygon Mumbai network
    bundler: bundler, // The configured bundler instance
    paymaster: paymaster, // The configured paymaster instance
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address
    defaultValidationModule: module, // The default validation module
    activeValidationModule: module, // The active validation module
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(), // Logging the address of the created smart account
  );
  return smartAccount;
}

createSmartAccount(); // Execute the function to create a smart account