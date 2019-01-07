import classnames from "@pandolajs/classnames";
import _CSSM_ from './index.less';
const cond = 'obj';
const jsx = <div className={classnames(_CSSM_, {
  class1: cond === 'obj',
  class2: true
})}></div>;
