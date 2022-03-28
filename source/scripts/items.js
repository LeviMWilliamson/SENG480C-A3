import { parseForm, hydrateList } from "./utilities.js"

// bind delete buttons
const itemsString = localStorage.getItem('items')
const items = itemsString ? JSON.parse(itemsString) : []
const bindEvents = () => {
	document.querySelectorAll('button[data-list-item-id]').forEach( button => {
		button.addEventListener('click', event => {
			const itemId = event.target.getAttribute('data-list-item-id')
			const itemIndex = items.findIndex(item => item.id == itemId)
			items.splice(itemIndex, 1)
			localStorage.setItem('items', JSON.stringify(items))
			hydrateList(itemsList, itemsListItemTemplate, items)
		})
	})
}

// initial draw
const itemsList = document.getElementById('items')
const itemsListItemTemplate = document.getElementById('items-list-item-template').content
hydrateList(itemsList, itemsListItemTemplate, items)
bindEvents()

const createItemButton = document.getElementById('create-item')
createItemButton.addEventListener('click', event => {
	const newItemData = parseForm(event.target.form)

	// update items list
	const itemsString = localStorage.getItem('items')
	let items = itemsString ? JSON.parse(itemsString) : []
	items.push(newItemData)
	items = items.map((item, index) => ({ ...item, id: index }))
	localStorage.setItem('items', JSON.stringify(items))

	// redraw
	hydrateList(itemsList, itemsListItemTemplate, items)
	bindEvents()
})
