# @pandolajs/babel-plugin-react-css-modules

CSS Modules for react application. Find more details [here](https://github.com/dancon/babel-plugin-react-css-modules#readme)

## Motivaion

The purpose of the plugin is to improve the experience of development with CSS Modules in React Application.

It's superfluous when use CSS Modules to add class name to an element, we have to write code like this `className={styles.foo}` and we can't use Emmet to finish our code smoothly.

There are some solutions like HOC `react-css-modules` or babel plugin `babel-plugin-react-css-modules`, they are excellent and solve the most problems that bother you when developing. You can choose them when @pandolajs/babel-plugin-react-css-modules is not meet your situation.

## What difference

We add local CSS class to element via `className` prop as usual, and add global CSS class via `styleName` prop only.

## Features

- You can import a style file (css, less, sass, scss) anonymously or named. Like below:

```js
  // import anonymously
  import './index.less'

  // import named
  import styles from './index.less'
```

- You can add local class name via prop `className` with a string or an object with conditions. Like below:

```jsx
  // string
  <div className="foo bar" />

  // object
  <div className={{
    foot: this.isFoot,
    disabled: !this.useable
  }}>
```

- You can add global class name vis prop `styleName` with a string or an object with conditions. Like below:

```jsx
  // string
  <div styleName="foo bar" />

  // object
  <div styleName={{
    foot: this.isFoot,
    disabled: !this.useable
  }}>
```

- You use `className` and `styleName` props at the same time in any format mentioned above in one element. Like below:

```jsx
  <div classNam="local-foo" styleName="global-bar" />
```

## Usage

### Configurataion

- Step1: Install the plugin.

```bash
  npm i -D @pandolajs/babel-plugin-react-css-modules
```

- Step2: Install the `@pandolajs/classnames` as a dependency of you project.

```bash
  npm i -S @pandolajs/classnames
```

> `@pandolajs/classnames` is a small javascript library without any dependencies, it is used as a runtime dependency when plugin tranform your code. You can provide your own implamentation of course like `@pandolajs/classnames` [API](https://github.com/dancon/classnames).

- Step3: config plugin in your `babel.config.js` or `.babelrc`.

babel.config.js

```js
  {
    plugins: [
      ['@pandolajs/react-css-modules', options]
    ]
  }
```

### options?: {classname?: {}, handleTemplate?: boolean}

You can specify a option to custom plugin behavior.

- classnames?: {name: string, source: string, default: boolean}

  - classnames.name: string specify the name of classnames method

  - classnames.source: string specify the module of classnames, default '@pandolajs/classname', you can also specify a relative or absolute path base your project

  - classnames.default: boolean speify import as default or destruct from module, default value is true

- handleTemplate?: boolean indicate the plugin wether to handle `className={`btn-${color}`}` case. Default is false.

> You should be careful to set this option to `true` when in an old project, becasue there maybe some code like `className={`{styles.btn} ${styles.btnSuccess}`}`, It will cause unexpected layout of your app. You can find the deep reason of [here](./test/fixtures/className-stringLiteral-multiple/outpu.mjs).

configuration

```js
  {
    plugins: [
      ['@pandolajs/react-css-modules', {
        classnames: {
          name: 'cls',
          source: '@scope/your-classname',
          default: false
        }
      }]
    ]
  }
```

input.js

```js
  <div className="class1 class2" />
```

output.js

```js
  import { cls } from "@scope/your-classname";
  <div className={cls(_CSSM_, {
    "class1": true,
    "class2": true
  })} />
```

## How it works

You can find more transform example in [test](./test/fixtures/) directory.
