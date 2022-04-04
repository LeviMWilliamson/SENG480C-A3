import { hydrateList } from "../utilities.js"

class EventsCategory extends HTMLElement {
	constructor() {
		super()
		this.append(document.getElementById('play-template').content.cloneNode(true))
	}

	get events() {
		return JSON.parse(localStorage.getItem('events')) || []
	}
	set events(events) {
		localStorage.setItem('events', JSON.stringify(events))
	}

	bindSocketListener() {
		this.previousMessage = null
		this.eventSocket = new WebSocket('ws://localhost:5000/serial')
		this.eventSocket.addEventListener('message', ({ data }) => {
			if(data != this.previousMessage) {
				this.previousMessage = data
				const triggers = JSON.parse(localStorage.getItem('triggers')) || []
				triggers.filter( ({ event }) => event == data ).forEach(trigger => {
					const events = this.events
					events.push({
						time: (new Date()).toLocaleString(),
						...trigger
					})
					this.events = events
					this.renderEvents()
				})
			}
		})
	}

	renderEvents() {
		hydrateList(this.querySelector('#events-list'), document.getElementById('events-list-item-template'), this.events)
	}

	connectedCallback() {
		this.bindSocketListener()
		this.renderEvents()
	}

	disconnectedCallback() {
		delete this.eventSocket
	}
}

export { EventsCategory }
