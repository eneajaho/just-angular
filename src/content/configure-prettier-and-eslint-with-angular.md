---
title: Configure Prettier and ESLint with Angular 🎨
slug: configure-prettier-and-eslint-with-angular
description: Everyone wants to write code in a fast bug-free way without thinking about its style most of the time. That’s why in this post I will talk about configuring ESLint and Prettier in an Angular project…
coverImage: '/eslint-prettier-angular.webp'
coverImageAlt: 'Configure Prettier and ESLint with Angular'
tags: ['Angular', 'Eslint', 'Prettier', 'HTML', 'JavaScript']
publishedAt: '2022-02-19T00:00:00.000Z'
---

# Configure Prettier and ESLint with Angular 🎨

Everyone wants to write code in a fast bug-free way without thinking about its style most of the time. That’s why in this post I will talk about configuring [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) in an [Angular](https://angular.io/) project.

## How does ESLint help?
By statically analyzing our code, ESLint can find problems and also suggest us fixes for them. And it can do better than that, it can fix our code automatically (who doesn’t want that?).

## Install and configure ESLint
In this section, I will explain how to install ESLint in an Angular project and also configure it to better align with the Angular style guide and community standards.

Open the terminal and install ESLint schematics using this command:

```bash
ng add @angular-eslint/schematics
```

_That was it._ Now we have ESLint installed and also configured thanks to `ng add` command provided by the [Angular-ESLint](https://github.com/angular-eslint/angular-eslint) team.

Example error and how ESLint helps to fix it:

![ESLint error about Angular input binding alias](eslint-error-fix.png)
<span class="img-alt">ESLint error about Angular input binding alias</span>

![ESLint quick fix for Angular Input aliasing](eslint-quick-fix-angular.webp)
<span class="img-alt">ESLint quick fix for Angular Input aliasing</span>

We can also run this command in terminal:

```bash
ng lint --fix
```

to fix all the fixable bugs in the project.

---

## Install and configure Prettier
Even if we have ESLint watching our code for bugs, we also need a tool to better style and format it. That’s where Prettier comes into play.

Prettier is an opinionated code formatter that helps us beautify code in a standardized way every time we save the code.

Open terminal and type:

```bash
npm install prettier --save-dev
```

or if you’re using yarn :

```bash
yarn add prettier -D
```

Then we need to add **.prettierrc.json** and **.prettierignore** files in our root project directory.

Inside .prettierignore it’s better to add whatever we have inside **.gitignore** file.

Then we can run this command inside our project to format it.

```bash
npx prettier --write .
```

Inside **.prettierrc.json** we can change the default settings by overriding them.

The settings I use most of the time are this:

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "es5",
  "bracketSameLine": true,
  "printWidth": 80
}
```

That’s it about Prettier. But we are not finished.

> There are times where ESLint and Prettier have different opinions about code formatting and style. That’s why we need to tweak this part. [More info here](https://prettier.io/docs/en/integrating-with-linters.html).

---

## Configure Prettier to be used as an ESLint plugin

For ESLint and Prettier to play well together, we need to run Prettier as an ESLint plugin. This way we can just call **ng lint — fix** and ESLint will fix bugs but also format the code.

Open terminal and type:

```bash
npm install prettier-eslint eslint-config-prettier eslint-plugin-prettier --save-dev
```

or

```bash
yarn add prettier-eslint eslint-config-prettier eslint-plugin-prettier -D
```

Now we need to edit the **.eslintrc.json** file to include the prettier plugin.

```json
{
  "root": true,
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        ...
        "plugin:prettier/recommended"
      ],
    },
    // NOTE: WE ARE NOT APPLYING PRETTIER IN THIS OVERRIDE, ONLY @ANGULAR-ESLINT/TEMPLATE
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {}
    },
    // NOTE: WE ARE NOT APPLYING @ANGULAR-ESLINT/TEMPLATE IN THIS OVERRIDE, ONLY PRETTIER
    {
      "files": ["*.html"],
      "excludedFiles": ["*inline-template-*.component.html"],
      "extends": ["plugin:prettier/recommended"],
      "rules": {
        // NOTE: WE ARE OVERRIDING THE DEFAULT CONFIG TO ALWAYS SET THE PARSER TO ANGULAR (SEE BELOW)
        "prettier/prettier": ["error", { "parser": "angular" }]
      }
    }
  ]
}
```

## Extra features

### Remove unused imports
We can automatically remove unused imports by using the [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports) plugin.

```bash
npm install eslint-plugin-unused-imports --save-dev
```

> NOTE: If version 4.x doesn't work, try version 3.x

Then we can add it to the `plugins` array in the ESLint configuration.

```json
{
  "root": true,
   // ... root level configuration
  "plugins": ["unused-imports"],
  "overrides": [
    {
      "files": ["*.ts"],
      // ..
      "rules": {
        "unused-imports/no-unused-imports": "error"
      }
    }
  ]
}
---

### Sort imports
We can sort imports by using the [eslint-plugin-simple-import-sort](https://www.npmjs.com/package/eslint-plugin-simple-import-sort) plugin.

```bash
npm install eslint-plugin-simple-import-sort --save-dev
```

Then we can add it to the `plugins` array in the ESLint configuration.

```json
{
  "root": true,
   // ... root level configuration
  "plugins": ["simple-import-sort"],
  "overrides": [
    {
      "files": ["*.ts"],
      // ..
      "rules": {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      }
    }
  ]
}
```

### Angular new control flow and @let syntax support
Prettier v3 supports the new control flow. Support for the `@let` syntax was added in v3.3.3.
If it still doesn't work, try upgrading to the latest version of `prettier` and `eslint-plugin-prettier` packages.

## Flat config configurations 
I won't go much into details here, but if you're using the flat configuration (`eslint.config.js`) than this is how you can configure prettier and eslint for Angular.

```eslint.config.js
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const unusedImports = require('eslint-plugin-unused-imports');

const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      // @ts-ignore
      'unused-imports': unusedImports,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
```

```.prettierrc
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "es5",
  "bracketSameLine": true,
  "printWidth": 80,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

These two should just work fine same as before with the other configuration. 

---

## VSCode and Webstorm shortcuts

That was it. We’re done with the configuration part.

After we edit a file, we want to format it and then save. That’s what we will configure now for both [VS Code](https://code.visualstudio.com/) and [Webstorm](https://www.jetbrains.com/webstorm/).

**First make sure you have [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) plugin installed. WebStorm has support out-of-the-box for both.**

For VS Code we need to add this lines to **settings.json**:

```json
{
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "editor.formatOnSave": false
  },
}
```

For Webstorm:
We need to check: **Run eslint — fix** on **Actions On Save** settings page:

![Webstorm Fix File on save](webstorm-run-on-save-eslint.webp)
<span class="img-alt">Webstorm Fix File on save</span>

> Here you can find the steps summed up: [Angular ESLint & Prettier Configuration](https://gist.github.com/eneajaho/17bbcf71c44eabf56d404b028572b97b)

## How to automate all these configurations?
As you saw, there are a lot of packages that you should install and configure. And I can tell you confidently that there is a way to manage all these automatically. **[Nx](https://nx.dev/) is the answer**.

### What is NX?
NX is the next generation build system with first-class monorepo support and powerful integrations.

If we migrate our Angular app to an Nx monorepo (there is a straightforward migration path) we get all those configurations for free out-of-the-box.

But what makes NX special are some crazy features like **computation caching, smart rebuilds, distributed task execution, remote build caching, powerful code generators, editor plugins** , etc.

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
