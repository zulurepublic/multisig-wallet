const MultiSigWallet = artifacts.require('MultiSigWallet');
const deployMultisig = (owners, confirmations) => {
    return MultiSigWallet.new(owners, confirmations);
};

const {
    should,
    balanceOf,
    getParamFromTxEvent,
    assertThrowsAsynchronously
} = require('./helpers/utils');

contract('MultiSigWallet', accounts => {
    let multisigInstance;
    const requiredConfirmations = 2;

    const excludePending = false;
    const includePending = true;
    const excludeExecuted = false;
    const includeExecuted = true;

    beforeEach(async () => {
        multisigInstance = await deployMultisig(
            [accounts[0], accounts[1], accounts[2]],
            requiredConfirmations
        );
        expect(multisigInstance).to.exist;
    });

    it('test execution after requirements changed', async () => {
        const deposit = 1000;
        const newOwner = accounts[3];

        // Send money to wallet contract
        await new Promise((resolve, reject) =>
            web3.eth.sendTransaction(
                {
                    to: multisigInstance.address,
                    value: deposit,
                    from: accounts[0]
                },
                e => (e ? reject(e) : resolve())
            )
        );
        const balance = await balanceOf(web3, multisigInstance.address);
        balance.valueOf().should.be.bignumber.equal(deposit);

        // Add owner wa_4
        const addOwnerData = multisigInstance.contract.addOwner.getData(
            newOwner
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                multisigInstance.address,
                0,
                addOwnerData,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        // There is one pending transaction
        assert.deepEqual(
            await multisigInstance.getTransactionIds(
                0,
                1,
                includePending,
                excludeExecuted
            ),
            [transactionId]
        );

        // Update required to 1
        const newRequired = 1;
        const updateRequirementData = multisigInstance.contract.changeRequirement.getData(
            newRequired
        );

        // Submit successfully
        const transactionId2 = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                multisigInstance.address,
                0,
                updateRequirementData,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        assert.deepEqual(
            await multisigInstance.getTransactionIds(
                0,
                2,
                includePending,
                excludeExecuted
            ),
            [transactionId, transactionId2]
        );

        // Confirm change requirement transaction
        await multisigInstance.confirmTransaction(transactionId2, {
            from: accounts[1]
        });

        const requiredConf = await multisigInstance.required();
        requiredConf.should.be.bignumber.equal(newRequired);

        assert.deepEqual(
            await multisigInstance.getTransactionIds(
                0,
                1,
                excludePending,
                includeExecuted
            ),
            [transactionId2]
        );

        // Execution fails, because sender is not wallet owner
        assertThrowsAsynchronously(() =>
            multisigInstance.executeTransaction(transactionId, {
                from: accounts[9]
            })
        );

        // Because the # required confirmations changed to 1, the addOwner transaction can be executed now
        await multisigInstance.executeTransaction(transactionId, {
            from: accounts[0]
        });
        assert.deepEqual(
            await multisigInstance.getTransactionIds(
                0,
                2,
                excludePending,
                includeExecuted
            ),
            [transactionId, transactionId2]
        );

        const isOwner = await multisigInstance.isOwner(newOwner);
        isOwner.should.be.true;
    });

    it('#removeOwner', async () => {
        // remove owner
        const removeOwnerData = multisigInstance.contract.removeOwner.getData(
            accounts[2]
        );

        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                multisigInstance.address,
                0,
                removeOwnerData,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        // There is one pending transaction
        const getPendingTxCount = await multisigInstance.getTransactionCount(
            includePending,
            excludeExecuted
        );
        getPendingTxCount.should.be.bignumber.equal(1);

        await multisigInstance.confirmTransaction(transactionId, {
            from: accounts[1]
        });

        assert.deepEqual(
            await multisigInstance.getConfirmations(transactionId),
            [accounts[0], accounts[1]]
        );

        const getExecutedTxCount = await multisigInstance.getTransactionCount(
            excludePending,
            includeExecuted
        );
        getPendingTxCount.should.be.bignumber.equal(1);

        const isOwner = await multisigInstance.isOwner(accounts[2]);
        isOwner.should.be.false;
    });

    it('#replaceOwner', async () => {
        // replace owner
        const replaceOwnerData = multisigInstance.contract.replaceOwner.getData(
            accounts[2],
            accounts[3]
        );

        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                multisigInstance.address,
                0,
                replaceOwnerData,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        // There is one pending transaction
        const getPendingTxCount = await multisigInstance.getTransactionCount(
            includePending,
            excludeExecuted
        );
        getPendingTxCount.should.be.bignumber.equal(1);

        await multisigInstance.confirmTransaction(transactionId, {
            from: accounts[1]
        });

        assert.deepEqual(
            await multisigInstance.getConfirmations(transactionId),
            [accounts[0], accounts[1]]
        );

        const getExecutedTxCount = await multisigInstance.getTransactionCount(
            excludePending,
            includeExecuted
        );
        getPendingTxCount.should.be.bignumber.equal(1);

        assert.deepEqual(await multisigInstance.getOwners(), [
            accounts[0],
            accounts[1],
            accounts[3]
        ]);
    });

    it('#revokeConfirmation', async () => {
        const removeOwnerData = multisigInstance.contract.removeOwner.getData(
            accounts[2]
        );

        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                multisigInstance.address,
                0,
                removeOwnerData,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        // There is one confirmation
        let confirmationsCount = await multisigInstance.getConfirmationCount(
            transactionId
        );
        confirmationsCount.should.be.bignumber.equal(1);

        // revoke happens
        await multisigInstance.revokeConfirmation(transactionId, {
            from: accounts[0]
        });

        // confirmations now is back to zero
        confirmationsCount = await multisigInstance.getConfirmationCount(
            transactionId
        );
        confirmationsCount.should.be.bignumber.equal(0);

        await multisigInstance.confirmTransaction(transactionId, {
            from: accounts[1]
        });

        // There is one confirmation but from accounts[1] as accounts[0] revoked hers
        confirmationsCount = await multisigInstance.getConfirmationCount(
            transactionId
        );
        confirmationsCount.should.be.bignumber.equal(1);

        // should still be one of the owners
        const isOwner = await multisigInstance.isOwner(accounts[2]);
        isOwner.should.be.true;
    });
});
