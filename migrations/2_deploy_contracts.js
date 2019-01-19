var myToken = artifacts.require("./myToken.sol");
var tokenSale = artifacts.require("./TokenSale.sol");
var Dice = artifacts.require("./Dice.sol");

module.exports = function(deployer) {

  deployer.deploy(myToken,250000).then(function() {
      var tokenPrice = 1000000000000000;
      return deployer.deploy(tokenSale, myToken.address, tokenPrice);
    });

  deployer.deploy(Dice,'0x628abc48de3df2afd1164cb8ae3f72584ae8dcd5').then(function(){
      return deployer.deploy(Dice,tokenSale.address);
    });

};
