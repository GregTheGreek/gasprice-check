const Web3 = require("web3");

const web3 = new Web3(process.argv[2])

const percentile = 60;

const startBlock = "12284961";
const endBlock   = "12284980";
//const endBlock   = "12289964";

const data = {
  prices: []
};

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
      gethPrice: gethEstimateFn(gasPrices),
      avgrPrice: avg(gasPrices)
    };
    data.prices.push(...gasPrices)
  }
  console.log(data)
}

const avg = (prices) => {
  return prices.reduce((x,y) => x + y) / prices.length;
}

const gethEstimateFn = (prices) => {
  const sorted = data.prices.sort();
  const price = sorted[Math.floor((sorted.length - 1)*(percentile/100))];
  return price;  
}

main().then(() => {process.exit()});
