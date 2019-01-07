import classnames from "@pandolajs/classnames";
import styles from './index.less';
const jsx = <div className={classnames(styles, {
  [styles['class1']]: true,
  [styles['class2']]: true
})}></div>;
