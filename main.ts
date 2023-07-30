import Calculator from './calculator';
import { calculaterStack } from './calculator_stack'

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function waitForInput(): void {
    readLine.question('calc> ', (text: string) => {
        try {
            let result = Calculator.calculate(text);
            console.log(result);
        } catch (e) {
            console.log(e);
        }

        waitForInput();
    });
}

function chooseCalculator(): void {
    readLine.question('Choose calculator: 1. Stack, 2. Parser: ', (text: string) => {
        if (text === '1') {
            Calculator.calculate = calculaterStack;
            waitForInput();
        } else if (text === '2') {
            Calculator.calculate = Calculator.calculate;
            waitForInput();
        } else {
            console.log('Invalid choice');
            chooseCalculator();
        }
    });
}

chooseCalculator();

