import './index.less'

const cond = 'obj'
const jsx = (<div className={{
  class1: cond === 'obj',
  class2: true
}}></div>)
