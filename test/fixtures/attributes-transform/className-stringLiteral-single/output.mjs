import classnames from "@pandolajs/classnames";
import _CSSM_ from './index.less';
const color = 'blue';
const jsx = <div className={classnames(_CSSM_, {
  [`color-${color}`]: true
})}></div>;
