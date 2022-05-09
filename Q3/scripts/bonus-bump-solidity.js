const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/SystemOfEquationsVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract SystemOfEquationsVerifier');

fs.writeFileSync("./contracts/SystemOfEquationsVerifier.sol", bumped);


let lessthancontent = fs.readFileSync("./contracts/lessthanVerifier.sol", { encoding: 'utf-8' });
let lessthanbumped = lessthancontent.replace(solidityRegex, 'pragma solidity ^0.8.0');
lessthanbumped = lessthanbumped.replace(verifierRegex, 'contract lessthanVerifier');

fs.writeFileSync("./contracts/lessthanVerifier.sol", lessthanbumped);

let Rangedcontent = fs.readFileSync("./contracts/RangeProofVerifier.sol", { encoding: 'utf-8' });
let Rangedbumped = Rangedcontent.replace(solidityRegex, 'pragma solidity ^0.8.0');
Rangedbumped = Rangedbumped.replace(verifierRegex, 'contract RangeProofVerifier');

fs.writeFileSync("./contracts/RangeProofVerifier.sol", Rangedbumped);