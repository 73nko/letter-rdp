const { Tokenizer } = require("./Tokenizer");

/**
 * Letter Parser: Recursive descent implementation of the parser.
 */

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  /**
   * Parers the given string string into a AST.
   * @param {string} string - The string string to parse.
   * @return {AST} - The AST.
   */
  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    // Prime the _tokenize to obtain the first token.
    // token which is our _lookahead. The lookahead is
    // used for predictive parsing.

    this._lookahead = this._tokenizer.getNextToken();

    // Parse recursively starting from the main
    // entry point of the program.
    return this.Program();
  }

  /**
   * Main entry point for the parser.
   *
   * Program
   *  : NumericalLiteral
   */
  Program() {
    return {
      type: "Program",
      body: this.NumericalLiteral(),
    };
  }

  /**
   * NumericalLiteral
   * : Number
   */
  NumericalLiteral() {
    const token = this._eat("Number");
    return {
      type: "NumericalLiteral",
      value: Number(token.value),
    };
  }

  _eat(type) {
    const token = this._lookahead;
    if (token == null) {
      throw new Error(`Unexpected end of input, expected: ${type}`);
    }

    if (token.type !== type) {
      throw new Error(`Unexpected token: ${token.type}, expected: ${type}`);
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

module.exports = {
  Parser,
};
