#redux-dataful

A small improvement over redux `connect` that makes it easier to select state, bind actions and easily test it all.

```js
@dataful
class User extends React.Component {
  static data = {
    user: (state, props) => state.users[props.userId]
  }

  static actions = {
    updateUser
  }

  render () {
    const {
      data: {
        user
      }
    } = this.props

    return <div className='User'>{user.name}</div>
  }

  onClick () {
    this.props.actions.updateUser()
  }
}

const actions = {
  updateUser: sinon.spy()
}

const data = {
  user: {
    id: 123,
    name: 'Foo'
  }
}

<User actions={actions} data={data} />
```
