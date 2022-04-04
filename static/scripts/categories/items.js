import { parseForm, hydrateList } from '../utilities.js'

const itemsListItemTemplate = document.getElementById('items-list-item-template')
class ItemsCategory extends HTMLElement {
	constructor() {
		super()

		this.append(document.getElementById('items-template').content.cloneNode(true))

		this.itemsList = this.querySelector('#items-list')
		this.createItemButton = this.querySelector('#create-item-button')
	}

	get items() {
		return JSON.parse(localStorage.getItem('items')) || []
	}
	set items(items) {
		localStorage.setItem('items', JSON.stringify(items))
	}

	bindDeleteItemButton() {
		for( let button of document.querySelectorAll('button.delete') )
			button.addEventListener('click', event => {
				const { listItemId } = event.target.dataset

				let items = this.items
				const itemIndex = items.findIndex(item => item.id == listItemId)
				items.splice(itemIndex, 1)
				items = items.map((item, index) => ({ ...item, id: index }))
				this.items = items

				hydrateList(this.itemsList, itemsListItemTemplate, items)
			})
	}

	bindCreateItemButton() {
		this.createItemButton.addEventListener('click', event => {
			const newItemData = parseForm(event.target.form)

			// update items list
			let items = this.items
			items.push(newItemData)
			items = items.map((item, index) => ({ ...item, id: index }))
			this.items = items

			// redraw
			this.renderItems()
			this.bindDeleteItemButton()
		})
	}

	renderItems() {
		hydrateList(this.itemsList, itemsListItemTemplate, this.items)
		this.bindDeleteItemButton()
	}

	connectedCallback() {
		this.bindCreateItemButton()
		this.renderItems()
	}
}

export { ItemsCategory }