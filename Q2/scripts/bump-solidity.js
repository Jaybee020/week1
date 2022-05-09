const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/
const _plonkverifierRegex=/contract PlonkVerifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
let multiplier3content=fs.readFileSync("./contracts/Multiplier3-groth16Verifier.sol",{encoding:'utf-8'})
let multiplier3bumbped=multiplier3content.replace(solidityRegex,'pragma solidity ^0.8.0')
multiplier3bumbped=multiplier3bumbped.replace(verifierRegex,'contract Multiplier3Verifier')
fs.writeFileSync("./contracts/Multiplier3-groth16Verifier.sol",multiplier3bumbped)

let _plonkmultiplier3content=fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol",{encoding:'utf-8'})
let _plonkmultiplier3bumbped=_plonkmultiplier3content.replace(solidityRegex,'pragma solidity ^0.8.0')
_plonkmultiplier3bumbped=_plonkmultiplier3bumbped.replace(_plonkverifierRegex,'contract _plonkMultiplier3Verifier')
fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol",_plonkmultiplier3bumbped)


