var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var verifierProof = require('../zokrates/code/square/proof.json');
var config = require('../zokrates/code/square/config.json');
const truffleAssert = require('truffle-assertions');
contract('TestSolnSquareVerifier', accounts => {
    const account_1 = accounts[0];
    const account_2 = accounts[1];
    let name = "Udacity Real Estate";
    let symbol = "URE";
    let tokenId = 1;

    describe('match SolnSquareVerifier spec', function () {
        beforeEach(async function () {
            this.contract = await SolnSquareVerifier.new(config.verifierAddress, name, symbol, { from: account_1 });
        })
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add new solution ', async function () {
            let tx = await this.contract.addSolutions(account_1, tokenId, verifierProof.proof.a, verifierProof.proof.b, verifierProof.proof.c, verifierProof.inputs, { from: account_1 });
            truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
                assert.equal(ev.tokenId + "," + ev.account, tokenId + "," + account_1, 'Wrong SolutionAdded event parameters');
                return true;
            }, 'Contract should return the correct SolutionAdded event.');
        })
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint ERC721 token', async function () {
            await this.contract.addSolutions(account_2, tokenId, verifierProof.proof.a, verifierProof.proof.b, verifierProof.proof.c, verifierProof.inputs, { from: account_1 });
            let tx = await this.contract.mintNFT(account_2, tokenId, verifierProof.proof.a, verifierProof.proof.b, verifierProof.proof.c, verifierProof.inputs, { from: account_1 });
            zeroAddress = "0x0000000000000000000000000000000000000000";
            truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
                assert.equal(ev.from + "," + ev.to + "," + ev.tokenId, zeroAddress + "," + account_2 + "," + tokenId, 'Wrong Transfer event parameters');
                return true;
            }, 'Contract should return the correct Transfer event.');
            let ownerOfToken = await this.contract.ownerOf.call(tokenId);
            let tokenBalance2 = await this.contract.balanceOf.call(account_2);
            let totalSupply = await this.contract.totalSupply.call();
            let _name = await this.contract.name.call();
            let _symbol = await this.contract.symbol.call();
            let baseURI = await this.contract.baseTokenURI.call();
            let tokenURI = await this.contract.tokenURI.call(tokenId);
            assert.equal(ownerOfToken, account_2, 'The owner of token is wrong');
            assert.equal(tokenBalance2, 1, 'The token balance of account_2 is wrong');
            assert.equal(totalSupply, 1, 'The total supply of token is wrong');
            assert.equal(tokenURI, baseURI + tokenId, 'The tokenURI is wrong');
            assert.equal(_name, name, 'The token name is wrong');
            assert.equal(_symbol, symbol, 'The token symbol is wrong');

        })
    })


})