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



app.get('/', function (req, res) { // если зашел на главную страницу по ссылке\
	let options = '';
	res.render('index.hbs', {

	});
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

app.post('/', urlencodedParser, function (req, res) { //если нажал на одну из кнопок форм, то кидает на главную
		//console.log(req.body);
		if (req.body.typeClient === 'login') { //проверка на тип пользователя логинится он или регистрируется
			let hashedPassword = passwordHash.generate(req.body.password);
			let client = [req.body.email];
			let options = '';
			const connection = mysql.createConnection({//соединение с БД
			  host: "localhost", //хост
			  user: "root",//пользователь
			  database: "clientsCourseWork",//название БД
			  password: "qwerty",//пароль к БД
			  port: 3307//порт к БД
			});
			// тестирование подключения
			  connection.connect(function(err){//соединение с БД
			    if (err) {//проверка на ошибку
			      return console.error("Ошибка: " + err.message);//вывод ошибки
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
			    }
			 });


			  


			  connection.execute('SELECT * FROM clientsCourseWork WHERE EMAIL=(?)', client, function (err, results) { //выполнение SQL запроса на поиск клиента
			  	if (err) {//проверка на ошибку
			  		console.log(err);//вывод ошибки
			  	} else {
			  		console.log(results.length);
			  		//console.log(results);
			  		if (results.length === 0) {

			  			res.render('loginFormLose.hbs', {

			  			})

			  		} else {
			  			for (let i = 0; i < results.length; i += 1) {
			  				if (passwordHash.verify(req.body.password, results[i].PASSWORD_FIELD) === true) {
			  					console.log(`Welcome! ${client[0]}`);

			  					const connection = mysql.createConnection({//соединение с БД
								  host: "localhost", //хост
								  user: "root",//пользователь
								  database: "clientsCourseWork",//название БД
								  password: "qwerty",//пароль к БД
								  port: 3307//порт к БД
								});

								connection.connect(function(err){//соединение с БД
							    if (err) {//проверка на ошибку
							      return console.error("Ошибка: " + err.message);//вывод ошибки
							    }
							    else{
							      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
							    }
							 });

							  connection.execute('SELECT * FROM clientsCourseWork', function (err, results) { //выполнение SQL запроса на поиск клиента
							  	if (err) {//проверка на ошибку
							  		console.log(err);//вывод ошибки
							  	} else {
							  		//console.log(results);
							  		
							  	res.render('indexRegistrationSuccess.hbs', {
							  		successClient: client[0]
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
			 // закрытие подключения
			 connection.end(function(err) {
			  if (err) {
			    return console.log("Ошибка: " + err.message);
			  }
			  console.log("Подключение закрыто");
			});
		} else if (req.body.typeClient === 'register') {
			console.log(req.body);
			let options = [];
			//console.log(hashedPassword.length);
			let hashedPassword = passwordHash.generate(req.body.password);
			let client = [req.body.email, hashedPassword]; //парсинг данных из форм
			const connection = mysql.createConnection({//соединение с БД
			  host: "localhost", //хост
			  user: "root",//пользователь
			  database: "clientscoursework",//название БД
			  password: "qwerty",//пароль к БД
			  port: 3307//порт к БД
			});
			// тестирование подключения
			  connection.connect(function(err){//соединение с БД
			    if (err) {//проверка на ошибку
			      return console.error("Ошибка: " + err.message);//вывод ошибки
			    }
			    else{
			      console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
			    }
			 });

			  connection.execute('SELECT * FROM clientsCourseWork', function (err, results) { //выполнение SQL запроса на поиск клиента
				if (err) {//проверка на ошибку
					console.log(err);//вывод ошибки
				} else {
					console.log(`Welcome! ${client}`);
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
						  host: "localhost", //хост
						  user: "root",//пользователь
						  database: "clientscoursework",//название БД
						  password: "qwerty",//пароль к БД
						  port: 3307//порт к БД
						});
						// тестирование подключения
						connection.connect(function(err){//соединение с БД
						    if (err) {//проверка на ошибку
						        return console.error("Ошибка: " + err.message);//вывод ошибки
						    } else {
								console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
							}
						});

						connection.execute("INSERT INTO clientsCourseWork (EMAIL, PASSWORD_FIELD) VALUES (?, ?)",client, function (err, results) { //выполнение SQL запроса на добавление клиента при регистрации
						 	if (err) {//проверка на ошибку
						  		console.log(err);//вывод ошибки
						  	} else {
						  		/*const connection = mysql.createConnection({//соединение с БД
									  host: "localhost", //хост
									  user: "root",//пользователь
									  database: "clientscoursework",//название БД
									  password: "qwerty",//пароль к БД
									  port: 3307//порт к БД
								});

								connection.connect(function(err){//соединение с БД
								    if (err) {//проверка на ошибку
								        return console.error("Ошибка: " + err.message);//вывод ошибки
								    } else {
										console.log("Подключение к серверу MySQL успешно установлено");//вывод успешного подключения к БД
									}
								});

								connection.execute('SELECT * FROM clientscoursework', function (err, results) { //выполнение SQL запроса на поиск клиента
								 	if (err) {//проверка на ошибку
								  		console.log(err);//вывод ошибки
								  	} else {
								  		console.log(`Welcome! ${client[0]}`);
										if (results.length === 1) {
										 			
										} else {

										}*/
									res.render('indexRegistrationSuccess.hbs', {
										successClient: client[0]
									});
							}
						})
						/*connection.end(function(err) {
							if (err) {
						  	    return console.log("Ошибка: " + err.message);
							} 
							console.log("Подключение закрыто");
						});*/

					}
				}
			});
			// закрытие подключения
			connection.end(function(err) {
			    if (err) {
				    return console.log("Ошибка: " + err.message);
			    }
			  console.log("Подключение закрыто");
			});
		}
	});
	

app.listen(PORT, function () {
	console.log('API app started');
})