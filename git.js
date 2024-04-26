const axios = require('axios');
const git = require('simple-git');
require('dotenv').config();

const token = process.env.GITHUB_TOKEN;
const username = 'deboneil07';

const apiUrl = `https://api.github.com/users/${username}/repos`;

axios.get(apiUrl, {
    headers: {
        'Authorization': `token ${token}`, 
        'Accept': 'application/vnd.github.v3+json',
    },
})
  .then(response => {
    const repositories = response.data;
    repositories.forEach(repo => 
    console.log('User repositories:', repo.html_url) 
    );
    
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching user repositories:', error);
  });
