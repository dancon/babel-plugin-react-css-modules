import { classnames } from "../dist/test.js";
import styles from './index.less';
const jsx = <div name='jioho' className={classnames(styles, {
  "foo-baz": true,
  "bar": true
})} hello='world' />;
const jsx1 = <div className={styles['page']}></div>;