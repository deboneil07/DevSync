const express = require('express');
const app = express();
const path = require('path');

const PORT = 200;

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index', {});
})

app.listen(PORT, () => {
    console.log('port running at ', PORT);
});