import { ItemsCategory } from './categories/items.js'
import { TagsCategory } from './categories/tags.js'
import { CharactersCategory } from './categories/characters.js'
import { CreaturesCategory } from './categories/creatures.js'
customElements.define('category-items', ItemsCategory, { extends: 'section' })
customElements.define('category-tags', TagsCategory, { extends: 'section' })
customElements.define('category-characters', CharactersCategory, { extends: 'section' })
customElements.define('category-creatures', CreaturesCategory, { extends: 'section' })

// site navigation
const categoryButtons = document.querySelectorAll('button[data-category]')
const container = document.querySelector('main')
categoryButtons.forEach(button => {
	button.addEventListener('click', event => {
		const { category } = event.target.dataset
		while(container.firstChild)
			container.removeChild(container.firstChild)
		const categoryElement = document.createElement('section', { is: `category-${category}` })
		container.append(categoryElement)
	})
})
