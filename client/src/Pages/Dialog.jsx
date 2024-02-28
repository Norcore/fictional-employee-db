import React from 'react'

export const Dialog = ({ message, onConfirm, onCancel}) => {
  return (
    <div>

        <h3> {message} </h3>
        <div>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
        </div>
    </div>
  )
}

export default Dialog;
