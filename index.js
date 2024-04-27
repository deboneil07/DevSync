const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
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
            console.log(repo.html_url);
        })
    })
    .catch(err => {
        console.log(err);
    })
}
app.route('/')
.post(async (req, res) => {
    try{
        const body = await req.body;
        if (!body){
            return res.status(404, {message: "didnt recieve name"});
        }
        else{
            const data = body.query
            console.log(data);
            findUser(data)
            if (findUser(data)){
                return res.status(200, {message: 'successfully accessed data'}),
                res.render('default', {
                    id: data,
                });
            }
            else{
                res.status(500, {message: err.message});
            }
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

app.listen(PORT, () => {
    console.log('port running at', PORT);
});