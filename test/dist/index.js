import { classnames } from "@bbt/bbt-ui/utils";
import _CSSM_ from './index.less';
const test = 'test';
const jsx = <div name='jioho' className={classnames(_CSSM_, {
  'test-page': true,
  'color': test === 'test'
})} hello='world' />;
const jsx1 = <div className={classnames(_CSSM_, {
  "page": true,
  "node": true
})}></div>;