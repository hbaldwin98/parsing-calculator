import Calculator from "./calculator";
import Lexer from "./lexer";
import { Token, TokenType } from "./token";
import { BinaryExpression, Expression, NumberExpression, UnaryExpression } from "./expression";

class Parser {
    lexer: Lexer;
    currentToken: Token;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }

    parse(): Expression {
        return this.expr();
    }

    parse_text(text: string): Expression {
        this.lexer.text = text;
        this.lexer.reset();
        this.currentToken = this.lexer.getNextToken();
        let expr = this.expr();
        return expr;
    }

    consume(tokenType: TokenType): void {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            Calculator.logError('Invalid syntax', this.currentToken.text || '');
        }
    }

    expr(): Expression {
        let node = this.term();
        while (
            this.currentToken.type === TokenType.PLUS ||
            this.currentToken.type === TokenType.MINUS
        ) {
            let token = this.currentToken;
            switch (token.type) {
                case TokenType.PLUS:
                    this.consume(TokenType.PLUS);
                    break;
                case TokenType.MINUS:
                    this.consume(TokenType.MINUS);
                    break;
                default:
                    Calculator.logError('Invalid syntax', token.text || '');
                    break;
            }

            node = new BinaryExpression(node, token, this.term());
        }
        return node;
    }

    factor(): Expression {
        let token = this.currentToken;

        switch (token.type) {
            case TokenType.PLUS:
                this.consume(TokenType.PLUS);
                return new UnaryExpression(token, this.factor());
            case TokenType.MINUS:
                this.consume(TokenType.MINUS);
                return new UnaryExpression(token, this.factor());
            case TokenType.NUMBER:
                if (this.peek()?.type === TokenType.FACTORIAL) {
                    let numberExpr = new NumberExpression(token);
                    this.consume(TokenType.NUMBER);
                    token = this.currentToken;
                    this.consume(TokenType.FACTORIAL);
                    return new UnaryExpression(token, numberExpr);
                }
                this.consume(TokenType.NUMBER);
                return new NumberExpression(token);
            case TokenType.LPAREN:
                this.consume(TokenType.LPAREN);
                let node = this.expr();
                this.consume(TokenType.RPAREN);
                return node;
            default:
                Calculator.logError('Invalid syntax', token.text || '');
                return new NumberExpression(new Token(TokenType.NUMBER, '0'));
        }
    }

    term(): Expression {
        let node = this.factor();

        while (
            this.currentToken.type === TokenType.MULTIPLY ||
            this.currentToken.type === TokenType.DIVIDE ||
            this.currentToken.type === TokenType.MODULO ||
            this.currentToken.type === TokenType.POWER
        ) {
            let token = this.currentToken;
            switch (token.type) {
                case TokenType.MULTIPLY:
                    this.consume(TokenType.MULTIPLY);
                    break;
                case TokenType.DIVIDE:
                    this.consume(TokenType.DIVIDE);
                    break;
                case TokenType.MODULO:
                    this.consume(TokenType.MODULO);
                    break;
                case TokenType.POWER:
                    this.consume(TokenType.POWER);
                    break;
                default:
                    Calculator.logError('Invalid operator', token.text || '');
            }
            node = new BinaryExpression(node, token, this.factor());
        }
        return node;
    }

    peek(): Token | undefined {
        return this.lexer.peekNextToken();
    }
}

export default Parser;
