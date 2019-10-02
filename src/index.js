function eval() {
    // Do not use eval!!!
    return;
}
const exprWeight = new Map([['(', 0], [')', 0], ['+', 1], ['-', 1], ['*', 2], ['/', 2]]);

function calculateRPN(a, b, operator) {
    let answer = 0;
    switch (operator) {
        case '*':
            answer = a * b;
            break;
        case '/':
            if( b === 0) {
                throw 'TypeError: Division by zero.';
            } else {
                answer = a / b;
            }
            break;
        case '+':
            answer = a + b;
            break;
        case '-':
            answer = a - b;
            break;
    }
    return answer;
}

function checkExpressionBrackets(exprArr) {
    const openBracketsCount = exprArr.filter(symbol => symbol === '(').length;
    const closeBracketsCount = exprArr.filter(symbol => symbol === ')').length;
    if (openBracketsCount !== closeBracketsCount) {
        throw 'ExpressionError: Brackets must be paired';
    } else {
        return exprArr;
    }
}

function parseExpressionString (exprString) {
    const exprArr = [];
    exprString.replace(' ', '').split('').forEach((symbol, i) => {
        if (!exprArr.length) {
            exprArr.push(symbol);
        }
        else if (exprWeight.has(symbol)) {
            exprArr.push(symbol);
        }
        else if (Number.isInteger(parseInt(symbol))) {
            const prev = exprArr.slice(-1)[0];
            if (Number.isInteger(parseInt(prev))) {
                const prevInt = exprArr.pop()
                exprArr.push(prevInt + symbol);
            } else {
                exprArr.push(symbol);
            }
        }
    });
    return checkExpressionBrackets(exprArr);
}

function expressionToRPN(exprArr) {
    const operators = [];
    const RPNexpr = [];
    exprArr.forEach((symbol, i) => {
        if (Number.isInteger(parseInt(symbol))) {
            RPNexpr.push(symbol);
        } else {
            if (!operators.length) {
                operators.push(symbol);
            } else if (exprWeight.get(symbol) > exprWeight.get(operators.slice(-1)[0])) {
                operators.push(symbol);
            } else if (symbol === '(') {
                operators.push(symbol);
            } else if (symbol === ')') {
                while (operators.slice(-1)[0] !== '(' && operators.slice(-1)[0]) {
                    const lastOperator = operators.pop();
                    if (lastOperator !== '(') {
                        RPNexpr.push(lastOperator);
                    }
                }
                if(operators.slice(-1)[0] === '(') {
                    operators.pop();
                }
            } else if (exprWeight.get(symbol) <= exprWeight.get(operators.slice(-1)[0])) {
                while (operators.slice(-1)[0] && exprWeight.get(symbol) <= exprWeight.get(operators.slice(-1)[0])) {
                    const lastOperator = operators.pop();
                    RPNexpr.push(lastOperator);
                }
                operators.push(symbol);
            }
        }
    });

    return RPNexpr.concat(operators.reverse());
}

function expressionCalculator(expr) {
    const exprArr = parseExpressionString(expr);
    const finalRPN = expressionToRPN(exprArr);
    const stackForCalculation = [];

    finalRPN.forEach((operator) => {
        if (parseInt(operator) || parseInt(operator) === 0) {
            stackForCalculation.push(operator);
        } else {
            const val2 = stackForCalculation.pop();
            const val1 = stackForCalculation.pop();
            stackForCalculation.push(calculateRPN(+val1, +val2, operator));
        }
    })
    return stackForCalculation[0];
}
module.exports = {
    expressionCalculator
}