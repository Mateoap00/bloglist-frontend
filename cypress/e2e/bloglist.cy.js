describe('Bloglist app', function () {

    /*
        Exercise 5.17: In this exercise I installed and configured cypress for e2e testing. Also I wrote the beforeeach block that
        runs every time before the tests run, this deletes the documents of the blogs and users in the mongoDB testing database and
        then adds a new user to use in the tests. After that the first test runs and verifies that the login form is shown correctly.
    */
    beforeEach(function () {
        // Resets the mongo database used for testing
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);

        // Creates user to use in the tests
        const user = {
            name: 'Mateo Astudillo',
            username: 'mateoap00',
            password: 'astudillo'
        };
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);

        // Visits the URL defined in the cypress.config file
        cy.visit('');
    });

    it('Login form is shown', function () {
        cy.contains('Log In').click();
        cy.contains('Login with your username and password');
        cy.contains('Username:');
        cy.contains('Password:');
        cy.get('#username');
        cy.get('#password');
        cy.get('#loginBtn');
        cy.get('#cancelBtn');
    });

    /*
        Exercise 5.18: In this exercise I test the login form and run a test for when the credentials are correct and for when they
        are incorrect. For the wrong credentials test it also checks that the notification shown is displayed in red and shows Wrong
        username or password.
    */
    describe('Login', function () {
        it('Succeeds with correct credentials', function () {
            cy.contains('Log In').click();
            cy.get('#username').type('mateoap00');
            cy.get('#password').type('astudillo');
            cy.get('#loginBtn').click();
            cy.contains('Mateo Astudillo is logged in');
        });

        it('Fails with wrong credentials', function () {
            cy.contains('Log In').click();
            cy.get('#username').type('mateoap00');
            cy.get('#password').type('wrong');
            cy.get('#loginBtn').click();

            cy.get('.failure').should('contain', 'Wrong username or password.')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid');

            cy.get('html').should('not.contain', 'Mateo Astudillo is logged in');
        });
    });

    describe('When a user is logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'mateoap00', password: 'astudillo' });
        });

        /*
            Exercise 5.19: In this exercise a user is logged in and then creates a new blog, for this I am using two tests. The first
            test uses the form to create a new blog and writes the information in the inputs fields. In the second test I'm using a
            cypress command that accepts as parameter the blog object with the title, author, url and likes and creates the new blog with
            a post request to the backend. Both tests succeed if the new blog created is within the blogs list in the frontend.
        */
        it('A new blog can be created using the form', function () {
            cy.contains('New Blog').click();
            cy.get('#newBlogTitle').type('A blog created by cypress');
            cy.get('#newBlogAuthor').type('Cypress');
            cy.get('#newBlogURL').type('www.cypressalsowroteme.com');
            cy.get('#newBlogLikes').type('6');
            cy.get('#addBlogBtn').click();
            cy.contains('A blog created by cypress');
        });

        it('A new blog can be created with the command createBlog', function () {
            cy.createBlog({
                title: 'Another blog created by cypress',
                author: 'Cypress',
                url: 'www.cypresswroteme.com',
                likes: 6
            });
            cy.contains('Another blog created by cypress');
        });

        /*
            Exercise 5.20: For this exercise a user is logged in and then likes a blog. Here I'm using the createBlog command and
            also the parent() function of cypress to get the parent div of the entire blog once it gets expanded, then this is tagged
            as 'parentDiv'. The like button is find in the parent div by it's id. Once the blog gets liked, it checks in the entire
            parent div for the increased number of likes (in this case from 1 to 2).
        */
        it('A blog can be liked by a user', function () {
            cy.createBlog({
                title: 'A blog to be liked',
                author: 'Cypress',
                url: 'www.LikeMePls.com',
                likes: 1
            });
            cy.contains('A blog to be liked').parent().find('button').click();
            cy.contains('A blog to be liked').parent().parent().as('parentDiv');
            cy.get('@parentDiv').contains('1');
            cy.get('@parentDiv').get('.likeBtn').click();
            cy.get('@parentDiv').contains('2');
        });

        /*
            Exercise 5.21: For this exercise a user that created a blog can delete it. First I'm creating a new blog post with the
            logged in user, after that I'm looking for the parent div that contains the title of the blog, expanding it with a click
            in the 'view' button and then deleting with a click in the 'delete' button. The test passes if the recently created blog
            is not longer in the blog list and also the notification bar shows the confirmation message.
        */
        it('A blog can be deleted by the user that created that blog', function () {

            cy.createBlog({
                title: 'A blog created by Mateo Astudillo',
                author: 'Mateo',
                url: 'www.MateoTheWriter.com',
                likes: 5
            });

            cy.contains('A blog created by Mateo Astudillo').parent().find('button').click();
            cy.contains('A blog created by Mateo Astudillo').parent().parent().as('parentDiv');
            cy.get('@parentDiv').get('.deleteBtn').click();

            cy.contains('Blog deleted successfully!');
            cy.get('html').should('not.contain', 'A blog created by Mateo Astudillo');
        });
    });

    describe('When multiple users are registered', function () {
        beforeEach(function () {
            const admin = {
                name: 'The Admin',
                username: 'admin',
                password: '12345'
            };

            const user02 = {
                name: 'Pablo',
                username: 'pablo00',
                password: 'password'
            };

            cy.request('POST', `${Cypress.env('BACKEND')}/users`, admin);
            cy.request('POST', `${Cypress.env('BACKEND')}/users`, user02);

            cy.visit('');

            cy.login({ username: 'mateoap00', password: 'astudillo' });

            cy.createBlog({
                title: 'A blog created by Mateo Astudillo',
                author: 'Mateo',
                url: 'www.MateoWroteMe.com',
                likes: 3
            });

            cy.get('#logOutBtn').click();

            cy.login({ username: 'admin', password: '12345' });

            cy.createBlog({
                title: 'A blog created by the admin user',
                author: 'The Admin',
                url: 'www.AdminWriter.com',
                likes: 2
            });

            cy.get('#logOutBtn').click();

            cy.login({ username: 'pablo00', password: 'password' });

            cy.createBlog({
                title: 'The first blog created by Pablo',
                author: 'Pablo',
                url: 'www.InterestingBlog.com',
                likes: 7
            });

            cy.createBlog({
                title: 'The second blog created by Pablo',
                author: 'Pablo',
                url: 'www.InterestingBlogPart2.com',
                likes: 5
            });

            cy.get('#logOutBtn').click();
        });

        /*
            Exercise 5.22: For this exercise a user that created a blog can delete it and only that user, others users can only view
            and like the blog. First I register a few more users and create blogs with each user then log in one by one to check each
            blog and look for the delete button once a blog gets expanded, if a blog was posted by the user logged in then it gets
            deleted and the user logs out so another user logs in and the process repeats.
        */
        it('Only the creator of the blog can delete it, not other users', function () {

            cy.login({ username: 'pablo00', password: 'password' });

            cy.contains('The first blog created by Pablo').parent().find('button').click();
            cy.contains('The first blog created by Pablo').parent().parent().as('parentDiv');
            cy.get('@parentDiv').contains('Delete').click();

            cy.contains('The second blog created by Pablo').parent().find('button').click();
            cy.contains('The second blog created by Pablo').parent().parent().as('parentDiv');
            cy.get('@parentDiv').contains('Delete').click();

            cy.contains('A blog created by Mateo Astudillo').parent().find('button').click();
            cy.contains('A blog created by Mateo Astudillo').parent().parent().as('parentDiv');
            cy.get('@parentDiv').should('not.contain', 'Delete');

            cy.contains('A blog created by the admin user').parent().find('button').click();
            cy.contains('A blog created by the admin user').parent().parent().as('parentDiv');
            cy.get('@parentDiv').should('not.contain', 'Delete');

            cy.get('#logOutBtn').click();

            cy.login({ username: 'mateoap00', password: 'astudillo' });

            cy.contains('A blog created by Mateo Astudillo').parent().find('button').click();
            cy.contains('A blog created by Mateo Astudillo').parent().parent().as('parentDiv');
            cy.get('@parentDiv').contains('Delete').click();

            cy.contains('A blog created by the admin user').parent().find('button').click();
            cy.contains('A blog created by the admin user').parent().parent().as('parentDiv');
            cy.get('@parentDiv').should('not.contain', 'Delete');

            cy.get('#logOutBtn').click();

            cy.login({ username: 'admin', password: '12345' });

            cy.contains('A blog created by the admin user').parent().find('button').click();
            cy.contains('A blog created by the admin user').parent().parent().as('parentDiv');
            cy.get('@parentDiv').contains('Delete').click();

            cy.get('#logOutBtn').click();
        });

        /*
            Exercise 5.23: In this exercise the test checks if the list of blogs is order by the number of likes from greater to lesser.
            For this I'm using the method advised in the material, all the divs with the content of a blog have a class name assigned as
            blogMinimized, I cy.get each div in order and check that the first one is the one with more likes. Then I give likes to two
            two blogs and verify if the order changed and how it should be shown now. Also I'm checking that after a like in a blog, the
            text where the likes are presented changes, this is done with invoke and should methods of cypress and using a aux variable
            to verify the last value of likes.
        */
        it('The blog list is order according to the number of likes of each blog', function () {
            cy.login({ username: 'mateoap00', password: 'astudillo' });

            cy.get('.blogMinimized').eq(0).should('contain', 'The first blog created by Pablo');
            cy.get('.blogMinimized').eq(1).should('contain', 'The second blog created by Pablo');
            cy.get('.blogMinimized').eq(2).should('contain', 'A blog created by Mateo Astudillo');
            cy.get('.blogMinimized').eq(3).should('contain', 'A blog created by the admin user');

            cy.contains('The second blog created by Pablo').parent().find('button').click();
            cy.contains('The second blog created by Pablo').parent().parent().as('parentDiv');

            let prevLikes;
            cy.get('@parentDiv').get('span.blogLikes').invoke('text').then((text) => {
                prevLikes = parseInt(text, 10);
            });
            cy.get('@parentDiv').contains('Like').click().then(function () {
                cy.get('@parentDiv').get('span.blogLikes').invoke('text').should('contain', `${prevLikes + 1}`);
            });
            cy.get('@parentDiv').contains('Like').click().then(function () {
                cy.get('@parentDiv').get('span.blogLikes').invoke('text').should('contain', `${prevLikes + 2}`);
            });
            cy.get('@parentDiv').contains('Like').click().then(function () {
                cy.get('@parentDiv').get('span.blogLikes').invoke('text').should('contain', `${prevLikes + 3}`);
            });
            cy.contains('Hide').click();

            cy.contains('A blog created by the admin user').parent().find('button').click();
            cy.contains('A blog created by the admin user').parent().parent().as('parentDiv');
            cy.get('@parentDiv').get('span.blogLikes').invoke('text').then((text) => {
                prevLikes = parseInt(text, 10);
            });
            cy.get('@parentDiv').contains('Like').click().then(function () {
                cy.get('@parentDiv').get('span.blogLikes').invoke('text').should('contain', `${prevLikes + 1}`);
            });
            cy.get('@parentDiv').contains('Like').click().then(function () {
                cy.get('@parentDiv').get('span.blogLikes').invoke('text').should('contain', `${prevLikes + 2}`);
            });
            cy.contains('Hide').click();

            cy.get('.blogMinimized').eq(0).should('contain', 'The second blog created by Pablo');
            cy.get('.blogMinimized').eq(1).should('contain', 'The first blog created by Pablo');
            cy.get('.blogMinimized').eq(2).should('contain', 'A blog created by the admin user');
            cy.get('.blogMinimized').eq(3).should('contain', 'A blog created by Mateo Astudillo');

            cy.get('#logOutBtn').click();
        });
    });
});