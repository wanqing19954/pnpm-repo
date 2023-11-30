#PNPM monorepo

### basic setup

```bash
mkdir pnpm-monorepo
cd pnpm-monorepo
pnpm init
git init
echo -e "node_modules" > .gitignore
npm pkg set engines.node=">=18.16.1" // Use the same node version you installed
npm pkg set type="module"
echo "#PNPM monorepo" > README.md
```

### code formatter

```bash
pnpm add -D prettier
echo '{\n  "singleQuote": true\n}' > .prettierrc.json
echo -e "coverage\npublic\ndist\npnpm-lock.yaml\npnpm-workspace.yaml" > .prettierignore
```

### vscode setting

```bash
mkdir .vscode && touch .vscode/settings.json
```

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Linting

```bash
pnpm create @eslint/config

touch .eslintignore
echo -e "coverage\npublic\ndist\npnpm-lock.yaml\npnpm-workspace.yaml" > .eslintignore
```

### Integrating Prettier with ESLint

```bash
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

```js
module.exports = {
  extends: [..., 'plugin:prettier/recommended'],
}
```

```bash
  npm pkg set scripts.lint="eslint ."
  npm pkg set scripts.format="prettier --write ."
```

### Husky

```bash
  pnpm add -D @commitlint/cli @commitlint/config-conventional
  echo -e "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
  pnpm add -D husky lint-staged
  npx husky install
  npx husky add .husky/pre-commit "pnpm lint-staged"
  npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
  npm pkg set scripts.prepare="husky install"
```

```json
 "lint-staged": {
    "**/*.{js,ts,tsx}": [
      "eslint --fix"
    ],
    "**/*": "prettier --write --ignore-unknown"
  },
```

### workspace config

```bash
touch pnpm-workspace.yaml
```

```yml
packages:
  - 'apps/*'
  - 'packages/*'
```

- Create the apps and packages directories in the root.

```bash
mkdir apps packages
```

### Sample app - Web app

- Create a sample app that can make use of the workspace package common

```bash
cd apps
pnpm create vite web-app --template react-ts
cd ../
pnpm install
npm pkg set scripts.app="pnpm --filter web-app"
```

- Install the common package as a dependency in our web app by updating the web-app package.json.

```json
"dependencies": {
 "common": "workspace:*",
 ...,
 }
```

- Run pnpm install again so that 'web-app' can symlink the common package present in the workspace

- Run pnpm common build so that the common package can be found by the web-app server.

- Update the App.tsx like below

```tsx
import { isBlank } from 'common';

const App = () => {
  return (
    <>
      <p>undefined isBlank - {isBlank(undefined) ? 'true' : 'false'}</p>
      <p>false isBlank - {isBlank(false) ? 'true' : 'false'}</p>
      <p>true isBlank - {isBlank(true) ? 'true' : 'false'}</p>
      <p>Empty object isBlank - {isBlank({}) ? 'true' : 'false'}</p>
    </>
  );
};

export default App;
```

- Run pnpm app dev and check whether the common package util is successfully linked to the app.

### Dev mode

- Most of the time, you just need to build the common package once and use it in the repo apps. But if you are actively making changes in your common package and want to see that in the 'web-app' immediately you can't build the common app again and again for every change.
  To avoid this, let's run the common package in watch mode so that any change in the code will rebuild automatically and reflect in the 'web-app' in real-time.

- Run these commands in different terminals.

### Advantages:

- All your code will be in one single repo with proper isolation.
- Only a one-time effort is needed to set up the repo with proper linting, formatting, and pre-commit hook validations - which will be extended by the workspace packages.
- All the packages will have a similar setup, look and feel.

Tips:

- Check out my blog on creating a TS Util library and React app for creating repo packages with all the bells and whistles. Ignore the prettier, pre-commit hook validations in those packages as they are already handled in the root workspace of this mono repo.

- For linter alone, if you are good with the basic linting present in the root workspace you don't have to do anything special in the package. However, for apps like React, we will have some more plugins dedicated to lint the React library.

**example**

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

You can keep it like this itself or else you can make it extend the root by simply removing the root property and remove the duplicates.

```js
module.exports = {
  extends: ['plugin:react-hooks/recommended'],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```
