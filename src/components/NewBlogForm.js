import { useState } from 'react';

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
    };

    return (
        <form onSubmit={handleNewBlog}>
            <h3>Create a new blog post</h3>

            <div>
                Title:
                <input
                    type="text"
                    id='newBlogTitle'
                    value={title}
                    name="Title"
                    placeholder='Write the title...'
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                Author:
                <input
                    type="text"
                    id='newBlogAuthor'
                    value={author}
                    name="Author"
                    placeholder='Write the author...'
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                URL:
                <input
                    type="text"
                    id='newBlogURL'
                    value={url}
                    name="URL"
                    placeholder='Write the URL...'
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <div>
                Likes:
                <input
                    type="number"
                    id='newBlogLikes'
                    value={likes}
                    name="Likes"
                    placeholder='Select a number of likes...'
                    onChange={({ target }) => setLikes(target.value)}
                />
            </div>
            <button
                type="submit"
                id='addBlogBtn'
            >
                Add Blog
            </button>
        </form>);
};

export default NewBlogForm;