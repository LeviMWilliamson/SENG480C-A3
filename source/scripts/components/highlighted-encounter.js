class HighlightedEncounter extends HTMLElement {
	constructor() {
		
	}

	autoCompleteDescriptions() {
		const highlightedTemplate = document.getElementById('encounter-description-highlighted-template')
		this.querySelectorAll('[slot="description"]').forEach( description => {
			let hydratedDescription = this.encounters[description.dataset.dataListItemId].description
			for( let source of this.autoCompleteSources )
				for( let item of JSON.parse(localStorage.getItem(source)) )
					hydratedDescription = hydratedDescription
						.replace(/[\n\r]/g, '<br/>')	
						.replace(
							new RegExp(`(${item.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])\s*/g, '')}(s?))`, 'gi'),
							highlightedTemplate
								.innerHTML
								.replace(/{name}/g, `${item.name}$2`)
								.replace(/{title}/g, item.description || 'No description available.'))
			description.innerHTML = hydratedDescription
		})
	}

	connectedCallback() {
		
	}
}