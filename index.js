const Web3 = require("web3");

const web3 = new Web3(process.argv[2])

const startBlock = "12284961";
const endBlock   = "12285000";
//const endBlock   = "12289964";

const data = {};

const main = async () => {
  for (let i=startBlock;i<endBlock;i++){
  //for (let i=startBlock;i<endBlock;i++){
    const block = await web3.eth.getBlock(i);
    const gasPrices = [];
    
    for (let j=0; j < 5; j++){
    //for (let j=0; j < block.transactions.length; j++){
      const tx = await web3.eth.getTransaction(block.transactions[j]);
      gasPrices.push(tx.gasPrice / web3.utils.unitMap.gwei);
    }
    data[block.number] = {
      avgPrice: gethEstimateFn(gasPrices),
      gasPrices
    };
  }

  console.log(data);
}

const gethEstimateFn = (prices) => {
  return prices.reduce((a,b) => a + b) / prices.length;
}

main().then(() => {});
