import classnames from "@pandolajs/classnames";
import styles from './index.less';
const ele = <div className={styles.name}></div>;
const ele2 = <div className={styles["name"]}></div>;
const ele3 = <div className={classnames(styles, {
  "btn": true,
  [`btn-${color}`]: true
})}></div>;