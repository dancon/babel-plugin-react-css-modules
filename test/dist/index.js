import { classnames } from "@bbt/bbt-ui/utils";
import _CSSM_ from './index.less';
const test = 'test';
const color = 'color';
const jsx = <div name='jioho' className={classnames(_CSSM_, {
  'test-page': true,
  'color': test === 'test'
}, {
  'page-x': true
})} hello='world' />;
const jsx1 = <div className={classnames(_CSSM_, {
  "a-b": true,
  "bbbb": true,
  [`aaaa${xxxx}`]: true
}, `page test color`)}></div>;