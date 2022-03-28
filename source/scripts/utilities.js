// utilities
const hydrateList = (listElement, listItemTemplate, listData) => {
	// delete all children
	while(listElement.firstChild)
		listElement.removeChild(listElement.firstChild)

	// add new children
	listElement.append( ...listData.map( listItem => {
		const listItemElement = listItemTemplate.cloneNode(true)
		listItemElement
			.querySelectorAll('[slot]')
			.forEach( slot => { slot.innerText = listItem[slot.getAttribute('slot')] })
		listItemElement
			.querySelectorAll('button')
			.forEach( bindElement => { bindElement.setAttribute('data-list-item-id', listItem.id) })
		return listItemElement
	}))
}

const parseForm = formElement =>
	[...(new FormData(formElement)).entries()].reduce((accumulated, [key, value]) => ({ ...accumulated, [key]: value }) , {})

export { hydrateList, parseForm }
