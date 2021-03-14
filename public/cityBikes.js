let buttonDesnaVoyagGent = document.querySelector('.addDesnaVoyagGent');
let count = 0;
let bicycles = [];
let hidden = document.querySelector('.order');
if (localStorage.getItem('order') != null) {
	bicycles = JSON.parse(localStorage.getItem('order'));
	console.log(`true = ${bicycles}`);
} 
let basketButton = document.querySelector('.basketButton');

buttonDesnaVoyagGent.addEventListener('click', () => {
	let flag = false;
	for (let i = 0; i < bicycles.length; i += 2) {
		if (bicycles[i] == 'desnaVoyagGent') {
			bicycles[i + 1] += 1;
			flag = true;
			break;
		}
	}
	if (flag == false) {
		bicycles.push('desnaVoyagGent', 1);
	}
	console.log(`click = ${bicycles}`);
	localStorage.setItem('order', JSON.stringify(bicycles));
})

basketButton.addEventListener('click', () => {
	let output = '';
	//const request = new XMLHttpRequest();
	//const url = '/basket';

	//location.href = 'http://localhost:3306/basket';
	for (let i = 0; i < bicycles.length; i += 2) {
		output += `Name=${bicycles[i]}&Count=${bicycles[i + 1]}`;
		console.log(`bicycles.length = ${bicycles.length}\ni = ${i}`);
	}
	hidden.value = output;
	console.log(hidden.value);
	/*request.open('POST', url);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(output);*/
});