import React from 'react'
import sinon from 'sinon'
import {expect} from 'chai'
import dataful from '../dataful'
import Immutable from 'immutable'
import tree from 'react-test-tree'
import createUsersStore from './fixtures/createUsersStore'

describe('@dataful(options)', () => {
  let Container, component, store, addUser

  beforeEach(() => {
    let usersStore = createUsersStore()

    store = usersStore.store
    addUser = usersStore.addUser
  })

  describe('when there is no data hash', () => {
    beforeEach(() => {
      @dataful
      class Component extends React.Component {
        render () {
          return <div ref='foo'>FOO</div>
        }
      }

      component = tree(<Component />)
    })

    it('should just return the inner component', () => {
      expect(component.foo.innerText).to.eql('FOO')
    })
  })

  describe('when data is not an hash', () => {
    it('should throw an error', () => {
      expect(() => {
        @dataful
        class Component extends React.Component {
          static data = 1
          render () {
            return <div />
          }
        }

        tree(<Component />)
      }).to.throw(Error)
    })
  })

  describe('when the value of a data hash is not a function', () => {
    it('should throw an error', () => {
      expect(() => {
        @dataful
        class Component extends React.Component {
          static data = {
            user: 1
          }
          render () {
            return <div />
          }
        }

        tree(<Component />)
      }).to.throw(Error)
    })
  })

  describe('when options passed in', () => {
    beforeEach(() => {
      class Component extends React.Component {
        static propTypes = {
          data: React.PropTypes.object
        }

        render () {
          const {
            data: {
              foo
            }
          } = this.props

          return <div ref='foo'>{foo}</div>
        }
      }

      Container = dataful(Component, {
        data: {
          foo: () => 'FOO'
        }
      })

      component = tree(<Container />)
    })

    it('should just return the inner component', () => {
      expect(component.foo.innerText).to.eql('FOO')
    })
  })

  describe('when you pass in a data object through the props', () => {
    beforeEach(() => {
      @dataful
      class Component extends React.Component {
        static propTypes = {
          data: React.PropTypes.object
        }

        static data = {
          foo: () => 'FOO'
        }

        render () {
          const {
            data: {
              foo
            }
          } = this.props

          return <div ref='foo'>{foo}</div>
        }
      }

      const mockData = {
        foo: 'BAR'
      }

      component = tree(<Component data={mockData} />)
    })

    it('should use this object instead of invoking data', () => {
      expect(component.foo.innerText).to.eql('BAR')
    })
  })

  describe('when you pass in a state object through the props', () => {
    beforeEach(() => {
      @dataful
      class Component extends React.Component {
        static propTypes = {
          data: React.PropTypes.object
        }

        static data = {
          user (state, props) {
            return state.users.get(props.id)
          }
        }

        render () {
          const {
            data: {
              user
            }
          } = this.props

          return <div>{renderUser()}</div>

          function renderUser () {
            if (user) {
              return <div ref='user'>{user.get('name')}</div>
            }
          }
        }
      }

      const mockState = {
        users: Immutable.fromJS({
          123: {
            name: 'FOO'
          }
        })
      }

      component = tree(<Component id='123' state={mockState} />)
    })

    it('should pass that to each data function rather than getting the redux state', () => {
      expect(component.user.innerText).to.eql('FOO')
    })
  })

  describe('when you pass in actions', () => {
    let expectedAction, dispatch

    beforeEach(() => {
      dispatch = sinon.stub()
      expectedAction = { type: 'SAVE' }

      @dataful
      class Component extends React.Component {
        static propTypes = {
          actions: React.PropTypes.object
        }

        static actions = {
          save: () => expectedAction
        }

        save () {
          this.props.actions.save()
        }

        render () {
          return false
        }
      }

      component = tree(<Component />, {
        context: {
          store: {
            dispatch: dispatch,
            getState: sinon.stub(),
            subscribe: sinon.stub()
          }
        }
      })
      component.element.save()
    })

    it('should automatically bind them', () => {
      expect(dispatch).to.be.calledWith(expectedAction)
    })
  })

  describe('when you pass in actions via the props', () => {
    let dispatch, mockActions

    beforeEach(() => {
      dispatch = sinon.stub()

      @dataful
      class Component extends React.Component {
        static propTypes = {
          actions: React.PropTypes.object
        }

        static actions = {
          save: () => {}
        }

        save () {
          this.props.actions.save()
        }

        render () {
          return false
        }
      }

      mockActions = {
        save: sinon.stub()
      }

      component = tree(<Component actions={mockActions} />, {
        context: {
          store: {
            dispatch: dispatch,
            getState: sinon.stub(),
            subscribe: sinon.stub()
          }
        }
      })
      component.element.save()
    })

    it('should automatically bind them', () => {
      expect(mockActions.save).to.be.called
    })
  })

  describe('when the redux component state changes', () => {
    beforeEach(() => {
      @dataful
      class Component extends React.Component {
        static propTypes = {
          data: React.PropTypes.object
        }

        static data = {
          user (state, props) {
            return state.users.get(props.id)
          }
        }

        render () {
          const {
            data: {
              user
            }
          } = this.props

          return <div>{renderUser()}</div>

          function renderUser () {
            if (user) {
              return <div ref='user'>{user.get('name')}</div>
            }
          }
        }
      }

      component = tree(<Component id={123} />, {
        context: { store }
      })

      addUser({
        id: 123,
        name: 'FOO'
      })

      addUser({
        id: 123,
        name: 'BAR'
      })
    })

    it('should re-render the child component', () => {
      expect(component.user.innerText).to.eql('BAR')
    })
  })
})
