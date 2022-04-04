class HighlightedEncounter extends HTMLElement {
	constructor() {
		super()
		this.append(document.getElementById('highlighted-encounter-template').content.cloneNode(true))
		this.autoCompleteSources = ['items', 'tags', 'characters', 'creatures', 'environments']
	}

	bindContentChanged() {
		this.querySelectorAll('[slot="description"]').addEventListener('slotchange', event => this.autoCompleteDescriptions() )
	}

	autoCompleteDescriptions() {
		const highlightedTemplate = document.getElementById('encounter-description-highlighted-template')
		const descriptionSourceElement = this.querySelector('[slot="description"]')

		let hydratedDescription = descriptionSourceElement.innerHTML
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

		const autoCompletedDescription = this.querySelector('.description-auto-completed')
		autoCompletedDescription.innerHTML = hydratedDescription
	}

	connectedCallback() {
		this.autoCompleteDescriptions()
	}
}

export { HighlightedEncounter }
