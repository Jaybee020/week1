pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom";
 // hint: you can use more than one templates in circomlib-matrix to help you

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component mul= matMul(n,n,1);
    for(var i=0;i<n;i++){
        mul.b[i][0]<==x[i];
        for(var j=0;j<n;j++){
            mul.a[i][j]<==A[i][j];
        }
    }

    var intermediate=1;
    component isEq[n];
    for(var i=0;i<n;i++){
        isEq[i]=IsEqual();
        isEq[i].in[0] <== mul.out[i][0];
        isEq[i].in[1] <== b[i];
        intermediate=intermediate * isEq[i].out;//makes sure intermediate must stay at 1(if it is 0 one test case has failed)
    }
    out<--intermediate;
    out * (out-1) ===   0;//output is either 1 or 0
}

component main {public [A, b]} = SystemOfEquations(3);