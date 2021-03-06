const { Tokenizer } = require("./Tokenizer")

/**
 * Letter Parser: Recursive descent implementation of the parser.
 */

class Parser {
  constructor() {
    this._string = ""
    this._tokenizer = new Tokenizer()
  }

  /**
   * Parers the given string string into a AST.
   * @param {string} string - The string string to parse.
   * @return {AST} - The AST.
   */
  parse(string) {
    this._string = string
    this._tokenizer.init(string)

    // Prime the _tokenize to obtain the first token.
    // token which is our _lookahead. The lookahead is
    // used for predictive parsing.

    this._lookahead = this._tokenizer.getNextToken()

    // Parse recursively starting from the main
    // entry point of the program.
    return this.Program()
  }

  /**
   * Main entry point for the parser.
   *
   * Program
   *  : Literal
   */
  Program() {
    return {
      type: "Program",
      body: this.StatementList(),
    }
  }

  /**
   * StatementList
   * : Statement
   * | StatementList Statement;
   */
  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()]

    while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement())
    }

    return statementList
  }

  /**
   * Statement
   *  : ExpressionStatement
   * | BlockStatement
   */
  Statement() {
    switch (this._lookahead.type) {
      case this._tokenizer.TokenType.SEMICOLON:
        return this.EmptyStatement()
      case this._tokenizer.TokenType.CURLY_OPEN:
        return this.BlockStatement()
      default:
        return this.ExpressionStatement()
    }
  }

  EmptyStatement() {
    this._eat(this._tokenizer.TokenType.SEMICOLON)
    return {
      type: "EmptyStatement",
    }
  }

  /**
   * BlockStatement
   *  : '{' StatementList '}'
   */
  BlockStatement() {
    this._eat(this._tokenizer.TokenType.CURLY_OPEN)

    const body =
      this._lookahead.type != this._tokenizer.TokenType.CURLY_CLOSE
        ? this.StatementList(this._tokenizer.TokenType.CURLY_CLOSE)
        : []

    this._eat(this._tokenizer.TokenType.CURLY_CLOSE)
    return {
      type: "BlockStatement",
      body,
    }
  }

  /**
   * ExpressionStatement
   * : Expression ';'
   */
  ExpressionStatement() {
    const expression = this.Expression()
    this._eat(this._tokenizer.TokenType.SEMICOLON)
    return {
      type: "ExpressionStatement",
      expression,
    }
  }

  /**
   * Expression
   * : Expression ';'
   */
  Expression() {
    return this.AdditiveExpression()
  }

  /**
   * Additive Expression
   *  : MultiplicativeExpression
   * |  AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression -> MultiplicativeExpression ADDITIVE_OPERATOR AdditiveExpression
   */
  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      this._tokenizer.TokenType.ADDITIVE_OPERATOR
    )
  }

  /**
   * MultiplicativeExpression
   * : NumericalLiteral
   * |  MultiplicativeExpression MULTIPLICATIVE_OPERATOR NumericalLiteral -> NumericalLiteral MULTIPLICATIVE_OPERATOR <MultiplicativeExpression>
   */
  MultiplicativeExpression() {
    return this._BinaryExpression(
      "PrimaryExpression",
      this._tokenizer.TokenType.MULTIPLICATIVE_OPERATOR
    )
  }

  /**
   * PrimaryExpression
   * : Literal
   */
  PrimaryExpression() {
    switch (this._lookahead.type) {
      case this._tokenizer.TokenType.PARENTHESIS_OPEN:
        return this.ParenthesizedExpression()
      default:
        return this.Literal()
    }
  }

  _BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]()
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken).value

      const right = this[builderName]()
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      }
    }

    return left
  }

  /**
   * ParenthesizedExpression
   * : '(' Expression ')'
   */
  ParenthesizedExpression() {
    this._eat(this._tokenizer.TokenType.PARENTHESIS_OPEN)
    const expression = this.Expression()
    this._eat(this._tokenizer.TokenType.PARENTHESIS_CLOSE)
    return expression
  }

  /**
   * Literal
   * : NumericalLiteral
   * | StringLiteral
   */
  Literal() {
    switch (this._lookahead.type) {
      case this._tokenizer.TokenType.NUMBER:
        return this.NumericalLiteral()
      case this._tokenizer.TokenType.STRING:
        return this.StringLiteral()
      default:
        throw new Error(`Unexpected token: ${this._lookahead.type}`)
    }
  }

  StringLiteral() {
    const token = this._eat("String")
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    }
  }

  /**
   * NumericalLiteral
   * : Number
   */
  NumericalLiteral() {
    const token = this._eat("Number")
    return {
      type: "NumericalLiteral",
      value: Number(token.value),
    }
  }

  _eat(type) {
    const token = this._lookahead
    if (token == null) {
      throw new Error(`Unexpected end of input, expected: ${type}`)
    }

    if (token.type !== type) {
      throw new Error(`Unexpected token: ${token.type}, expected: ${type}`)
    }

    this._lookahead = this._tokenizer.getNextToken()
    return token
  }
}

module.exports = {
  Parser,
}
