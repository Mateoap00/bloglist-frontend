import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  });

  return (
    <div>
      {
        visible === true
          ?
          <div>
            {props.children}
            <button onClick={toggleVisibility}>Cancel</button>
          </div>
          : <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      }
    </div>
  )
});

export default Togglable;