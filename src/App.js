/*
  Exercise 5.1: In the first exercise for this part I cloned the starting point of the frontend for the blog-list app --
  and implemented the login service to send the login request to the backend so a user can login (if the credentials are 
  correct) if successful then the app saves the user with it's token to the state of the react app.

  Exercise 5.2: Here I implemented a way to save the credentials after log in so if the app is restarted then it already
  has the user info saved so it won't ask to login again, for this I'm using the local storage of the browser. Also I --
  implemented a log out button so the user can log out, when this happens the local storage where the credentials are --
  saved gets deleted, also the state of the react app with this info gets restarted.

  Exercise 5.3: For this I added the capability for a user to create a new blog post, so if a user is logged in then it-
  will show a new form to create a blog, this has input for the title, author, URL, and likes of the blog post. When ---
  adding a blog, the blog service sends the request with the react state to the backend and it specifies the token as a-
  authentication header. If the request is successful then the added blog post is saved to the Mongo DB and the request-
  responds with the new blog, so then the react state of the blogs gets updated and rerenders the blog list.

  Exercise 5.4: Here I added a way to show success or failure messages so if an error happens (wrong credentials when --
  login) then the user gets notified. Also if a blog post is created successfully then it notifies. For this I'm using -
  a message component that was developed in the phone-book app.

  Exercise 5.5: In this exercise I implemented the Togglable component that renders any child components and also a pair
  of show-cancel buttons so the child components are visible or not, this is used in the login form and also the form --
  when creating a new blog.

  Exercise 5.6: Here I moved the form for creating a new blog to it's own component, I also moved the state that was ---
  only depending on that form, this was the title, author, url and likes of the blog.

  Exercise 5.7: For this exercise I refactored the Blog component so it has a visibility state that changes the way that
  a blog is shown, if view button is clicked then it shows more info about the blog, if then the hide button is clicked-
  then it goes back to show only the blog title.

*/
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [message, setMessage] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef(null);

  useEffect(() => {
    try {
      async function getAllBlogs() {
        const blogs = await blogService.getAll();
        console.log(blogs);
        setBlogs(blogs);
      }
      getAllBlogs();
    } catch (exception) {
      setMessage({
        text: `Error getting the saved blogs.`,
        class: 'failure'
      });
      setTimeout(() => {
        setMessage({})
      }, 5000);
    }

  }, []);

  useEffect(() => {
    const localUser = window.localStorage.getItem('blogListUser');
    if (localUser) {
      const loggedUser = JSON.parse(localUser);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const loginHandler = async (username, password) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem('blogListUser', JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
  };

  const handleLogOut = async (event) => {
    window.localStorage.removeItem('blogListUser');
    blogService.setToken('');
    setUser(null);
  }

  const createBlogHandler = async (blogObject) => {
    const blog = await blogService.createBlog(blogObject);
    const updatedBlogs = blogs.concat(blog);
    blogFormRef.current.toggleVisibility()
    setBlogs(updatedBlogs);
  }

  const blogsForm = () => (
    <div>
      <h3>BlogsList</h3>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>

  );

  return (
    <div>
      <h2>BlogsList App</h2>

      <Message message={message} />

      {
        user === null
          ?
          <Togglable buttonLabel="Log In">
            <LoginForm newLogin={loginHandler} />
          </Togglable>
          : <>
            <h3>{user.name} is logged in</h3>
            <button onClick={handleLogOut}>Log Out</button>
            <Togglable buttonLabel="New Blog" ref={blogFormRef}>
              <NewBlogForm
                createBlog={createBlogHandler}
              />
            </Togglable>
          </>
      }
      {blogsForm()}
    </div>
  )
}

export default App
