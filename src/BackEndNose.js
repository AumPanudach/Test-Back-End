const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

app.use(express.json());

const db = new sqlite3.Database('./Database/Exam.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS books(
 id INTEGER PRIMARY KEY , title TEXT , author TEXT
)`);

app.get('/books',(req,res) => {
          db.all('SELECT * FROM books',(err,row) => {
            if(err){
                res.status(500).send(err)
            }
            else {
                res.json(row)
            }
    });
});

app.get('/books/:id' , (req,res) => {
    db.get('SELECT * FROM books WHERE id = ?' ,req.params.id , (err,row) => {
        if(err){
            res.status(500).send(err);
        }
        else if(!row){
            res.status(500).send('Book not found');
        }
        else{
            res.json(row);
        }
    } );
});

app.post('/books' , (req,res) => {
    const book = req.body;
    db.run('INSERT INTO books(title,author)VALUES(?,?)',book.title ,book.author, function (err) {
        if(err){
            res.status(500).send(err);
        }
        else{
            book.id = this.lastID;
            res.json(book)
        }
    });
});

app.put('/books/:id' , (req,res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id ,(err,row) => {
        if(!row){
            res.status(500).send('Book is not found')
        }
        else{
            const book = req.body;
            db.run('UPDATE books SET title = ? , author = ? WHERE id = ?',book.title,book.author,req.params.id,(err2) => {
                if(err2){
                    res.status(502).send(err2);
                }
                else{
                    res.json(book);
                }
            });
        }
    });
});

app.delete('/books/:id', (req,res) => {
    db.get('SELECT * FROM books WHERE id = ?',req.params.id,(err,row) => {
        if(!row){
            res.status(500).send("book is not found");
        }
        else{
            db.run('DELETE FROM books WHERE id = ? ',req.params.id,(err) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.json({});
        }
    });
    } 
  });
});
    

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listing PORT ${port}...`));