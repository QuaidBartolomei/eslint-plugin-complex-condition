import { RuleTester } from 'eslint'
import rule from '../../src/rules/complex-condition'

const tester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

tester.run('complex-condition', rule, {
  valid: [
    'if (a) {}',
    'if (a && b) {}',
    // ternary
    'a ? b : c',
    'a && b ? c : d',
    // short-circuit
    'a && b',
    'a && b && c()',
    // assignment
    'const a = (b && c)',
    '{icon && iconPosition === "start" && <Icon {...iconProps} />}',
  ],
  invalid: [
    {
      code: 'if (a && b && c) {}', //
      errors: [{ messageId: 'complexCondition' }],
    },
    {
      code: 'a && b && c ? d : e', //
      errors: [{ messageId: 'complexCondition' }],
    },
    {
      code: 'a && b && c && functionCall()', //
      errors: [{ messageId: 'complexCondition' }],
    },
    {
      code: '{icon && iconPosition === "start" && a && <Icon {...iconProps} />}',
      errors: [{ messageId: 'complexCondition' }],
    },
    {
      code: 'const a = (b && c && d)',
      errors: [{ messageId: 'complexCondition' }],
    },
  ],
})
