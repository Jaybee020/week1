#!/bin/bash

cd contracts/circuits

mkdir HelloWorld
#to get trusted ceremony parameters (powers of tau)
if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling HelloWorld.circom..."

# compile circuit

circom HelloWorld.circom --r1cs --wasm --sym -o HelloWorld
snarkjs r1cs info HelloWorld/HelloWorld.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup HelloWorld/HelloWorld.r1cs powersOfTau28_hez_final_10.ptau HelloWorld/circuit_0000.zkey  #start power of tau ceremony
snarkjs zkey contribute HelloWorld/circuit_0000.zkey HelloWorld/circuit_final.zkey --name="1st Contributor Name" -v -e="random text" #phase 2 of trusted event (adding circuit dependent event)
snarkjs zkey export verificationkey HelloWorld/circuit_final.zkey HelloWorld/verification_key.json #export verification key

# generate solidity contract
snarkjs zkey export solidityverifier HelloWorld/circuit_final.zkey ../HelloWorldVerifier.sol

cd ../..