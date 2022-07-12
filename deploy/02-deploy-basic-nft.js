const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	let args = [];

	const basicNft = await deploy("BasicNft", {
		from: deployer,
		args: args,
		logs: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

	// Verify the deployment
	if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
		log("Verifying...");
		await verify(basicNft.address, args);
	}
	log("----------------------------------------------------");
	log("Basic NFT Deployed!");
};

module.exports.tags = ["all", "basicNft"];
