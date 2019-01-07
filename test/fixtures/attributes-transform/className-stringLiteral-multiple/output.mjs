import classnames from "@pandolajs/classnames";
import _CSSM_ from './index.less';
const color = 'blue';
const fontSize = 'small';
const jsx = <div className={classnames(_CSSM_, {
  "class1": true,
  "class2": true,
  [`color-${color}`]: true,
  [`${fontSize}-font`]: true,
  [`${color}-and-${fontSize}`]: true
})}></div>;
