#!/bin/bash

cd contracts/circuits
mkdir _plonkMultiplier3

#to get trusted ceremony parameters (powers of tau)
if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling _plonkMultiplier3.circom..."

# compile circuit

circom Multiplier3.circom --r1cs --wasm --sym -o _plonkMultiplier3
snarkjs r1cs info _plonkMultiplier3/Multiplier3.r1cs


# Start a new zkey and make a contribution

snarkjs plonk setup _plonkMultiplier3/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau _plonkMultiplier3/circuit_0000.zkey  #start power of tau ceremony
#plonk doesnt require second process as it is universal


# generate solidity contract
snarkjs zkey export solidityverifier _plonkMultiplier3/circuit_0000.zkey ../_plonkMultiplier3Verifier.sol #no final .zkzey file only initial created up

cd ../..