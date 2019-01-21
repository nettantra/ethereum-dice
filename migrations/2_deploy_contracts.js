var CustomToken = artifacts.require("./CustomToken.sol");
var Dice = artifacts.require("./Dice.sol");


module.exports = (deployer, network) => {
    deployer.deploy(CustomToken,1000).then(function() {
        return deployer.deploy(Dice, CustomToken.address)
    });
};
