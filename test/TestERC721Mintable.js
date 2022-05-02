var ERC721MintableComplete = artifacts.require('CapStoneRealEstateToken');
const truffleAssert = require('truffle-assertions');
contract('TestERC721Mintable', accounts => {
    const account_1 = accounts[0];
    const account_2 = accounts[1];
    const account_3 = accounts[2];
    const account_4 = accounts[3];
    const account_5 = accounts[4];
    const mintTokenCount = 12;
    const acct2TokenCnt = 4;
    const acct3TokenCnt = 3;
    const acct4TokenCnt = 3;
    const acct5TokenCnt = 2;
    let name = "Udacity Real Estate";
    let symbol = "URE";
    describe('match erc721 spec', function () {
        beforeEach(async function () {

            this.contract = await ERC721MintableComplete.new(name, symbol, { from: account_1 });
            // TODO: mint multiple tokens
            for (let i = 1; i <= mintTokenCount; i++) {
                switch (i) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        await this.contract.mint(account_2, i, { from: account_1 });
                        break;
                    case 5:
                    case 6:
                    case 7:
                        await this.contract.mint(account_3, i, { from: account_1 });
                        break;
                    case 8:
                    case 9:
                    case 10:
                        await this.contract.mint(account_4, i, { from: account_1 });
                        break;
                    case 11:
                    case 12:
                        await this.contract.mint(account_5, i, { from: account_1 });
                        break;
                }
                // console.log(i);
            }
        })

        it('should return total supply', async function () {
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, mintTokenCount, 'The total supply of token is wrong');
        })

        it('should get token balance', async function () {
            let tokenBalance2 = await this.contract.balanceOf.call(account_2);
            let tokenBalance3 = await this.contract.balanceOf.call(account_3);
            let tokenBalance4 = await this.contract.balanceOf.call(account_4);
            let tokenBalance5 = await this.contract.balanceOf.call(account_5);
            assert.equal(tokenBalance2, acct2TokenCnt, 'The token balance of account_2 is wrong');
            assert.equal(tokenBalance3, acct3TokenCnt, 'The token balance of account_3 is wrong');
            assert.equal(tokenBalance4, acct4TokenCnt, 'The token balance of account_4 is wrong');
            assert.equal(tokenBalance5, acct5TokenCnt, 'The token balance of account_5 is wrong');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let _name = await this.contract.name.call();
            let _symbol = await this.contract.symbol.call();
            let baseURI = await this.contract.baseTokenURI.call();
            let tokenId = 1;
            let tokenURI = await this.contract.tokenURI.call(tokenId);
            assert.equal(tokenURI, baseURI + tokenId, 'The tokenURI is wrong');
            assert.equal(_name, name, 'The token name is wrong');
            assert.equal(_symbol, symbol, 'The token symbol is wrong');
        })

        it('should transfer token from one owner to another', async function () {
            let tokenId = 1;
            let tokenBalanceBefore2 = await this.contract.balanceOf.call(account_2);
            let tokenBalanceBefore3 = await this.contract.balanceOf.call(account_3);
            let ownerBefore = await this.contract.ownerOf.call(tokenId);
            let tx = await this.contract.transferFrom(account_2, account_3, tokenId, { from: account_2 });
            truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
                assert.equal(ev.from + "," + ev.to + "," + ev.tokenId, account_2 + "," + account_3 + "," + tokenId, 'Wrong Transfer event parameters');
                return true;
            }, 'Contract should return the correct Transfer event.');

            let tokenBalanceAfter2 = await this.contract.balanceOf.call(account_2);
            let tokenBalanceAfter3 = await this.contract.balanceOf.call(account_3);
            let ownerAfter = await this.contract.ownerOf.call(tokenId);
            let tokenDiffOf2 = Number(tokenBalanceBefore2) - Number(tokenBalanceAfter2);
            let tokenDiffOf3 = Number(tokenBalanceAfter3) - Number(tokenBalanceBefore3);
            assert.equal(tokenDiffOf2, 1, 'The token count is wrong');
            assert.equal(tokenDiffOf3, 1, 'The token count is wrong');
            assert.equal(ownerBefore, account_2, 'The owner before transfer is wrong');
            assert.equal(ownerAfter, account_3, 'The owner after transfer is wrong');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new(name, symbol, { from: account_1 });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let tokenID = 1;
            err = false;
            try {
                await this.contract.mint(account_2, tokenID, { from: account_2 });
            } catch (error) {
                // console.log(error);
                err = true;
            }
            assert.equal(err, true, 'Non-contract owner able to mint token');
        })

        it('should return contract owner', async function () {
            let owner = await this.contract.getOwner.call();
            assert.equal(owner, account_1, 'The contract owner is not the owner');
        })

    });
})