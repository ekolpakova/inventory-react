import React from 'react'
import PropTypes from 'prop-types'
import Item from "./Item"

const Items = ({ items }) => {
  return (
    <>
        {items.map((item, i) => (
            <Item />
        ))}
    </>
  )
}

Items.propTypes = {}

export default Items