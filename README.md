# @pandolajs/babel-plugin-react-css-modules

CSS Modules for react application.

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

## How it works
