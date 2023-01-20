import { useState } from 'react';

const Blog = ({ blog, user, handleLike, handleDelete }) => {
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

  const givesLike = () => {
    const blogUpdated = { ...blog, likes: blog.likes + 1 }
    handleLike(blog.id, blogUpdated);
  }

  const deletesPost = () => {
    if (window.confirm(`Are you sure you want to remove the blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog.id);
    }
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
            {blog.likes} <button onClick={givesLike}>Like</button>
          </div>
          <div>
            <strong> {blog.author}</strong >
          </div>
          {blog.user.username === user
            ?
            <div>
              <button onClick={deletesPost}>Delete</button>
            </div>
            :
            <></>
          }
        </div >
      }
    </>

  )
}

export default Blog