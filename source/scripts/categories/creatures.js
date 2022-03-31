import { parseForm, hydrateList, hydrateForm } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

class CreaturesCategory extends HTMLElement {
	constructor() {
		super()
		this.dialogMode = Dialog.MODES.CREATE
		this.creatureEdited = null
		this.append(document.getElementById('creatures-template').content.cloneNode(true))
		this.modifyCreatureDialog = this.querySelector('#modify-creature-dialog')
		this.modifyCreatureForm = this.querySelector('#creature-modification-form')
	}

	get creatures() {
		return JSON.parse(localStorage.getItem('creatures')) || []
	}
	set creatures(creatures) {
		localStorage.setItem('creatures', JSON.stringify(creatures))
	}

	bindCreateCharacterButton() {
		this.querySelector('#create-creature-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector('[slot="dialog-caption"]').textContent = `🐲 Create Creature`
			hydrateForm(this.querySelector('#creature-modification-form'), {})
			this.modifyCreatureDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const newCharacterData = parseForm(event.target.form)

			let creatures = this.creatures
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					creatures.push(newCharacterData)
					break
				case Dialog.MODES.EDIT:
					const itemIndex = creatures.findIndex( creature => creature.id == this.creatureEdited )
					creatures[itemIndex] = newCharacterData
					break
			}
			creatures = creatures.map((creature, index) => ({ ...creature, id: index }))
			this.creatures = creatures

			this.renderCreatures()
			this.modifyCreatureDialog.close()
		})
	}

	bindEditCharacterButtons() {
		this.querySelectorAll('button.edit').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				this.creatureEdited = dataListItemId
				this.dialogMode = Dialog.MODES.EDIT
				
				this.querySelector("[slot='dialog-caption']").textContent = `🐲 Edit Creature`
				hydrateForm(this.querySelector('#modify-creature-dialog form'), this.creatures.find(creature => creature.id == dataListItemId))
				this.modifyCreatureDialog.showModal()
			})
		})
	}

	bindDeleteCharacterButtons() {
		this.querySelectorAll('button.delete').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const creatures = this.creatures.filter( creature => creature.id != dataListItemId )
				this.creatures = creatures
				this.renderCreatures()
			})
		})
	}

	renderCreatures() {
		hydrateList(this.querySelector('#creatures-list'), document.getElementById('creatures-list-item-template'), this.creatures)
		this.bindEditCharacterButtons()
		this.bindDeleteCharacterButtons()
	}

	connectedCallback() {
		this.bindCreateCharacterButton()
		this.bindDialogConfirmButton()
		this.renderCreatures()
	}
}

export { CreaturesCategory }
