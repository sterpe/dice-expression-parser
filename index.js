"use strict";

const Tree = require('tree');

module.exports = function DiceExpressionParser(expression) {
	return {
		parse: function () {
			const scanner = new (require('dice-expression-scanner'))(expression);
			const parseTree = [];
			const operators = [];
			const operands = [];

			let token = null;
			let lastToken = null;
			let operator;

			while ((token = scanner.nextToken()) !== null) {
				if (lastToken && lastToken.type === token.type) {
					throw new Error();
				}
				if (token.type === "operator") {
					operators.push(token);
				} else { 
					operands.unshift(token);
				}
				lastToken = token;
			}
			while (operator = operators.pop()) {
				parseTree.push(operator);
			}
			while (operands.length) {
				parseTree.push(operands.pop());
			}

			let tree = Tree(parseTree.shift() || null);
			let currentNode = tree.root;

			while (currentNode && parseTree.length) {
				currentNode.addLeftChild(parseTree.pop() || null);
				currentNode.addRightChild(parseTree.shift() || null);

				currentNode = currentNode.right;
			}
			if (parseTree.length) {
				throw Error();
			}

			return tree;
		}
	};
};
