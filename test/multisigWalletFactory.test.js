const { should, ensuresException } = require('./helpers/utils');
const MultiSigWalletFactory = artifacts.require('./MultiSigWalletFactory.sol');

const BigNumber = web3.BigNumber;

contract('MultiSigWalletFactory', ([owner, owner2, owner3]) => {
    let multisigFactory;
    const requiredSigs = new BigNumber(2);

    beforeEach(async () => {
        multisigFactory = await MultiSigWalletFactory.new();
    });

    it('deploys new multisig wallet', async () => {
        const multisig = await multisigFactory.create.call(
            [owner, owner2, owner3],
            requiredSigs
        );

        expect(multisig).to.exist;
    });

    it('emits ContractInstantiation', async () => {
        const { logs } = await multisigFactory.create(
            [owner, owner2, owner3],
            requiredSigs,
            { from: owner }
        );

        const event = logs.find(e => e.event === 'ContractInstantiation');
        expect(event).to.exist;

        const { args } = logs[0];
        const { sender, instantiation } = args;
        sender.should.be.equal(owner);

        const isInstantiation = await multisigFactory.isInstantiation.call(
            instantiation
        );
        isInstantiation.should.be.true;
    });

    it('registers the number of multisig wallet deployed per address', async () => {
        const multisig = await multisigFactory.create(
            [owner, owner2, owner3],
            requiredSigs,
            { from: owner }
        );

        let numberOfInstantiations = await multisigFactory.getInstantiationCount(
            owner
        );
        numberOfInstantiations.should.be.bignumber.equal(1);

        const multisig2 = await multisigFactory.create(
            [owner, owner2],
            requiredSigs,
            { from: owner }
        );

        numberOfInstantiations = await multisigFactory.getInstantiationCount(
            owner
        );
        numberOfInstantiations.should.be.bignumber.equal(2);
    });
});
