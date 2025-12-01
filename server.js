const express = require("express");
const http=require("http");
const Pool = require('pg').Pool
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(express.static('public'))
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.CONN_STR,
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

app.get("/api/home/getReads", (req, res) => {
    console.log("Server Accessed");
    console.log(req.query);

    const data = [req.query.username, req.query.status];
    const sql= `SELECT * FROM ReadingStats WHERE username=$1 AND readingStatus=$2`;
    pool.query(sql, data, (error, results) => {
        if(error) {throw error}
        if(results.rows.length===0){
            console.log("No books found");
            return res.status(404).json({error: "No books found"});
        }
        console.log(results.rows);
        return res.status(200).json(results.rows)
    })

});

app.get("/api/getBookInfo", (req, res) =>{
    const data = [req.query.username, req.query.book];
    const sql= `SELECT * FROM ReadingStats WHERE username=$1 AND readingStatus='Currently Reading' AND book=$2`

    pool.query(sql, data, (error, results) => {
        if(error) {throw error}

        console.log(results.rows);
        return res.status(200).json(results.rows)
    })
})

// Example
app.get("/api/books", async (req, res) => {
    try {
        const sql = "SELECT * FROM Books";
        const result = await pool.query(sql);
        res.json(result.rows); // <-- must be an array
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching books" });
    }
});

app.get("/api/books/*", async (req, res) => {
    const title = decodeURIComponent(req.params[0]); 

    try {
        const sql = "SELECT * FROM Books WHERE title=$1";
        const result = await pool.query(sql, [title]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching book" });
    }
});


app.post("/api/home/editBookProgress", (req, res) => {
    const progress = req.body;

    const data = [
        progress.username,
        progress.book,
        progress.author,         // add author from frontend
        progress.currentPage,
        progress.totalPages,
        progress.readingStatus
    ];

    const sql = `
        INSERT INTO ReadingStats(username, book, author, dateStarted, currentPage, pageNum, readingStatus)
        VALUES($1, $2, $3, NOW(), $4, $5, $6)
        ON CONFLICT(username, book, dateStarted)
        DO UPDATE SET currentPage=EXCLUDED.currentPage, pageNum=EXCLUDED.pageNum, readingStatus=EXCLUDED.readingStatus
    `;

    pool.query(sql, data, (error, results) => {
        if(error) {
            throw error;
        }
        return res.status(200).json("Updated Successfully");
    });
});

app.get("/api/books/all", (req, res) => {
    pool.query("SELECT * FROM Books", (err, results) => {
        if (err) throw err;
        res.json(results.rows);
    });
});

app.get("/api/home/getYearReads", (req, res) => {
    console.log("Server Accessed");

    const startDate = `${req.query.year}-01-01`;
    const endDate = `${req.query.year}-12-31`;

    const data = [req.query.username, startDate, endDate];
    const sql= `SELECT * FROM ReadingStats WHERE username=$1 AND dateCompleted BETWEEN $2 AND $3`;
    pool.query(sql, data, (error, results) => {
        if(error) {throw error}
        if(results.rows.length===0){
            console.log("No books found");
            return res.status(404).json({error: "No books found"});
        }
        console.log(results.rows);
        return res.status(200).json(results.rows)
    })

});

app.post("/api/home/editBookProgress", (req, res) => {
    console.log("Server accessed");
    const progress = req.body;
    

    const data = [progress.username, progress.book, progress.currentPage, progress.totalPages, progress.readingStatus];
        
    const sql = "UPDATE ReadingStats SET currentPage=$3, pageNum=$4, readingStatus=$5 WHERE username=$1 AND book=$2";
    
    

    pool.query(sql, data, (error, results) => {
        if(error) {
            throw error;
        } 
        return res.status(200).json("Updated Successfully");
    })

    
    
});

app.get("/api/home/getYearReads", (req, res) => {
    console.log("Server Accessed");

    const startDate = `${req.query.year}-01-01`;
    const endDate = `${req.query.year}-12-31`;

    const data = [req.query.username, startDate, endDate];
    const sql= `SELECT * FROM ReadingStats WHERE username=$1 AND dateCompleted BETWEEN $2 AND $3`;
    pool.query(sql, data, (error, results) => {
        if(error) {throw error}
        if(results.rows.length===0){
            console.log("No books found");
            return res.status(404).json({error: "No books found"});
        }
        console.log(results.rows);
        return res.status(200).json(results.rows)
    })

});

app.get("/api/discussions", async (req, res) => {
  try {
    const sql = `
      SELECT d.book, d.author, b.cover
      FROM Discussions d
      JOIN Books b ON d.book = b.title AND d.author = b.author
    `;
    const results = await pool.query(sql);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/discussions/:book", async (req, res) => {
  try {
    const sql = "SELECT username, postComment FROM postComments WHERE discussion=$1";
    const results = await pool.query(sql, [req.params.book]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const { discussion, username, postComment } = req.body;
    const sql =
      "INSERT INTO postComments (discussion, username, postComment) VALUES ($1, $2, $3)";
    await pool.query(sql, [discussion, username, postComment]);
    res.status(200).json({ message: "Comment added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});


app.listen(80, () => {
    console.log("Listening on port 80");
});