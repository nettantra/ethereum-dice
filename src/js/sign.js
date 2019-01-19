const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/f072e47f51ae4419beecd1c3c16d0124"));

const account = '0x17E32FBE65bC3fdcB37F64ADf072BD8Db98c0FF8';

const privateKey = Buffer.from('B36491C91E2B92F9A4239970183F61A1BA87B29C892E76B08C216B80BBAB8DF0', 'hex');
const contractAddress = '0xe56fafe031cb2f1201c0a30fde325c7cc5353fbc';
const abi = [{"constant":false,"inputs":[{"name":"_pName","type":"string"}],"name":"setplayerDetails","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"outcome","outputs":[{"name":"playerAddress","type":"address"},{"name":"selected_num","type":"uint256"},{"name":"rolled_num","type":"uint256"},{"name":"result","type":"bool"},{"name":"ptoken","type":"uint256"},{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_betplaced","type":"uint256"},{"name":"_rollresult","type":"uint256"},{"name":"_result","type":"bool"},{"name":"_ptoken","type":"uint256"}],"name":"addGameEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"details","outputs":[{"name":"pAddress","type":"address"},{"name":"pName","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenSale","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"tokenfetch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_tokenSale","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

const contract = new web3.eth.Contract(abi,contractAddress, {
  from: account,
  gasLimit: 3000000,
});

const contractFunction = contract.methods.set(3);

const functionAbi = contractFunction.encodeAbi();

console.log("Getting gas estimate");

contractFunction.estimateGas({from: account}).then((gasAmount) => {
  estimatedGas = gasAmount.toString(16);

  console.log("Estimated gas: " + estimatedGas);

  web3.eth.getTransactionCount(account).then(_nonce => {
    nonce = _nonce.toString(16);

    console.log("Nonce: " + nonce);
    const txParams = {
      gasPrice: '0x09184e72a000',
      gasLimit: 3000000,
      to: contractAddress,
      data: functionAbi,
      from: account,
      nonce: '0x' + nonce
    };

    const tx = new Tx(txParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    contract.methods.get().call().then(v = >console.log("Value before: " + v));
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
      console.log(receipt);
      contract.methods.get().call().then(v => console.log("Value after increment: " +v));
    })
  });
});
