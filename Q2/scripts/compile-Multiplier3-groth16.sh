#!/bin/bash

cd contracts/circuits
mkdir Multiplier3-groth16

#to get trusted ceremony parameters (powers of tau)
if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3-groth16.circom..."

# compile circuit

circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3-groth16
snarkjs r1cs info Multiplier3-groth16/Multiplier3.r1cs


# Start a new zkey and make a contribution

snarkjs groth16 setup Multiplier3-groth16/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3-groth16/circuit_0000.zkey  #start power of tau ceremony
snarkjs zkey contribute Multiplier3-groth16/circuit_0000.zkey  Multiplier3-groth16/circuit_final.zkey   --name="1st Contributor Name" -v -e="random text"  #phase 2 of trusted event (adding circuit dependent event)
snarkjs zkey export verificationkey Multiplier3-groth16/circuit_final.zkey Multiplier3-groth16/verification_key.json #export verification key

# generate solidity contract
snarkjs zkey export solidityverifier Multiplier3-groth16/circuit_final.zkey ../Multiplier3-groth16Verifier.sol

cd ../..