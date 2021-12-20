/**
 * Tokenizer spec
 */

const Spec = [
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\d+/, "Number"],
  [/^"([^"]*)"/, "String"],
  [/^'([^']*)'/, "String"],
]

/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */
class Tokenizer {
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
