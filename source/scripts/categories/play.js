class PlayCategory extends HTMLElement {
	constructor() {
		super()
		this.append(document.getElementById('play-template').content.cloneNode(true))
	}

	connectedCallback() {
		
	}
}

export { PlayCategory }
