const express = require("express");
const http=require("http");
const Pool = require('pg').Pool
const bodyParser = require("body-parser");

const app = express();

app.use(express.static('public'))
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ProjectDatabase',
    password: 'postgres',
    port: 5432,
});

app.post("/api/user/check", (req, res) => {
    console.log("Server accessed");
    const user = req.body;

    const sql = "SELECT * FROM Users WHERE username=$1 AND pswd=$2";
    const data = [user.username, user.password];
    
    pool.query(sql, data, (error, results) => {
        if(error) {
            throw error
        } 

        if(results.rows.length===0){
            return res.status(404).json({error: "User not found"});
        }

        console.log(results.rows);
        return res.status(200);
    })

    
    
});

app.post("/api/user/create", (req, res) => {
    const user = req.body;

    const sql = "INSERT INTO Users (username, pswd, email) VALUES ($1, $2, $3)";
    const data = [user.username, user.password, user.email];
    
    pool.query(sql, data, (error, results) => {
        if(error) {
            if(error.code == '23505'){
                return res.status(409).json({message: 'Username Already Exists'})
            } else {
                throw error;
            }
        } 
        res.status(200).json(results.rows)
    })
    
});

app.post("/api/search", (req, res) => {
    console.log("Server accessed");
    const book = req.body;

    const sql = "SELECT * FROM Books WHERE UPPER(title) LIKE UPPER($1)";
    const data = [`%${book.title}%`];
    
    pool.query(sql, data, (error, results) => {
        if(error) {
            throw error;
        } 
        console.log(results.rows);
        if(results.rows.length===0){
            console.log("Book not found");
            return res.status(404).json({error: "Book not found"});
        }
        return res.status(200).json(results.rows);
    })

    
    
});


app.listen(80, () => {
    console.log("Listening on port 80");
});