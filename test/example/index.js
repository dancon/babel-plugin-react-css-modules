import './index.less'

const test = 'test'
const color = 'color'
const jsx = (<div name='jioho' className={{
  'test-page': true,
  'color': test === 'test'
}} hello='world' styleName={{
  'page-x': true
}} />)

const jsx1 = (<div className={`aaaa${xxxx} a-b bbbb`} styleName={`page test color`}></div>)
