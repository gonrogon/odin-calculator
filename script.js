let lhs = "";       // Left hand side operand 
let rhs = "";       // Right hand side operand
let symbol = "";    // Symbol of the operation.
let operation = ""; // Identifier of the operation to execute.
// Flag indicating whether the left hand side operand is the result of a previous operation or not.
let lhsIsResult = false;
// Flag indicartin whether the right hand side operand has raised a division by zero error.
let rhsDivByZero = false;
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

function resetState(lhsValue = "") {
    lhs = lhsValue;
    rhs = "";
    symbol = "";
    operation = "";
    lhsIsResult  = false;
    rhsDivByZero = false;
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
    else if (value === "·") {
        onNumberClicked(".");
    }
}

function onClearClicked() {
    resetState();
    syncDisplay();
}

function onNumberClicked(value) {
    if (symbol.length == 0) {
        if (lhsIsResult) {
            lhs = value;
            lhsIsResult = false;
        } else {
            if (value !== "." || !lhs.includes(".")) {
                lhs += value;
            }
        }
    }
    else {
        if (rhsDivByZero) {
            rhs = value;
            rhsDivByZero = false;
        } else {
            if (value !== "." || !rhs.includes(".")) {
                rhs += value;
            }
        }
    }

    syncDisplay();
}

function onOperatorClicked(id, value) {
    if (id === "eq") {
        executeOperation();
    }
    else {
        if (lhs.length > 0 && rhs.length > 0) {
            if (!executeOperation()) {
                return;
            }
        }
        symbol    = value;
        operation = idToOp[id];
        syncDisplay();
    }
}

function executeOperation() {
    // Check if the operation is complete.
    if (lhs.length > 0 && rhs.length > 0) {
        // Division by zero.
        if (operation === "/" && rhs === "0") {
            setDisplayError("Division by zero is not defined");
            rhsDivByZero = true;
            return false;
        }
        // Execute the operation.
        else {
            const result = makeLongNumberShort(operate(operation, lhs, rhs).toString());
            resetState(result);
            syncDisplay();
        }
    }
    else {
        // Check if the operation is missing the right hand side operand.
        if (lhs.length > 0 && operation.length > 0) {
            setDisplayError("Malformed expression");
            return false;
        }
    }

    return true
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