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

app.listen(PORT, () => {
    console.log('port running at', PORT);
});