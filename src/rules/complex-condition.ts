import { Rule } from 'eslint'
import { type IfStatement } from 'estree'

type Node = Rule.NodeParentExtension & {
  type: IfStatement['type']
  left?: Node
  right?: Node
}

const singleExpressionTypes = [
  'Identifier',
  'Literal',
  'MemberExpression',
  'BinaryExpression',
]

function countBinary(node?: Node): number {
  if (!node) return 0
  if (singleExpressionTypes.includes(node.type)) return 1
  return countBinary(node.left) + countBinary(node.right)
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
    return {
      IfStatement: (node) => {
        const count = countBinary(node.test as unknown as Node)
        if (count > 2) {
          context.report({
            node,
            messageId: 'complexCondition',
          })
        }
      },
    }
  },
}

export default rule
