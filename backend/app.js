// Importa express e bodyParser
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

// Importa SQLite3 e define o caminho do banco
const sqlite3 = require('sqlite3').verbose()
const DBPATH = './data/bancoPessoas.db'

// Define a url em que vai rodar
const hostname = 'localhost';
const port = 3000;

// Define a váriavel app, usada para chamar os métodos do express
const app = express();

// Define o caminho do frontend
app.use(express.static("./frontend/"));
// Define que o express usará json
app.use(express.json());

// Inicia o servidor
app.listen(port, hostname, () => {
    console.log('Page server running at http://' + hostname + ':' + port + '/');
  });


  // READ
  app.get('/listar', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	var sql = 'SELECT * FROM pessoas';
	
	db.all(sql, [],  (err, rows ) => {
			if (err) {
				throw err;
			}
			res.json(rows);
		});
		db.close(); // Fecha o banco
});


// CREATE
app.post('/inserirPessoa', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	sql = "INSERT INTO pessoas (nome, idade) VALUES ('" + req.body.nome + "','" + req.body.idade + "')";
	db.run(sql, [],  err => {
		if (err) {
		    throw err;
		}
		
	});
	res.write('<a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
	res.end();
});

// DELETE
app.post('/removePessoa/:id', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

    sql = "DELETE FROM pessoas WHERE id='" + req.params.id + "'";
    console.log(sql);
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.run(sql, [],  err => {
        if (err) {
            throw err;
        }
        res.end();
    });
    res.write('<a href="/">VOLTAR</a>');
    db.close(); // Fecha o banco
});

// UPDATE
app.post('/editarPessoa', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); // Isso é importante para evitar o erro de CORS

	sql = `UPDATE pessoas 
       SET nome = '${req.body.nome}', 
           idade = '${req.body.idade}'
       WHERE id = ${parseInt(req.body.id)}`;
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [],  err => {
		if (err) {
		    throw err;
		}
		res.end();
	});
    res.write('<a href="/">VOLTAR</a>');
	db.close(); // Fecha o banco
});