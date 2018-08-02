const MultiSigWalletFactory = artifacts.require('./MultiSigWalletFactory.sol');

const requiredConfirmations = 2;

module.exports = function(deployer, network, [owner1, owner2, owner3]) {
    deployer.deploy(
        MultiSigWalletFactory,
        [owner1, owner2, owner3],
        requiredConfirmations
    );
};
