import React from 'react'

export default class ShoppingItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = { lists: this.props.lists }
  }

  render () {
    return (
      <>
        makeListItem(this.state.title, this.state.addedBy)
      </>
    )
  }
}

ShoppingItem.defaultProps = {
  title: 'default name',
  cost: null,
  reserved: null,
  addedBy: 'admin',
  modifiedBy: ['admin']

}
