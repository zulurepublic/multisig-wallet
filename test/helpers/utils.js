const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

function isException(error) {
    let strError = error.toString();
    return (
        strError.includes('invalid opcode') ||
        strError.includes('invalid JUMP') ||
        strError.includes('revert')
    );
}

function ensuresException(error) {
    assert(isException(error), error.toString());
}

function getParamFromTxEvent(
    transaction,
    paramName,
    contractFactory,
    eventName
) {
    assert.isObject(transaction);
    let logs = transaction.logs;
    if (eventName != null) {
        logs = logs.filter(l => l.event === eventName);
    }
    assert.equal(logs.length, 1, 'too many logs found!');
    let param = logs[0].args[paramName];
    if (contractFactory != null) {
        let contract = contractFactory.at(param);
        assert.isObject(contract, `getting ${paramName} failed for ${param}`);
        return contract;
    } else {
        return param;
    }
}

function balanceOf(web3, account) {
    return new Promise((resolve, reject) =>
        web3.eth.getBalance(
            account,
            (e, balance) => (e ? reject(e) : resolve(balance))
        )
    );
}

async function assertThrowsAsynchronously(test, error) {
    try {
        await test();
    } catch (e) {
        if (!error || e instanceof error) return 'everything is fine';
    }
    throw new Error('Missing rejection' + (error ? ' with ' + error.name : ''));
}

module.exports = {
    should,
    ensuresException,
    getParamFromTxEvent,
    balanceOf,
    assertThrowsAsynchronously
};
