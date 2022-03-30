// utilities
const hydrateList = (listElement, listItemTemplate, listData) => {
	// delete all children
	while(listElement.firstChild)
		listElement.removeChild(listElement.firstChild)

	// add new children
	listElement.append( ...listData.map( listItem => {
		const listItemElement = listItemTemplate.content.cloneNode(true)
		listItemElement
			.querySelectorAll('[slot]')
			.forEach( slot => {
				if(slot.getAttribute('slot') == 'id')
					slot.dataset.dataListItemId = listItem.id
				else if(slot instanceof HTMLInputElement)
					slot.value = listItem[slot.getAttribute('slot')]
				else
					slot.innerText = listItem[slot.getAttribute('slot')]
			})
		return listItemElement
	}))
}

const hydrateForm = (formElement, formData) =>
	formElement.querySelectorAll('[name]').forEach( input =>
		input.value = formData[input.name]
	)

const parseForm = formElement =>
	[...(new FormData(formElement)).entries()].reduce((accumulated, [key, value]) => ({ ...accumulated, [key]: value }) , {})

export { hydrateList, hydrateForm, parseForm }
