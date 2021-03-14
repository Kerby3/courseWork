let productField = document.querySelector('.productField');
let products = {
	'desnaVoyagGent' : {
		'name': 'Десна Вояж Гент',
		'img': 'img/desnaGent.jpg',
		'description': 'колеса 28" материал рамы: сталь количество скоростей: 1 пол: унисекс амортизация: Rigid (жесткий)',
		'price': '8100 Руб.'
	},
	'Forward': {
		'name': 'Forward',
		'img': 'img/Forward.jpg',
		'description': 'колеса 27.5" материал рамы: алюминиевый сплав количество скоростей: 21 пол: унисекс амортизация: Hard tail, ход вилки 80 мм',
		'price': '21320 Руб.'
	}
};



window.addEventListener('load', () => {
	let localStorageOrder = JSON.parse(localStorage.getItem('order'));
	for (let i = 0; i < localStorageOrder.length; i += 2) {
		let product = createProduct(localStorageOrder[i]);		
		productField.appendChild(product);

	}
})


let createProduct = (productOrder) => {
	let newLS = [];
	let product = document.createElement('div');
	product.classList.add('product');
	let imageOfProduct = document.createElement('img');
	imageOfProduct.classList.add('productPhoto');
	imageOfProduct.src = products[productOrder].img;
	product.appendChild(imageOfProduct);
	let nameOfProduct = document.createElement('span');
	nameOfProduct.classList.add('productName');
	nameOfProduct.textContent = products[productOrder].name;
	product.appendChild(nameOfProduct);
	product.appendChild(document.createElement('br'));
	let priceOfProduct = document.createElement('span');
	priceOfProduct.classList.add('productPrice');
	priceOfProduct.textContent = products[productOrder].price;
	product.appendChild(priceOfProduct);
	product.appendChild(document.createElement('br'))
	let descriptionOfProduct = document.createElement('span');
	descriptionOfProduct.classList.add('productDescription');
	descriptionOfProduct.textContent = products[productOrder].description;
	product.appendChild(descriptionOfProduct);
	product.appendChild(document.createElement('br'))
	let deleteProduct = document.createElement('input');
	deleteProduct.type = 'submit';
	deleteProduct.classList.add('deleteButton');
	deleteProduct.value = 'Удалить товар';
	deleteProduct.addEventListener('click', () => {
		let ls = JSON.parse(localStorage.getItem('order'));
		let i = ls.indexOf(productOrder);
		ls.splice(i, 2);
		localStorage.removeItem('order');
		localStorage.setItem('order', JSON.stringify(ls));
		productField.removeChild(product);
	})
	product.appendChild(deleteProduct);
	return product;
}