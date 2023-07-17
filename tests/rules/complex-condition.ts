import { RuleTester } from 'eslint'
import rule from '../../src/rules/complex-condition'

const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
})

tester.run('complex-condition', rule, {
  valid: ['if (a) {}'],
  invalid: [
    {
      code: 'if (a && b && c) {}', //
      errors: [{ messageId: 'complexCondition' }],
    },
  ],
})
