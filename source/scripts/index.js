// site navigation
const categoryButtons = document.querySelectorAll('button[data-category]')
categoryButtons.forEach(button => {
	button.addEventListener('click', event => {
		const { category } = event.target.dataset
		const categoryTemplate = document.getElementById(category).content.cloneNode(true)
		const container = document.querySelector('main')
		while(container.firstChild)
			container.removeChild(container.firstChild)
		container.append(categoryTemplate)
	})
})
