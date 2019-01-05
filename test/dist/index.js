import { classnames } from "@bbt/bbt-ui/utils";
import _CSSM_ from './index.less';
const test = 'test';
const jsx = <div name='jioho' className={classnames(_CSSM_, {
  "test-page": true,
  "blue": true
})} hello='world' />;
const jsx1 = <div className={`page node ${test}_name xxxx ${test} yyyy`}></div>;