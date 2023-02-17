import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
    let container;
    let handleLike;
    let handleDelete;
    beforeEach(() => {
        const testBlog = {
            title: 'Test 01',
            author: 'Mateo',
            url: 'www.test.com',
            likes: 10,
            user: {
                username: 'mateoap00',
                name: 'Mateo Astudillo'
            }
        };

        handleLike = jest.fn();
        handleDelete = jest.fn();

        container = render(<Blog
            blog={testBlog}
            user={'mateoap00'}
            handleLike={handleLike}
            handleDelete={handleDelete}
        />).container;
    });

    /*
        Exercise 5.13: Wrote a test to check that when first rendering a blog, only the title and author of that blog is
        rendered.
    */
    test('<Blog /> component renders initially only blog\'s title and author', async () => {

        const title = container.querySelector('.blogTitle');
        const author = container.querySelector('.blogAuthor');
        const url = screen.queryByText('www.test.com');
        const likes = screen.queryByText('10');

        expect(title).toBeDefined();
        expect(author).toBeDefined();
        expect(url).toBeNull();
        expect(likes).toBeNull();
    });

    /*
        Exercise 5.14: Wrote a test to check that after rendering a blog, when a user clicks the View button, then title,
        author, likes, and url of the blog is shown.
    */
    test('<Blog /> component renders title, url, likes and author when view button is clicked', async () => {

        const user = userEvent.setup();
        const button = screen.getByText('View');
        await user.click(button);

        const title = container.querySelector('.blogTitle');
        const author = container.querySelector('.blogAuthor');
        const url = container.querySelector('.blogUrl');
        const likes = container.querySelector('.blogLikes');

        expect(title).toBeDefined();
        expect(author).toBeDefined();
        expect(url).toBeDefined();
        expect(likes).toBeDefined();
    });

    /*
        Exercise 5.15: Wrote a test to check that the like button handler is called the right amount of times depending in the
        number of times it was clicked (two clicks in this case).
    */
    test('<Blog /> handleLike is called correctly when like button is clicked', async () => {

        const user = userEvent.setup();
        const viewBtn = screen.getByText('View');
        await user.click(viewBtn);

        const likeBtn = screen.getByText('Like');
        await user.click(likeBtn);
        await user.click(likeBtn);

        expect(handleLike.mock.calls).toHaveLength(2);
    });
});

