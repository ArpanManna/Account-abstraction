const { ethers } = require('ethers')
const { BiconomySmartAccountV2 } = require('@biconomy/account')
const { config } = require('dotenv')
config()


let provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_POLYGON_MUMBAI);
let signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const biconomySmartAccountConfig = {
    signer: signer,
    chainId: 80001,
    biconomyPaymasterApiKey: process.env.PAYMASTER_API_KEY,
    bundlerUrl: process.env.BUNDLER_URL,
};

const createSmartAccount = async () => {
    const biconomySmartAccount = await BiconomySmartAccountV2.create(
        biconomySmartAccountConfig
    );
    console.log('smart account address:', await biconomySmartAccount.getAccountAddress())
}

createSmartAccount()