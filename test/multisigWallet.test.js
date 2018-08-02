const MultiSigWallet = artifacts.require('MultiSigWallet');
const TestToken = artifacts.require('tests/TestToken');
const TestCalls = artifacts.require('tests/TestCalls');

const deployMultisig = (owners, confirmations) => {
    return MultiSigWallet.new(owners, confirmations);
};
const deployToken = () => {
    return TestToken.new();
};
const deployCalls = () => {
    return TestCalls.new();
};

const { should, balanceOf, getParamFromTxEvent } = require('./helpers/utils');

contract('MultiSigWallet', accounts => {
    let multisigInstance;
    let tokenInstance;
    let callsInstance;
    const requiredConfirmations = 2;

    beforeEach(async () => {
        multisigInstance = await deployMultisig(
            [accounts[0], accounts[1]],
            requiredConfirmations
        );
        expect(multisigInstance).to.exist;
        tokenInstance = await deployToken();
        expect(tokenInstance).to.exist;
        callsInstance = await deployCalls();
        expect(callsInstance).to.exist;

        const deposit = 10000000;

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
    });

    it('transferWithPayloadSizeCheck', async () => {
        // Issue tokens to the multisig address
        const issueResult = await tokenInstance.issueTokens(
            multisigInstance.address,
            1000000,
            { from: accounts[0] }
        );
        expect(issueResult).to.exist;
        // Encode transfer call for the multisig
        const transferEncoded = tokenInstance.contract.transfer.getData(
            accounts[1],
            1000000
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                tokenInstance.address,
                0,
                transferEncoded,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        const executedTransactionId = getParamFromTxEvent(
            await multisigInstance.confirmTransaction(transactionId, {
                from: accounts[1]
            }),
            'transactionId',
            null,
            'Execution'
        );
        // Check that transaction has been executed
        expect(transactionId.equals(executedTransactionId)).to.exist;
        // Check that the transfer has actually occured
        const balanceOfAccount1 = await tokenInstance.balanceOf(accounts[1]);
        balanceOfAccount1.should.be.bignumber.equal(1000000);
    });

    it('transferFailure', async () => {
        // Encode transfer call for the multisig
        const transferEncoded = tokenInstance.contract.transfer.getData(
            accounts[1],
            1000000
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                tokenInstance.address,
                0,
                transferEncoded,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );
        // Transfer without issuance - expected to fail
        const failedTransactionId = getParamFromTxEvent(
            await multisigInstance.confirmTransaction(transactionId, {
                from: accounts[1]
            }),
            'transactionId',
            null,
            'ExecutionFailure'
        );
        // Check that transaction has been executed
        expect(transactionId.equals(failedTransactionId)).to.exist;
    });

    it('callReceive1uint', async () => {
        // Encode call for the multisig
        const receive1uintEncoded = callsInstance.contract.receive1uint.getData(
            12345
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                callsInstance.address,
                67890,
                receive1uintEncoded,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        const executedTransactionId = getParamFromTxEvent(
            await multisigInstance.confirmTransaction(transactionId, {
                from: accounts[1]
            }),
            'transactionId',
            null,
            'Execution'
        );
        // Check that transaction has been executed
        expect(transactionId.equals(executedTransactionId)).to.exist;
        // Check that the expected parameters and values were passed

        const callsInstanceUint1 = await callsInstance.uint1();
        callsInstanceUint1.should.be.bignumber.equal(12345);

        const callsInstanceLastMessageDataLength = await callsInstance.lastMsgDataLength();
        callsInstanceLastMessageDataLength.should.be.bignumber.equal(32 + 4);

        const callsInstanceLastMessage = await callsInstance.lastMsgValue();
        callsInstanceLastMessage.should.be.bignumber.equal(67890);
    });

    it('callReceive2uint', async () => {
        // Encode call for the multisig
        const receive2uintsEncoded = callsInstance.contract.receive2uints.getData(
            12345,
            67890
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                callsInstance.address,
                4040404,
                receive2uintsEncoded,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        const executedTransactionId = getParamFromTxEvent(
            await multisigInstance.confirmTransaction(transactionId, {
                from: accounts[1]
            }),
            'transactionId',
            null,
            'Execution'
        );
        // Check that transaction has been executed
        expect(transactionId.equals(executedTransactionId)).to.exist;
        // Check that the expected parameters and values were passed

        const callsInstanceUint1 = await callsInstance.uint1();
        callsInstanceUint1.should.be.bignumber.equal(12345);

        const callsInstanceUint2 = await callsInstance.uint2();
        callsInstanceUint2.should.be.bignumber.equal(67890);

        const callsInstanceLastMessageDataLength = await callsInstance.lastMsgDataLength();
        callsInstanceLastMessageDataLength.should.be.bignumber.equal(
            32 + 32 + 4
        );

        const callsInstanceLastMessage = await callsInstance.lastMsgValue();
        callsInstanceLastMessage.should.be.bignumber.equal(4040404);
    });

    it('callReceive1bytes', async () => {
        // Encode call for the multisig
        const dataHex = '0x' + '0123456789abcdef'.repeat(100); // 800 bytes long

        const receive1bytesEncoded = callsInstance.contract.receive1bytes.getData(
            dataHex
        );
        const transactionId = getParamFromTxEvent(
            await multisigInstance.submitTransaction(
                callsInstance.address,
                10,
                receive1bytesEncoded,
                { from: accounts[0] }
            ),
            'transactionId',
            null,
            'Submission'
        );

        const executedTransactionId = getParamFromTxEvent(
            await multisigInstance.confirmTransaction(transactionId, {
                from: accounts[1]
            }),
            'transactionId',
            null,
            'Execution'
        );
        // Check that transaction has been executed
        expect(transactionId.equals(executedTransactionId)).to.exist;
        // Check that the expected parameters and values were passed

        const callsInstanceLastMessageDataLength = await callsInstance.lastMsgDataLength();
        // 800 bytes data + 32 bytes offset + 32 bytes data length + 4 bytes method signature
        callsInstanceLastMessageDataLength.should.be.bignumber.equal(868);

        const callsInstanceLastMessage = await callsInstance.lastMsgValue();
        callsInstanceLastMessage.should.be.bignumber.equal(10);

        const byteArray1 = await callsInstance.byteArray1();
        byteArray1.should.be.bignumber.equal(dataHex);
    });
});
