import { useState } from 'react';

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  return (
    <>
      {visible === false
        ?
        < div style={blogStyle}>
          "{blog.title}" <button onClick={toggleVisibility}>View</button>
        </div >
        :
        < div style={blogStyle}>
          <div>
            "{blog.title}" <button onClick={toggleVisibility}>Hide</button>
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            {blog.likes} <button>Like</button>
          </div>
          <div>
            <strong> {blog.author}</strong >
          </div>
        </div >
      }
    </>

  )
}

export default Blog