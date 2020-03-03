import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'

import { addItemToCollection } from '../api'
import { STATE_ADDED } from '../constants/ItemStates'

function CollectionAddItemForm ({ me, navigation, route, addItemToCollection, ...props }) {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)

  const isValidItemName = () => itemName !== ''
  const isValidQuantity = () => Number.isInteger(quantity) && quantity > 0

  // Collection is passed to the form from the navigator param
  const { collection } = route.params

  return (
    <View>
      <Headline>
        Add item to {collection.name}
      </Headline>

      <TextInput
        label='Item name'
        value={itemName}
        onChangeText={text => setItemName(text)}
      />
      <HelperText
        type='error'
        visible={!isValidItemName()}
      >
          You must set a valid item name!
      </HelperText>

      <TextInput
        label='Quantity'
        value={quantity.toString()}
        onChangeText={text => setQuantity(parseInt(quantity))}
      />
      <HelperText
        type='error'
        visible={!isValidQuantity()}
      >
        Enter a strictly positive quantity
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          console.log('ADDING ITEM ITEM')
          console.log(collection)
          console.log(itemName)
          if (!isValidItemName()) return
          addItemToCollection(collection.id, { name: itemName, quantity, state: STATE_ADDED })
          navigation.pop()
        }}
      >
        Add item to collection
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({
  me: state.members.membersByUsername[state.auth.username],
  collections: state.collections.collections
})
const mapDispatchToProps = { addItemToCollection }

export default connect(mapStateToProps, mapDispatchToProps)(CollectionAddItemForm)
