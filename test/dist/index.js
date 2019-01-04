import classnames from "@pandolajs/classnames";
import classnames from "@pandolajs/classnames";
import _CSSM_ from './index.less';
const jsx = <div name='jioho' className={classnames(_CSSM_, {
  "foo-baz": true,
  "bar": true
})} hello='world' />;
const jsx1 = <div className={_CSSM_['page']}></div>;