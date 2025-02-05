let lhs = ""; // Left hand side operand 
let rhs = ""; // Right hand side operand
let operator = "";

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
    switch (operator) {
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "*": return multiply(a, b);
        case "/": return divide(a, b);
    }
}

function syncDisplay() {
    setDisplay(`${lhs} ${operator} ${rhs}`.trim());
}

function setDisplay(str) {
    document.querySelector("#display").textContent = str;
}

function setup() {
    document.querySelector("#calculator").addEventListener("click", onClick);
}

function onClick(evt) {
    if (!("value" in evt.target)) {
        return;
    }

    const value = evt.target.value;

    if (value === 'C')          { onClearClicked(value); return; }
    if (value.match(/[0-9]/))   { onNumberClicked(value); return; }
    if (value.match(/[÷×−+=]/)) { onOperatorClicked(value); return; }
}

function onClearClicked(value) {
    lhs = "";
    rhs = "";
    operator = "";
    setDisplay("\u00A0");
}

function onNumberClicked(value) {
    if (operator.length == 0) {
        lhs += value;
    }
    else {
        rhs += value;
    }

    syncDisplay();
}

function onOperatorClicked(value) {
    // Normalize the operators.
    switch (value) {
        case "÷": operator = "/"; break;
        case "×": operator = "*"; break;
        case "−": operator = "-"; break;
        case "+": operator = "+"; break;
        case "=": operator = "="; break;
        default: 
            console.log("Invalid operator");
            return;
    }

    syncDisplay();
}

setup();