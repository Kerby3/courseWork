let buttonForward = document.querySelector('.addForward');
let count = 0;
let bicycles = [];
let hidden = document.querySelector('.order');
if (localStorage.getItem('order') != null) {
	bicycles = JSON.parse(localStorage.getItem('order'));
	console.log(`true = ${bicycles}`);
}  
let basketButton = document.querySelector('.basketButton');

buttonForward.addEventListener('click', () => {
	let flag = false;
	for (let i = 0; i < bicycles.length; i += 2) {
		if (bicycles[i] == 'Forward') {
			bicycles[i + 1] += 1;
			flag = true;
			break;
		}
	}
	if (flag == false) {
		bicycles.push('Forward', 1);
	}
	console.log(`click = ${bicycles}`);
	localStorage.setItem('order', JSON.stringify(bicycles));
})

basketButton.addEventListener('click', () => {
	let output = '';
	//const request = new XMLHttpRequest();
	/*request.addEventListener("readystatechange", () => {

	    if(request.readyState === 4 && request.status === 200) {       
			console.log(request.responseText);
	    }
	});
	const url = 'basketForm';*/
	for (let i = 0; i < bicycles.length; i += 2) {
		output += `Name=${bicycles[i]}&Count=${bicycles[i + 1]}&`;
	}
	hidden.value = output;
	/*request.open('POST', url);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(output);*/
})