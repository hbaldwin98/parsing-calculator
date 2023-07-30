enum TokenType {
    NUMBER = 'Number',
    PLUS = 'Plus',
    MINUS = 'Minus',
    MULTIPLY = 'Multiply',
    DIVIDE = 'Divide',
    POWER = 'Power',
    FACTORIAL = 'Factorial',
    MODULO = 'Modulo',
    LPAREN = 'LParen',
    RPAREN = 'RParen',
    EOF = 'EOF'
}

class Token {
    type: TokenType;
    text: string | null;

    constructor(type: TokenType, text: string | null) {
        this.type = type;
        this.text = text;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export { Token, TokenType };
