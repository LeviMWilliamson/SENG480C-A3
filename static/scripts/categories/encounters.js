import { parseForm, hydrateForm, hydrateList } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

class EncountersCategory extends HTMLElement {
	constructor() {
		super()
		this.autoCompleteSources = ['items', 'tags', 'characters', 'creatures', 'environments']
		this.dialogMode = Dialog.MODES.CREATE
		this.encounterEdited = null
		this.append(document.getElementById('encounters-template').content.cloneNode(true))
		this.modifyEncounterDialog = this.querySelector('#modify-encounter-dialog')
	}

	get encounters() {
		return JSON.parse(localStorage.getItem('encounters')) || []
	}
	set encounters(encounters) {
		localStorage.setItem('encounters', JSON.stringify(encounters))
	}

	bindCreateEncounterButton() {
		this.querySelector('#create-encounter-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector('[slot="dialog-caption"]').textContent = `📃 Create Encounter`
			hydrateForm(this.querySelector('#encounter-modification-form'), {})
			this.modifyEncounterDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const newEncounterData = parseForm(event.target.form)
			
			let encounters = this.encounters
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					encounters.push(newEncounterData)
					break
				case Dialog.MODES.EDIT:
					const encounterIndex = this.encounters.findIndex( encounter => encounter.id == this.encounterEdited )
					encounters[encounterIndex] = newEncounterData
					break
			}
			encounters = encounters.map((encounter, index) => ({ ...encounter, id: index }))
			this.encounters = encounters

			this.renderEncounters()
			this.modifyEncounterDialog.close()
			event.target.form.reset()
		})
	}

	bindEditEncounterButtons() {
		this.querySelectorAll('button.edit').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				this.encounterEdited = dataListItemId
				this.dialogMode = Dialog.MODES.EDIT

				this.querySelector("[slot='dialog-caption']").textContent = `📃 Edit Encounter`
				hydrateForm(this.querySelector('#encounter-modification-form'), this.encounters[dataListItemId])
				this.modifyEncounterDialog.showModal()
			})
		})
	}

	bindDeleteEncounterButtons() {
		this.querySelectorAll('button.delete').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const encounters = this.encounters.filter( encounter => encounter.id != dataListItemId )
				this.encounters = encounters
				this.renderEncounters()
			})
		})
	}

	// autoCompleteDescriptions() {
	// 	const highlightedTemplate = document.getElementById('encounter-description-highlighted-template')
	// 	this.querySelectorAll('[slot="description"]').forEach( description => {
	// 		let hydratedDescription = this.encounters[description.dataset.dataListItemId].description
	// 		for( let source of this.autoCompleteSources )
	// 			for( let item of JSON.parse(localStorage.getItem(source)) )
	// 				hydratedDescription = hydratedDescription
	// 					.replace(/[\n\r]/g, '<br/>')	
	// 					.replace(
	// 						new RegExp(`(${item.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])\s*/g, '')}(s?))`, 'gi'),
	// 						highlightedTemplate
	// 							.innerHTML
	// 							.replace(/{name}/g, `${item.name}$2`)
	// 							.replace(/{title}/g, item.description || 'No description available.'))
	// 		description.innerHTML = hydratedDescription
	// 	})
	// }
	
	renderEncounters() {
		const encountersList = this.querySelector('#encounters-list')
		while(encountersList.firstChild)
			encountersList.removeChild(encountersList.firstChild)
		hydrateList(encountersList, document.getElementById('encounters-list-item-template'), this.encounters)
		this.bindEditEncounterButtons()
		this.bindDeleteEncounterButtons()
		// this.autoCompleteDescriptions()
	}

	connectedCallback() {
		this.bindCreateEncounterButton()
		this.bindDialogConfirmButton()
		this.renderEncounters()
	}
}

export { EncountersCategory }
