const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16,plonk } = require("snarkjs");
const { sha256 } = require("ethers/lib/utils");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("LessThan10", function () {
    let Verifier;
    let verifier;
    

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("lessthanVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        //this creates a groth16 proof system with input signals 1 and 2.It takes in the test values,the path to the web assemply file and link to the proving key and returns an object containing proof and Publicsignal
        const { proof, publicSignals } = await groth16.fullProve({"in":"11"}, "contracts/circuits/lessthan/Lessthan10_js/Lessthan10.wasm","contracts/circuits/lessthan/circuit_final.zkey");

        console.log('Output',publicSignals[0]);//gtabbing the first public signal as defined in the circuit code(which is c)

        const editedPublicSignals = unstringifyBigInts(publicSignals);//change to big int 
        const editedProof = unstringifyBigInts(proof);//change to big int
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);//this function helps to simulate a verification call(inputs are proofs and public signals)and returns suitable argument for the deployed verifier smart contract.
        // console.log(calldata)
    
        //using regex to obtain argument array and destructure them into proper argument
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString()); 
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;//calling the verify proof function from the deployed verifier contract and passing correct parameters
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;//passing wrong parameters into verifyProod functtion
    });
});


describe("RangeProof",function(){
    let Verifier;
    let verifier;
    

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("RangeProofVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        //this creates a groth16 proof system with input signals 1 and 2.It takes in the test values,the path to the web assemply file and link to the proving key and returns an object containing proof and Publicsignal
        const { proof, publicSignals } = await groth16.fullProve({"in":"18","range":[5,15]}, "contracts/circuits/RangeProof/RangeProof_js/RangeProof.wasm","contracts/circuits/RangeProof/circuit_final.zkey");

        console.log('Output',publicSignals[0]);//gtabbing the first public signal as defined in the circuit code(which is c)

        const editedPublicSignals = unstringifyBigInts(publicSignals);//change to big int 
        const editedProof = unstringifyBigInts(proof);//change to big int
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);//this function helps to simulate a verification call(inputs are proofs and public signals)and returns suitable argument for the deployed verifier smart contract.
        // console.log(calldata)
    
        //using regex to obtain argument array and destructure them into proper argument
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString()); 
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;//calling the verify proof function from the deployed verifier contract and passing correct parameters
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;//passing wrong parameters into verifyProod functtion
    });
})