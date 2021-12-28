/**
 * Tokenizer spec
 */

const Spec = [
  // Whitespace
  [/^\s+/, null],

  // Comments
  [/^\/\*[\s\S]*?\*\//, null],
  [/^\/\/.*/, null],

  // Symbols
  [/^;/, ";"],
  [/^{/, "{"],
  [/^}/, "}"],

  [/^\(/, "("],
  [/^\)/, ")"],

  // Numbers
  [/^\d+/, "Number"],

  // Strings
  [/^"([^"]*)"/, "String"],
  [/^'([^']*)'/, "String"],

  // Math operators
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],
]

/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */
class Tokenizer {
  TokenType = {
    WHITESPACE: "Whitespace",
    COMMENT: "Comment",
    NUMBER: "Number",
    STRING: "String",
    SEMICOLON: ";",
    CURLY_OPEN: "{",
    CURLY_CLOSE: "}",
    PARENTHESIS_OPEN: "(",
    PARENTHESIS_CLOSE: ")",
    ADDITIVE_OPERATOR: "ADDITIVE_OPERATOR",
    MULTIPLICATIVE_OPERATOR: "MULTIPLICATIVE_OPERATOR",
  }

  /**
   * Initializes the string.
   */
  init(string) {
    this._string = string
    this._cursor = 0
  }

  isEOF() {
    return this._cursor === this._string.length
  }

  /**
   * Whether we still have more tokens.
   */
  hasMoreTokens() {
    return this._cursor < this._string.length
  }

  /**
   * Obtains the next token.
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null
    }

    const string = this._string.slice(this._cursor)

    for (const [regex, type] of Spec) {
      const tokenValue = this._match(regex, string)
      if (!tokenValue) continue
      if (type == null) return this.getNextToken()

      return {
        type,
        value: tokenValue,
      }
    }
    throw new SyntaxError(`Unexpected token: ${string[0]}`)
  }

  _match(regexp, string) {
    let matched = regexp.exec(string)

    if (!matched) {
      return null
    }
    this._cursor += matched[0].length
    return matched[0]
  }
}

module.exports = {
  Tokenizer,
}
