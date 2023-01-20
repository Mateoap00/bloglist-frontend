import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [likes, setLikes] = useState(0);

    const handleNewBlog = async (event) => {
        event.preventDefault();
        await createBlog({ title, author, url, likes });
        setTitle('');
        setAuthor('');
        setUrl('');
        setLikes(0);
    }

    return (
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
}

export default NewBlogForm;