const express = require('express');
const app = express();
const path = require('path');
const git = require('simple-git');
require('dotenv').config();

const PORT = 200;
const token = process.env.GITHUB_TOKEN;


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({extended: false}));

const findUser = async (user_id) => {
    const apiURL = `https://api.github.com/users/${user_id}/repos`;

    await axios.get(apiURL, {
        headers:{
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
        }
    })
    .then(response => {
        const repositories = response.data;
        repositories.forEach(repo => {
            return repo.html_url, res.status(200, {message: 'successfully accessed data'});
        })
    })
    .catch(err => {
        res.status(500, {message: err.message});
    })
}

app.get('/', (req, res) => {
    return res.render('index')
});

app.post('/', async (req, res) => {
    try{
        const body = await req.body;
        if (!body){
            return res.status(404, {message: "didnt recieve name"});
        }
        else{
            const data = body.query
            console.log(data);
            return res.status(200, {message:"success"});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500, {message: "error"});
    }
})

app.listen(PORT, () => {
    console.log('port running at', PORT);
});