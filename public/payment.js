let payButton = document.querySelector('.payButton');

payButton.addEventListener('click', () => {
	localStorage.removeItem('order');
});