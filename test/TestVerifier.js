// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');

// - use the contents from proof.json generated from zokrates steps
var verifierProof = require('../zokrates/code/square/proof.json');
contract('TestVerifier', accounts => {
    const account_1 = accounts[0];
    describe('match Verifier spec', function () {
        beforeEach(async function () {
            this.contract = await Verifier.new({ from: account_1 });
        })
        // Test verification with correct proof
        it('verification with correct proof', async function () {
            let success = false;
            success = await this.contract.verifyTx.call(verifierProof.proof.a, verifierProof.proof.b, verifierProof.proof.c, verifierProof.inputs, { from: account_1 });
            assert.equal(success, true, 'The verification failed with correct proof');
        })
        // Test verification with incorrect proof
        it('verification with incorrect proof', async function () {
            let wrongInput = ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000000000000000000000000000"];
            let success = true;
            success = await this.contract.verifyTx.call(verifierProof.proof.a, verifierProof.proof.b, verifierProof.proof.c, wrongInput, { from: account_1 });
            assert.equal(success, false, 'The verification passed with wrong proof');
        })
    })


})