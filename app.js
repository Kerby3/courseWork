let express = require('express');//подключение компонентов
const bodyParser = require('body-parser');//подключение компонентов
let app = express();//подключение компонентов
const urlencodedParser = bodyParser.urlencoded({extended: false});//подключение компонентов
let http = require('http');//подключение компонентов
let fs = require('fs');//подключение компонентов
const mysql = require("mysql2");//подключение компонентов
const passwordHash = require( 'password-hash' );
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use('public', express.static('public'));
app.use(express.static(__dirname + '/public'));


const PORT = 3306;// выбор порта для сервера



app.get('/', function (req, res) {
	fs.readFile('public/index.html', (err, data) => {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	})
});

app.post('/loginRegistration', urlencodedParser, function (req, res) { //если нажал кнопку "Войти\Регистрация", то откроется файл loginForm.html
	fs.readFile('./loginForm.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
	});
})

app.get('/registr', urlencodedParser, function (req, res) { //если перешел по ссылке "Вы у нас впервые? Зарегистрируйтесь, нажав на ссылку", то откроетс окно регистрации
	fs.readFile('./registrationForm.html', function (err, html) {
		res.setHeader("Content-Type", "text/html");
		res.write(html);
		res.end();
		
	});
})

app.post('/', urlencodedParser, function (req, res) { 
		if (req.body.typeClient === 'login') { 
			let hashedPassword = passwordHash.generate(req.body.password);
			let client = [req.body.email];
			let options = '';
			const connection = mysql.createConnection({
			  host: "localhost", 
			  user: "root",
			  database: "clientsCourseWork",
			  password: "qwerty",
			  port: 3307
			});
			  connection.connect(function(err){
			    if (err) {
			      return console.error("Ошибка: " + err.message);//вывод ошибки
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");
			    }
			 });
			  connection.execute('SELECT * FROM clientsCourseWork WHERE EMAIL=(?)', client, function (err, results) { 
			  	if (err) {
			  		console.log(err);
			  	} else {
			  		console.log(results.length);
			  		if (results.length === 0) {

			  			res.render('loginFormLose.hbs', {

			  			})

			  		} else {
			  			for (let i = 0; i < results.length; i += 1) {
			  				if (passwordHash.verify(req.body.password, results[i].PASSWORD_FIELD) === true) {
			  					console.log(`Welcome! ${client[0]}`);

			  					const connection = mysql.createConnection({
								  host: "localhost", 
								  user: "root",
								  database: "clientsCourseWork",
								  password: "qwerty",
								  port: 3307
								});

								connection.connect(function(err){
							    if (err) {
							      return console.error("Ошибка: " + err.message);//вывод ошибки
							    }
							    else{
							      console.log("Подключение к серверу MySQL успешно установлено");
							    }
							 });

							  connection.execute('SELECT * FROM clientsCourseWork', function (err, results) { 
							  	if (err) {
							  		console.log(err);
							  	} else {
							  		res.render('indexRegistrationSuccess.hbs', {
							  			successClient: results[0].LOGIN
									});
							  	}
							})
							  	connection.end(function(err) {
								if (err) {
								  return console.log("Ошибка: " + err.message);
								}
								console.log("Подключение закрыто");
							});
			  					break;
			  				} else {
			  					if (i === results.length - 1) {
						  			res.render('loginFormLose.hbs', {
			  				
			  						})
			  					}
			  					continue;
			  				}
			  			}
			  		}
			  	}
			  });			 
			 connection.end(function(err) {
			  if (err) {
			    return console.log("Ошибка: " + err.message);
			  }
			  console.log("Подключение закрыто");
			});
		} else if (req.body.typeClient === 'register') {
			console.log(req.body);
			let options = [];
			let hashedPassword = passwordHash.generate(req.body.password);
			let client = [req.body.email, req.body.login, hashedPassword]; 
			const connection = mysql.createConnection({
			  host: "localhost", //хост
			  user: "root",
			  database: "clientscoursework",
			  password: "qwerty",
			  port: 3307
			});			
			  connection.connect(function(err){
			    if (err) {
			      return console.error("Ошибка: " + err.message);
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");
			    }
			 });

			  connection.execute('SELECT * FROM clientsCourseWork', function (err, results) { 
				if (err) {
					console.log(err);
				} else {
					let tmp = 0;
					for (let i = 0; i < results.length; i += 1) {
						if (client[0] === results[i].EMAIL) {
							tmp += 1;
						}
					}

					if (tmp > 0) {
						console.log(`Такой пользователь уже зарегистрирован`);
						res.render('registrationFormDuplicateUser.hbs', {

						});
					} else {

						const connection = mysql.createConnection({//соединение с БД
						  host: "localhost",
						  user: "root",
						  database: "clientscoursework",
						  password: "qwerty",
						  port: 3307
						});
						connection.connect(function(err){
						    if (err) {
						        return console.error("Ошибка: " + err.message);
						    } else {
								console.log("Подключение к серверу MySQL успешно установлено");
							}
						});

						connection.execute("INSERT INTO clientsCourseWork (EMAIL, LOGIN, PASSWORD_FIELD) VALUES (?, ?, ?)",client, function (err, results) {
						 	if (err) {
						  		console.log(err);
						  	} else {
									console.log(`Welcome! ${client}`);
									res.render('indexRegistrationSuccess.hbs', {
										successClient: client[1]
									});
							}
						})
					}
				}
			});
			connection.end(function(err) {
			    if (err) {
				    return console.log("Ошибка: " + err.message);
			    }
			  console.log("Подключение закрыто");
			});
		}
	});


app.get('/cityBikes', (req, res) => {
	let file = 'public/cityBikes.html';
	fs.readFile(file, (err, data) => {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
});

app.get('/mountainBikes',urlencodedParser, (req, res) => {
	let html = 'public/mountainBikes.html';
	console.log(req.body)
	fs.readFile(html, (err, data) => {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		//console.log(data);
		res.write(data);
		res.end();
	});
})

app.get('*', (req, res) => {
	if (req.url == '/img/desnaGent.jpg') {
		fs.readFile('/img/desnaGent.jpg', (err, data) => {
			res.writeHeader(200, {'Content-Type': 'image/jpeg'});
			res.send(data);
		});
	} else if (req.url == 'img/Forward.jpg') {
		fs.readFile('img/Forward.jpg', (err, data) => {
			res.writeHeader(200, {'Content-Type': 'image/jpeg'});
			res.send(data);
		})
	}
})

app.post('/payment', (req, res) => {
	console.log(req.body);
	let html = 'public/payment.html';
	fs.readFile(html, (err, data) => {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
})

app.post('/basket', urlencodedParser,  (req, res) => {
	let html = 'public/basket.html';
	fs.readFile(html, (err, data) => {
		res.writeHeader(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
});

app.post('*', (req, res) => {
	console.log(`post ${req.url}`);
})

app.listen(PORT, function () {
	console.log('API app started');
})