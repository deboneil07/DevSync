const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const git = require('simple-git');
require('dotenv').config();
let octokit;
import('@octokit/core').then(({ Octokit }) => {
    octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
});


const PORT = 200;
const token = process.env.GITHUB_TOKEN;


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({extended: false}));

const findUser = async (user_id) => {
    const apiURL = `https://api.github.com/users/${user_id}/repos`;
    try {
        const response = await axios.get(apiURL, {
            headers:{
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const repositories = response.data;
        return repositories;
    }
    catch(err) {
        console.log(err);
    }
}
app.route('/')
.post(async (req, res) => {
    try{
        const {query} = req.body;
        if (!query){
            return res.status(404, {message: "didnt recieve name"});
        }
        else{
            const repositories =  await findUser(query)
            res.render('default', {
                id: repositories,
            });
            return res.status(200, {message: 'successfully accessed data'})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500, {message: "error"});
    }
})
.get(async (req, res) => {
    res.render('default');
})

app.route('/redirect')
.post(async (req, res) => {
    const link = req.body.redirectUrl;
    res.redirect(link);
});

app.post('/clone', async(req, res) => {
    const cloneLink = req.body.clone;
    const repoName = cloneLink.split('/').slice(-1)[0].replace('.git', '');
    const cloneDir = `../Downloads/DevSync/${repoName}`
    git().clone(cloneLink, cloneDir)
    .then(() => {
        res.status(200, {message: 'Success'})
        res.render('confirm');
    })
    .catch(err => {
        res.status(500, {message: `${err}`});
    });
    
});

app.post('/readme', async(req,res) => {
    const owner = req.body.readme;
    const repoName = owner;

    try{
        const response = await octokit.request('GET /search/repositories', {
            q: `user:${owner} repo:${repoName}`,
            per_page: 1
        });
        if (response.data.items.length > 0){
            const readme = await octokit.request(`GET /repos/${owner}/${repoName}/readme`);
            const readmeContent = Buffer.from(readme.data.content, 'base64').toString('utf-8');
            
            res.render('readme', {
                content: readmeContent,
            });
        };
    }
    catch (err){
        console.log(err);
    };
});

app.listen(PORT, () => {
    console.log('port running at', PORT);
});