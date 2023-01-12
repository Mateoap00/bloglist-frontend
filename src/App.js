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

*/
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [message, setMessage] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState(0);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('blogListUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage({
        text: `Wrong username or password.`,
        class: 'failure'
      });
      setTimeout(() => {
        setMessage({})
      }, 5000);
    }
  };

  const handleLogOut = async (event) => {
    window.localStorage.removeItem('blogListUser');
    blogService.setToken('');
    setUser(null);
  }

  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.createBlog({ title, author, url, likes });
      const updatedBlogs = blogs.concat(blog);
      setBlogs(updatedBlogs);
      setTitle('');
      setAuthor('');
      setUrl('');
      setLikes(0);
      setMessage({
        text: `A new blog added: ${blog.title} by ${blog.author}`,
        class: 'success'
      });
      setTimeout(() => {
        setMessage({})
      }, 5000);
    } catch (exception) {
      setMessage({
        text: `Error creating a new blog post.`,
        class: 'failure'
      });
      setTimeout(() => {
        setMessage({})
      }, 5000);
    }
  }

  const loginForm = () =>
  (<form onSubmit={handleLogin}>
    <h3>Login with your username and password</h3>
    <div>
      Username:
      <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      Password:
      <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>);

  const newBlogForm = () => (
    <form onSubmit={handleNewBlog}>
      <h3>Create a new blog post</h3>
      <div>
        Title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL:
        <input
          type="text"
          value={url}
          name="URL"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <div>
        Likes:
        <input
          type="number"
          value={likes}
          name="Likes"
          onChange={({ target }) => setLikes(target.value)}
        />
      </div>
      <button type="submit">Add Blog</button>
    </form>);

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

      {user === null
        ? loginForm()
        : <>
          <h3>{user.name} is logged in</h3>
          <button onClick={handleLogOut}>Log Out</button>
          {newBlogForm()}
          {blogsForm()}
        </>}
    </div>
  )
}

export default App
