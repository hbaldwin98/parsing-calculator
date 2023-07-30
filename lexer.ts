import { Token, TokenType } from './token';
import Calculator from './calculator';

class Lexer {
    text: string;
    pos: number;
    currentChar: string | null;

    constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }

    advance(): void {
        this.pos++;
        if (this.pos > this.text.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = this.text[this.pos];
        }
    }

    skipWhitespace(): void {
        while (this.currentChar !== null && this.currentChar === ' ') {
            this.advance();
        }
    }

    integer(): number {
        let result = '';
        while (this.currentChar !== null && this.isDigit(this.currentChar) || this.currentChar === '.' && this.isDigit(this.peek())) {
            result += this.currentChar;
            this.advance();
        }

        return Number(result);
    }

    isDigit(char: string | undefined): boolean {
        if (!char) {
            return false;
        }

        return char >= '0' && char <= '9';
    }

    getNextToken(): Token {
        while (this.currentChar !== null && this.currentChar !== undefined) {
            if (this.currentChar === ' ') {
                this.skipWhitespace();
                continue;
            } else if (this.isDigit(this.currentChar) || (this.currentChar === '.' && this.isDigit(this.peek()))) {
                return new Token(TokenType.NUMBER, this.integer().toString());
            } else if (this.currentChar === '+') {
                this.advance();
                return new Token(TokenType.PLUS, '+');
            } else if (this.currentChar === '-') {
                this.advance();
                return new Token(TokenType.MINUS, '-');
            } else if (this.currentChar === '*') {
                this.advance();
                return new Token(TokenType.MULTIPLY, '*');
            } else if (this.currentChar === '/') {
                this.advance();
                return new Token(TokenType.DIVIDE, '/');
            } else if (this.currentChar === '(') {
                this.advance();
                return new Token(TokenType.LPAREN, '(');
            } else if (this.currentChar === ')') {
                this.advance();
                return new Token(TokenType.RPAREN, ')');
            } else if (this.currentChar === '%') {
                this.advance();
                return new Token(TokenType.MODULO, '%');
            } else if (this.currentChar === '^') {
                this.advance();
                return new Token(TokenType.POWER, '^');
            } else if (this.currentChar === '!') {
                this.advance();
                return new Token(TokenType.FACTORIAL, '!');
            }
            Calculator.logError('Invalid character', this.currentChar);
        }

        return new Token(TokenType.EOF, null);
    }

    peekNextToken(): Token | undefined {
        let peekPos = this.pos;
        if (peekPos > this.text.length - 1) {
            return new Token(TokenType.EOF, null);
        } else {
            switch (this.text[peekPos]) {
                case '+':
                    return new Token(TokenType.PLUS, '+');
                case '-':
                    return new Token(TokenType.MINUS, '-');
                case '*':
                    return new Token(TokenType.MULTIPLY, '*');
                case '/':
                    return new Token(TokenType.DIVIDE, '/');
                case '(':
                    return new Token(TokenType.LPAREN, '(');
                case ')':
                    return new Token(TokenType.RPAREN, ')');
                case '%':
                    return new Token(TokenType.MODULO, '%');
                case '^':
                    return new Token(TokenType.POWER, '^');
                case '!':
                    return new Token(TokenType.FACTORIAL, '!');
                default:
                    return;
            }
        }
    }

    peek(): string | undefined {
        let peekPos = this.pos + 1;
        if (peekPos > this.text.length - 1) {
            return;
        } else {
            return this.text[peekPos];
        }
    }

    reset(): void {
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }
}

export default Lexer;

