enum Operation {
    Add = '+',
    Subtract = '-',
    Multiply = '*',
    Divide = '/',
    Modulo = '%',
    Power = '^',
    Factorial = '!',
}

type FactorialMap = {
    [key: number]: number;
};

function factorial(num: number, memo: FactorialMap = {}): number {
    if (num === 0) {
        return 1;
    }

    if (memo[num]) {
        return memo[num];
    }

    return num * factorial(num - 1, memo);
}

function calculate(operation: Operation, num1: number, num2: number | null): number | undefined {
    if (num2 === null && operation !== Operation.Factorial) {
        throw new Error('Invalid operation');
    } else {
        num2 = num2 || 0;
    }

    switch (operation) {
        case Operation.Add:
            return num1 + num2;
        case Operation.Subtract:
            return num1 - num2;
        case Operation.Multiply:
            return num1 * num2;
        case Operation.Divide:
            return num1 / num2;
        case Operation.Power:
            return Math.pow(num1, num2);
        case Operation.Modulo:
            return num1 % num2;
        case Operation.Factorial:
            return factorial(num1);
    }
}

function isDigit(char: string): boolean {
    if (char.length !== 1) {
        let digit = true;

        for (const c of char) {
            digit = digit && isDigit(c);
        }

        return digit;
    }

    return char >= '0' && char <= '9';
}

function isOperator(char: string) {
    return char === Operation.Add ||
        char === Operation.Subtract ||
        char === Operation.Multiply ||
        char === Operation.Divide ||
        char === Operation.Power ||
        char === Operation.Modulo ||
        char === Operation.Factorial;
}

function isLeftParen(char: string): boolean {
    return char === '(';
}

function isRightParen(char: string): boolean {
    return char === ')';
}

function isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t';
}

function isHigherPrecedence(op1: Operation, op2: Operation): boolean {
    return getPrecedence(op1) > getPrecedence(op2);
}

function getPrecedence(op: Operation): number {
    switch (op) {
        case Operation.Add:
        case Operation.Subtract:
            return 1;
        case Operation.Multiply:
        case Operation.Divide:
        case Operation.Modulo:
            return 2;
        case Operation.Power:
        case Operation.Factorial:
            return 3
        default:
            return 4;
    }
}


function peek(stack: string[]): string | undefined {
    return stack[stack.length - 1];
}

function parseInput(text: string): number | undefined {
    let stack: string[] = [];
    let expression: string[] = [];
    let currentPos = 0;

    while (currentPos < text.length) {
        let char = text[currentPos];

        if (isLeftParen(char)) {
            stack.push(char);
        } else if (isRightParen(char)) {
            while (stack.length > 0 && !isLeftParen(peek(stack) as string)) {
                expression.push(stack.pop() as string);
            }

            if (stack.length === 0) {
                throw new Error('Mismatched parentheses');
            }

            stack.pop();
        } else if (isDigit(char)) {
            let num = '';

            while (currentPos < text.length && isDigit(char)) {
                num += char;
                char = text[++currentPos];
            }

            expression.push(num);
            continue;
        } else if (isOperator(char)) {
            if (isHigherPrecedence(char as Operation, peek(stack) as Operation)) {
                stack.push(char);
                currentPos++;
                continue;
            }

            if (stack.length > 0 && !isLeftParen(peek(stack) as string)) {
                expression.push(stack.pop() as string);
            }

            stack.push(char);
        } else if (!isWhitespace(char)) {
            throw new Error('Invalid character');
        }

        currentPos++;
    }

    while (stack.length > 0) {
        expression.push(stack.pop() as string);
    }

    return calculatePostfix(expression);
}

function calculatePostfix(expression: string[]): number | undefined {
    let stack: number[] = [];

    for (const val of expression) {
        if (isDigit(val)) {
            stack.push(parseInt(val));
        } else if (isOperator(val)) {
            if (val === Operation.Factorial) {
                let num = stack.pop();

                if (num === undefined) {
                    throw new Error('Invalid expression');
                }

                stack.push(calculate(val as Operation, num, null) as number);
                continue;
            }

            let num2 = stack.pop();
            let num1 = stack.pop();

            if (num1 === undefined || num2 === undefined) {
                throw new Error('Invalid expression');
            }

            stack.push(calculate(val as Operation, num1, num2) as number);
        }
    }

    if (stack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return stack.pop();
}

export { parseInput as calculaterStack };
