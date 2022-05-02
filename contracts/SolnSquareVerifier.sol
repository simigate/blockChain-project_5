pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CapStoneRealEstateToken {
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address account;
    }

    // TODO define an array of the above struct
    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;
    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address account);
    Verifier verifier;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public CapStoneRealEstateToken(name, symbol) {
        verifier = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolutions(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        require(verifier.verifyTx(a, b, c, input), "Solution is not valid");
        bytes32 _solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        require(solutions[_solutionKey].tokenId == 0, "Solution already exist");
        solutions[_solutionKey] = Solution({tokenId: tokenId, account: to});
        emit SolutionAdded(tokenId, to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    function mintNFT(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bool success) {
        require(verifier.verifyTx(a, b, c, input), "Solution is not valid");
        bytes32 _solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        require(
            solutions[_solutionKey].tokenId == tokenId &&
                solutions[_solutionKey].account == to,
            "The solution provided does not match token and owner"
        );
        success = super.mint(to, tokenId);
        return success;
    }
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
}

contract Verifier {
    function verifyTx(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bool r);
}
