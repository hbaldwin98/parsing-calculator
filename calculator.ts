import Lexer from './lexer';
import Parser from './parser';
import Interpreter from './interpreter';

class Calculator {
    static interpreter: Interpreter;

    constructor() { }

    public static calculate(expression: string): number | undefined {
        if (expression === '') {
            return 0;
        }

        if (!Calculator.interpreter) {
            let lexer = new Lexer(expression);
            let parser = new Parser(lexer);
            Calculator.interpreter = new Interpreter(parser);
        }

        return Calculator.interpreter.interpret_text(expression);
    }

    public static logError(message: string, char: string) {
        throw new Error(`LexerError: ${message} ${char}`);
    }
}

export default Calculator;
