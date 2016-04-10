'use strict'
var Scanner = require('dice-expression-scanner')
var CONSTANT = require('dice-constants')

module.exports = function DiceExpressionParser (exp) {
  return {
    parse: function () {
      var scanner = new Scanner(exp)

      var operators = []
      var operands = []

      var lastToken = null
      var token = scanner.nextToken()

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
        lastToken.subType = lastToken.type
        lastToken.type = CONSTANT.DICE_EXPRESSION
        token = scanner.nextToken()
      }

      var tokens = []
      var operator = operators.pop()

      while (operator) {
        tokens.push(operator)
        operator = operators.pop()
      }
      while (operands.length) {
        tokens.push(operands.pop())
      }

      var root = tokens.shift() || null
      var currentNode = root

      while (currentNode && tokens.length) {
        currentNode.right = tokens.pop() || null
        currentNode.left = tokens.shift() || null

        currentNode = currentNode.left
      }

      if (tokens.length) {
        throw new Error('Parse error assembling the tree.')
      }

      return root
    }
  }
}
