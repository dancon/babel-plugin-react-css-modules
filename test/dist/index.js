import { classnames } from "@bbt/bbt-ui/utils";
import _CSSM_ from './index.less';
const jsx = <div name='jioho' className={classnames(_CSSM_, {
  "foo-baz": true,
  "bar": true
})} hello='world' />;
const jsx1 = <div className={_CSSM_['page']}></div>;