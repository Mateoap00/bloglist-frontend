import { useState } from 'react';

const Blog = ({ blog, user, handleLike, handleDelete }) => {
    const [visible, setVisible] = useState(false);
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const givesLike = () => {
        const blogUpdated = { ...blog, likes: blog.likes + 1 };
        handleLike(blog.id, blogUpdated);
    };

    const deletesPost = () => {
        if (window.confirm(`Are you sure you want to remove the blog "${blog.title}" by ${blog.author}?`)) {
            handleDelete(blog.id);
        }
    };

    return (
        <>
            {visible === false
                ?
                < div style={blogStyle}>
                    <span className='blogTitle'>&quot;{blog.title}&quot;</span>
                    <span> by </span>
                    <span className='blogAuthor'>{blog.author}</span>
                    <button onClick={toggleVisibility}>View</button>
                </div >
                :
                < div style={blogStyle}>
                    <div>
                        <span className='blogTitle'>&quot;{blog.title}&quot; </span>
                        <button onClick={toggleVisibility}>Hide</button>
                    </div>
                    <div>
                        <span className='blogUrl'>{blog.url}</span>
                    </div>
                    <div>
                        <span className='blogLikes'>{blog.likes}</span>
                        <button onClick={givesLike}>Like</button>
                    </div>
                    <div>
                        <span className='blogAuthor'><strong>{blog.author}</strong ></span>
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

    );
};

export default Blog;