import { Rule } from 'eslint'
import { type IfStatement, type Node as EsTreeNode } from 'estree'

const singleExpressionTypes = [
  'Identifier',
  'Literal',
  'MemberExpression',
  'BinaryExpression',
]

type Node = Rule.NodeParentExtension & {
  type: IfStatement['type'] | 'CallExpression'
  left?: Node
  right?: Node
}

const MAX_BINARY_COUNT = 2

function countBinary(node?: Node): number {
  if (!node) return 0
  if (singleExpressionTypes.includes(node.type)) return 1
  return countBinary(node.left) + countBinary(node.right)
}

function endsWithFunctionCall(node: Node): boolean {
  if (node.type === 'CallExpression') return true
  if (node.right) return endsWithFunctionCall(node.right)
  return false
}

function isBinaryCountValid(node: Node): boolean {
  const count = countBinary(node)
  return count <= MAX_BINARY_COUNT
}

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      // TODO: write the rule summary.
      description: '',
      recommended: true,
    },
    messages: {
      complexCondition: "'example' identifier is forbidden.",
    },
    type: 'suggestion',
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    // const sourceCode = context.getSourceCode()
    // console.log(sourceCode)
    const reportedNodes: EsTreeNode[] = []

    function isReported(node: EsTreeNode): boolean {
      return (
        // @ts-expect-error some nodes don't have parent
        reportedNodes.includes(node) || (node.parent && isReported(node.parent))
      )
    }

    function reportNode(node: EsTreeNode) {
      if (isReported(node)) return
      reportedNodes.push(node)
      context.report({
        node,
        messageId: 'complexCondition',
      })
    }

    return {
      IfStatement: (node) => {
        const isValid = isBinaryCountValid(node as unknown as Node)
        if (!isValid) reportNode(node)
      },
      // ternary
      ConditionalExpression: (node) => {
        const isValid = isBinaryCountValid(node as unknown as Node)
        if (!isValid) reportNode(node)
      },

      // short-circuit
      LogicalExpression: (node) => {
        const endsWithCall = endsWithFunctionCall(node as unknown as Node)
        const isValid =
          isBinaryCountValid(node as unknown as Node) || endsWithCall
        if (!isValid) reportNode(node)
      },
    }
  },
}

export default rule
