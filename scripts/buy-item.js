const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

// change this value according to what you have in the Moralis Database (ex: if you only have 2 added items, TOKEN_ID 2+ will not exist)
const TOKEN_ID = 3;

async function buyItem() {
	const nftmarketeplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");
	const listing = await nftmarketeplace.getListing(basicNft.address, TOKEN_ID);
	const price = listing.price.toString();
	const tx = await nftmarketeplace.buyItem(basicNft.address, TOKEN_ID, { value: price });
	await tx.wait(1);
	console.log("NFT Bought!");
	if (network.config.chainId == "31337") {
		await moveBlocks(2, (sleepAmount = 1000));
	}
}

buyItem()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
