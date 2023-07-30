import Calculator from './calculator';
import { BinaryExpression, Expression, NumberExpression, UnaryExpression } from './expression';
import Parser from './parser';
import { TokenType } from './token';

export default class Interpreter {
    parser: Parser;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    interpret(): number {
        let tree = this.parser.parse();
        return this.visit(tree);
    }

    interpret_text(text: string): number {
        let tree = this.parser.parse_text(text);
        return this.visit(tree);
    }

    visit(node: Expression): number {
        switch (node.constructor.name) {
            case 'BinaryExpression':
                return this.visitBinOp(node as BinaryExpression);
            case 'NumberExpression':
                return this.visitNum(node as NumberExpression);
            case 'UnaryExpression':
                return this.visitUnaryOp(node as UnaryExpression);
            default:
                Calculator.logError('Invalid node', node.constructor.name);
                return 0;
        }
    }

    visitBinOp(node: BinaryExpression): number {
        switch (node.op.type) {
            case TokenType.PLUS:
                return this.visit(node.left) + this.visit(node.right);
            case TokenType.MINUS:
                return this.visit(node.left) - this.visit(node.right);
            case TokenType.MULTIPLY:
                return this.visit(node.left) * this.visit(node.right);
            case TokenType.DIVIDE:
                return this.visit(node.left) / this.visit(node.right);
            case TokenType.MODULO:
                return this.visit(node.left) % this.visit(node.right);
            case TokenType.POWER:
                return Math.pow(this.visit(node.left), this.visit(node.right));
            default:
                Calculator.logError('Invalid operator', node.op.text || '');
                return 0;
        }
    }

    visitNum(node: NumberExpression): number {
        return node.value;
    }

    visitUnaryOp(node: UnaryExpression): number {
        switch (node.op.type) {
            case TokenType.PLUS:
                return +this.visit(node.expr);
            case TokenType.MINUS:
                return -this.visit(node.expr);
            case TokenType.FACTORIAL:
                return this.factorial(this.visit(node.expr));
            default:
                Calculator.logError('Invalid operator', node.op.text || '');
                return 0;
        }
    }

    factorial(n: number): number {
        if (n === 0) {
            return 1;
        }
        return n * this.factorial(n - 1);
    }
}

