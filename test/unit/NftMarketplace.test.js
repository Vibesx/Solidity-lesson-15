const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Nft Marketplace Unit Tests", function () {
			let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract;
			const PRICE = ethers.utils.parseEther("0.1");
			const TOKEN_ID = 0;

			beforeEach(async () => {
				accounts = await ethers.getSigners(); // could also do with getNamedAccounts; with getNamedAccounts we might encounter type problems
				deployer = accounts[0];
				user = accounts[1];
				await deployments.fixture(["all"]);
				// the way getContract works is that it sets whatever account is at index 0 in getSigners() (deployer in our case)
				// if we want to call a function on a contract with another account, we need to connect it to the contract with <contract>.connect(<address>)
				// we can add the account as a 2nd param to getContract to connect an account directly, this way is just more explicit
				// the below code does the same as just getContract(<contract_name>) (as we connect the deployer whicn is the default anyway) and getContract(<contract_name>, <address>); but as stated earlier, it's more explicit
				nftMarketplaceContract = await ethers.getContract("NftMarketplace");
				nftMarketplace = await nftMarketplaceContract.connect(deployer);
				basicNftContract = await ethers.getContract("BasicNft");
				basicNft = await basicNftContract.connect(deployer);
				await basicNft.mintNft();
				await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID);
			});

			it("lists and can be bought", async function () {
				await nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE);
				const playerConnectedNftMarketplace = nftMarketplaceContract.connect(user);
				await playerConnectedNftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
					value: PRICE,
				});
				// check if owner is changed
				const newOwner = await basicNftContract.ownerOf(TOKEN_ID);

				// check if seller got paid
				const deployerProceeds = await nftMarketplaceContract.getProceeds(deployer.address);

				assert(newOwner.toString() == user.address);
				assert(deployerProceeds.toString() == PRICE.toString());
			});
	  });
