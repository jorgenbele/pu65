// FIXME: LICENSE???
// From expo

import React from 'react'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constants/Colors'

export default function Iconicon (props) {
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  )
}
