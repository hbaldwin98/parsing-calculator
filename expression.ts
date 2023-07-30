import { Token } from "./token";

class Expression { }

class BinaryExpression extends Expression {
    left: Expression;
    op: Token;
    right: Expression;

    constructor(left: Expression, op: Token, right: Expression) {
        super();
        this.left = left;
        this.op = op;
        this.right = right;
    }
}

class UnaryExpression extends Expression {
    op: Token;
    expr: Expression;

    constructor(op: Token, expr: Expression) {
        super();
        this.op = op;
        this.expr = expr;
    }
}

class NumberExpression extends Expression {
    token: Token;
    value: number;

    constructor(token: Token) {
        super();
        this.token = token;
        this.value = Number(token.text);
    }
}

export { Expression, BinaryExpression, UnaryExpression, NumberExpression };
