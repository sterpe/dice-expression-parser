'use strict'
const Scanner = require('dice-expression-scanner')
const CONSTANT = require('./lib/constant')

module.exports = function DiceExpressionParser (exp) {
  return {
    parse: function () {
      const scanner = new Scanner(exp)

      const operators = []
      const operands = []

      let lastToken = null
      let token = scanner.nextToken()

      while (token !== null) {
        if (lastToken && lastToken.type ===
            token.type) {
          throw new Error()
        }
        if (token.type === CONSTANT.OPERATOR) {
          operators.push(token)
        } else {
          operands.unshift(token)
        }

        lastToken = token
        token = scanner.nextToken()
      }

      const tokens = []
      let operator = operators.pop()

      // Doing this puts the tokens in inverse polish notation ??
      // making the construction of a properly left-associative tree
      // trivial...this probably works because we only support
      // two operations: +/-

      while (operator) {
        tokens.push(operator)
        operator = operators.pop()
      }
      while (operands.length) {
        tokens.push(operands.pop())
      }

      const root = tokens.shift() || null
      let currentNode = root

      while (currentNode && tokens.length) {
        currentNode.right = tokens.pop() || null
        currentNode.left = tokens.shift() || null

        currentNode = currentNode.left
      }

      if (tokens.length) {
        throw new Error()
      }

      return root
    }
  }
}
