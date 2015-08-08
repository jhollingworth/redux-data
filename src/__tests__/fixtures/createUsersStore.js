import Immutable from 'immutable'
import {createStore, combineReducers} from 'redux'

const RECEIVE_USER = 'RECEIVE_USER'

export default () => {
  const app = combineReducers({ users })
  const store = createStore(app)

  return { store, addUser }

  function addUser (user) {
    store.dispatch({
      type: RECEIVE_USER,
      payload: Immutable.fromJS(user)
    })
  }

  function users (state = Immutable.Map(), {type, payload}) {
    switch (type) {
      case RECEIVE_USER:
        return state.set(payload.get('id'), payload)
      default:
        return state
    }
  }
}
