import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createBlog = async (blog) => {
    const config = {
        headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, blog, config);
    return response.data;
};

const likesBlog = async (id, blog) => {
    const config = {
        headers: { Authorization: token },
    };
    const url = `${baseUrl}/${id}`;
    const response = await axios.put(url, blog, config);
    return response.data;
};

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    };
    const url = `${baseUrl}/${id}`;
    const response = await axios.delete(url, config);
    return response.data;
};

export default { setToken, getAll, createBlog, likesBlog, deleteBlog };