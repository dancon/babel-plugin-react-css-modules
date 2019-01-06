import './index.less'

const test = 'test'
const jsx = (<div name='jioho' className={{
  'test-page': true,
  'color': test === 'test'
}} hello='world' />)

const jsx1 = (<div className={`page node`}></div>)
