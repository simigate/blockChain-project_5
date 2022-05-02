// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const fs = require('fs');

module.exports = function (deployer) {

  deployer.deploy(Verifier)
    .then(() => {
      return deployer.deploy(SolnSquareVerifier, Verifier.address, "CapStone Real Estate", "CRE")
        .then(() => {
          let config = {
            verifierAddress: Verifier.address,
            solnSquareVerifier: SolnSquareVerifier.address
          }
          fs.writeFileSync(__dirname + '/../zokrates/code/square/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
        });
    });
}
