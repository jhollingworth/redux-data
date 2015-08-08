import invariant from 'invariant'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

export default function dataful (Component, options) {
  if (!options) {
    options = Component
  }

  options = options || {}

  invariant(!options.data || isObject(options.data), '${Component.name}(data) must be an objet')

  each(options.data, (creator, key) => {
    invariant(isFunction(creator), `${Component.name}(data: ${key}) must be a function`)
  })

  const Container = connect(mapState, mapDispatch)(Component)

  Container.innerComponentRef = 'underlyingRef'

  return Container

  function mapState (state, props) {
    if (props.data) {
      return props.data
    }

    if (props.state) {
      state = props.state
    }

    const data = {}

    each(options.data, (creator, key) => data[key] = creator(state, props))

    return { data }
  }

  function mapDispatch (dispatch, props) {
    let {actions} = props

    if (!actions) {
      actions = bindActionCreators(options.actions || {}, dispatch)
    }

    return { actions }
  }

  function isFunction (obj) {
    return toString.call(obj) === '[object Function]'
  }

  function isObject (obj) {
    return toString.call(obj) === '[object Object]'
  }

  function each (obj, cb) {
    if (!obj) {
      return
    }

    for (var key in obj) {
      cb(obj[key], key)
    }
  }
}
