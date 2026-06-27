# Contributing to redux-vue

Thanks for taking the time to contribute!

## Setup

```bash
git clone https://github.com/nadimtuhin/redux-vue.git
cd redux-vue
npm install
npm test
```

## Development Workflow

1. Fork the repo and create a branch: `git checkout -b fix/my-fix`
2. Write a failing test first (TDD — see `src/connect.spec.js` for examples)
3. Implement the fix / feature
4. Ensure all tests pass: `npm test`
5. Submit a pull request against `master`

## Pull Request Guidelines

- One concern per PR
- Include tests for any behaviour change
- Update README if you add a new API argument
- Keep commits conventional: `fix:`, `feat:`, `docs:`, `test:`

## Reporting Bugs

Use the GitHub issue tracker. Include:
- redux-vue version
- Vue version
- Minimal reproduction (snippet or repo link)
- Expected vs actual behaviour
