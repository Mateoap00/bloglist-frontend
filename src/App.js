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

  Exercise 5.7*: For this exercise I refactored the Blog component so it has a visibility state that changes the way that
  a blog is shown, if view button is clicked then it shows more info about the blog, if then the hide button is clicked-
  then it goes back to show only the blog title.

  Exercise 5.8: In this exercise I implemented the like a blog functionality so when a user logs in, can like a blog of-
  the blog list. For this I refactored the put request handler in the backend and added a like a blog handler in the ---
  frontend so when the like button is clicked then it sends the blog object only with a +1 in the likes number as a ----
  parameter in the axios request.

  Exercise 5.9: For this exercise I changed the order in which the blog list is displayed so it shows first the blogs --
  with the most likes, in descending order. To do this I'm using the sort method that compares the current blog's likes-
  with the next blog's likes. The new array of blogs in order is assigned to the blogsToShow variable and this gets map-
  to show in the frontend.

  Exercise 5.10: Here I implemented a delete button so a logged user is able to delete any blog post made by that user.-
  If the user didn't add that blog then the button won't show up at all. I refactored the delete handler in the backend-
  controller of the blogs and I'm conditional rendering the delete button in the Blog component of the frontend. I'm ---
  using the window.confirm element so the user gets ask to confirm the deletion of the blog post.

  Exercise 5.11: I added prop types to the toggable and login components so the props needed for them to work are requir-
  ed and If not given accordingly then the react app won't render them and will throw an error in the console.

  Exercise 5.12: In this exercise I configured eslint so it works in the react app frontend of the blog-list app. After
  setting eslint and refactoring the code there's 0 warnings up until now.

*/
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Message from './components/Message';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
    const [message, setMessage] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const blogFormRef = useRef(null);

    useEffect(() => {
        const getAllBlogs = async () => {
            try {
                const blogs = await blogService.getAll();
                console.log(blogs);
                setBlogs(blogs);
            } catch (exception) {
                setMessage({
                    text: 'Error connecting to the DB to get the saved blogs.',
                    class: 'failure'
                });
                setTimeout(() => {
                    setMessage({});
                }, 5000);
            }
        };
        getAllBlogs();
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
        try {
            const user = await loginService.login({ username, password });
            window.localStorage.setItem('blogListUser', JSON.stringify(user));
            blogService.setToken(user.token);
            setUser(user);
        } catch (exception) {
            setMessage({
                text: 'Wrong username or password.',
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        }

    };

    const logOutHandler = async () => {
        try {
            window.localStorage.removeItem('blogListUser');
            blogService.setToken('');
            setUser(null);
        } catch (exception) {
            setMessage({
                text: 'Error trying to log out.',
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        }

    };

    const createBlogHandler = async (blogObject) => {
        try {
            const blog = await blogService.createBlog(blogObject);
            blogFormRef.current.toggleVisibility();
            const updatedBlogs = blogs.concat(blog);
            setBlogs(updatedBlogs);
            setMessage({
                text: `A new blog added: ${blog.title} by ${blog.author}`,
                class: 'success'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        } catch (exception) {
            setMessage({
                text: 'Error creating a new blog post.',
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        }
    };

    const likesBlogHandler = async (id, blogObject) => {
        try {
            const blog = await blogService.likesBlog(id, blogObject);
            const updatedBlogs = blogs.map((b) => {
                if (b.id === id) {
                    return blog;
                } else {
                    return b;
                }
            });
            setBlogs(updatedBlogs);
        } catch (exception) {
            setMessage({
                text: 'Error: A user must be logged in to be able to like a blog.',
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        }
    };

    const deleteBlogHandler = async (id) => {
        try {
            await blogService.deleteBlog(id);
            const updatedBlogs = blogs.filter((b) => b.id !== id);
            setBlogs(updatedBlogs);
            setMessage({
                text: 'Blog deleted successfully!',
                class: 'success'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        } catch (exception) {
            setMessage({
                text: 'Error deleting the blog from the blog list.',
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({});
            }, 5000);
        }
    };

    const blogsForm = () => {
        let blogsToShow = blogs.concat();
        let username = null;
        // If next.likes - curr.likes > 0 then curr goes after next
        // If next.likes - curr.likes < 0 then curr goes before next
        // If next.likes - curr.likes = 0 then curr and next stay in the same place
        blogsToShow.sort((curr, next) => {
            return next.likes - curr.likes;
        });
        if (user !== null) {
            username = user.username;
        }

        return (
            <div>
                <h3>BlogsList</h3>
                {blogsToShow.map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        user={username}
                        handleLike={likesBlogHandler}
                        handleDelete={deleteBlogHandler}
                    />
                )}
            </div>
        );

    };

    return (
        <div>
            <h2>BlogsList App</h2>

            <Message message={message} />

            {
                user === null
                    ?
                    <div>
                        <Togglable buttonLabel="Log In">
                            <LoginForm newLogin={loginHandler} />
                        </Togglable>
                    </div>
                    :
                    <div>
                        <h3>{user.name} is logged in</h3>
                        <button id='logOutBtn' onClick={logOutHandler}>Log Out</button>
                        <Togglable
                            buttonLabel="New Blog"
                            ref={blogFormRef}>
                            <NewBlogForm
                                createBlog={createBlogHandler}
                            />
                        </Togglable>
                    </div>}
            {blogs.length > 0
                ?
                blogsForm()
                :
                <></>
            }
        </div>
    );
};

export default App;
