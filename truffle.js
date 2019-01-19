var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'clay merit diesel ecology peace abuse leopard banana destroy claw casual baby';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",

    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/f072e47f51ae4419beecd1c3c16d0124")
      },
      network_id: 3,
      gas: 4000000,
      }
  }
};
