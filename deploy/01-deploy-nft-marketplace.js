const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	let args = [];

	const nftMarketplace = await deploy("NftMarketplace", {
		from: deployer,
		args: args,
		logs: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

	// Verify the deployment
	if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
		log("Verifying...");
		await verify(nftMarketplace.address, args);
	}
	log("----------------------------------------------------");
	log("NFT Marketplace Deployed!");
};

module.exports.tags = ["all", "nftmarketplace"];
