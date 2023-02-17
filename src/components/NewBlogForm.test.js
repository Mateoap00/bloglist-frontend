import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
    /*
        Exercise 5.16: Wrote a test to check that the handler function passed as props when creating a new blog (using
        the NewBlogForm component) is called correctly and gets the right information about the blog. For this I'm
        using a mock function that acts as the handler.
    */
    test('<NewBlogForm /> calls the create new blog handler with the right parameters', async () => {

        const user = userEvent.setup();
        const createBlog = jest.fn();

        render(
            <NewBlogForm
                createBlog={createBlog}
            />
        );

        const titleInput = screen.getByPlaceholderText('Write the title...');
        const authorInput = screen.getByPlaceholderText('Write the author...');
        const urlInput = screen.getByPlaceholderText('Write the URL...');
        const likesInput = screen.getByPlaceholderText('Select a number of likes...');
        const addButton = screen.getByText('Add Blog');

        await user.type(titleInput, 'New test blog');
        await user.type(authorInput, 'Peter Parker');
        await user.type(urlInput, 'www.spider-man.com');
        await user.type(likesInput, '5');
        await user.click(addButton);

        expect(createBlog.mock.calls).toHaveLength(1);
        expect(createBlog.mock.calls[0][0].title).toBe('New test blog');
        expect(createBlog.mock.calls[0][0].author).toBe('Peter Parker');
        expect(createBlog.mock.calls[0][0].url).toBe('www.spider-man.com');
        expect(createBlog.mock.calls[0][0].likes).toBe('5');
    });
});