let lhs = "";       // Left hand side operand 
let rhs = "";       // Right hand side operand
let symbol = "";    // Symbol of the operation.
let operation = ""; // Identifier of the operation to execute.
// Flag indicating whether the left hand side operand is the result of a previous operation or not.
let lhsIsResult = false;
// Defines a diccionary to convert an operation identifier to an operator
let idToOp = {
    "div": "/",
    "mul": "*",
    "sub": "-",
    "add": "+",
    "eq" : "="
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) { 
    return a - b;
}

function multiply(a, b) { 
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    if (typeof a !== Number) {
        a = parseFloat(a);
        if (isNaN(a)) {
            return "ERROR";
        }
    }

    if (typeof b !== Number) {
        b = parseFloat(b);
        if (isNaN(b)) { 
            return "ERROR";
        }
    }

    switch (operator) {
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "*": return multiply(a, b);
        case "/": return divide(a, b);
    }
}

function syncDisplay() {
    if (lhs.length > 0 || rhs.length > 0 || symbol > 0) {
        setDisplay(`${lhs} ${symbol} ${rhs}`.trim());
    } else {
        setDisplay("\u00A0");
    }

    clearDisplayError();
}

function setDisplay(str) {
    document.querySelector("#display .text").textContent = str;
}

function setDisplayError(str) {
    let display = document.querySelector("#display");
    let error   = document.querySelector("#display .error");

    error.textContent   = str;
    error.style.display = "block";
}

function clearDisplayError() {
    let display = document.querySelector("#display");
    let error   = document.querySelector("#display .error");

    error.textContent = "";
    error.style.display = "none";
}

function setup() {
    document.querySelector("#calculator").addEventListener("click", onClick);
}

function onClick(evt) {
    if (!(evt.target instanceof HTMLInputElement)) {
        return;
    }

    const id    = evt.target.id;
    const value = evt.target.value;

    if (id === 'cls') {
        onClearClicked();
    } 
    else if (id in idToOp) {
        onOperatorClicked(id, value);
    } 
    else if (value.match(/[0-9]/)) {
        onNumberClicked(value);
    }
}

function onClearClicked() {
    lhs = "";
    rhs = "";
    symbol = "";
    operation = "";
    lhsIsResult = false;
    syncDisplay();
}

function onNumberClicked(value) {
    if (symbol.length == 0) {
        if (lhsIsResult) {
            lhs = value;
            lhsIsResult = false;
        } else {
            lhs += value;
        }
    }
    else {
        rhs += value;
    }

    syncDisplay();
}

function onOperatorClicked(id, value) {
    if (id === "eq") {
        // Operation is complete.
        if (lhs.length > 0 && rhs.length > 0) {
            lhs = makeLongNumberShort(operate(operation, lhs, rhs).toString());
            rhs = "";
            symbol = "";
            operation = "";
            lhsIsResult = true;
            syncDisplay();
        }
        // No righ hand side operand.
        else if (lhs.length > 0 && operation.length > 0) {
            setDisplayError("Malformed expression");
        }
    }
    else {
        symbol    = value;
        operation = idToOp[id];
        syncDisplay();
    }
}

function makeLongNumberShort(str, length = 10) {
    const BIG_LENGTH = 1;
    const DOT_LENGTH = 1;
    const big        = parseFloat("9".repeat(length));
    const number     = parseFloat(str);

    if (str.length > length) {
        // Big numbers are transformed to exponential notation.
        if (number > big) {
            str = number.toExponential(length - DOT_LENGTH - BIG_LENGTH);
        }
        // Other numbers are round to fit in the maximum length.
        else {
            const index = str.indexOf(".");
            const numberIntegerLength = index;
            const numberDecimalLength = str.length - index - DOT_LENGTH;
            const numberOfDecimals = Math.min(numberDecimalLength, length - numberIntegerLength - DOT_LENGTH);

            str = number.toFixed(numberOfDecimals);
        }
    }

    return str;
}

setup();