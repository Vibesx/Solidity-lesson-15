// Util used to mimick mining a block; used for local nodes
const { network } = require("hardhat");

function sleep(timeInMs) {
	return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

// amount - amount of blocks to move (mine)
// sleepAmount - used to mimick actual mining and how much it would take; default to 0
async function moveBlocks(amount, sleepAmount = 0) {
	console.log("Moving blocks...");
	for (let index = 0; index < amount; index++) {
		await network.provider.request({
			method: "evm_mine",
			params: [],
		});
		if (sleepAmount) {
			console.log(`Sleeping for ${sleepAmount}`);
			await sleep(sleepAmount);
		}
	}
}

module.exports = {
	moveBlocks,
	sleep,
};
