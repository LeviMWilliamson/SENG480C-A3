import { parseForm, hydrateList, hydrateForm } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

class CharactersCategory extends HTMLElement {
	constructor() {
		super()
		this.dialogMode = Dialog.MODES.CREATE
		this.characterEdited = null
		this.append(document.getElementById('characters-template').content.cloneNode(true))
		this.modifyCharacterDialog = this.querySelector('#modify-character-dialog')
	}

	get characters() {
		return JSON.parse(localStorage.getItem('characters')) || []
	}
	set characters(characters) {
		localStorage.setItem('characters', JSON.stringify(characters))
	}

	bindCreateCharacterButton() {
		this.querySelector('#create-character-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector("[slot='dialog-caption']").textContent = `🧝‍♂️ Create Character`
			hydrateForm(this.querySelector('#character-modification-form'), {})
			this.modifyCharacterDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const newCharacterData = parseForm(event.target.form)
			console.log(newCharacterData)

			let characters = this.characters
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					characters.push(newCharacterData)
					break
				case Dialog.MODES.EDIT:
					const itemIndex = characters.findIndex( character => character.id == this.characterEdited )
					characters[itemIndex] = newCharacterData
					break
			}
			characters = characters.map((character, index) => ({ ...character, id: index }))
			this.characters = characters

			this.renderCharacters()
			this.modifyCharacterDialog.close()
			event.target.form.reset()
		})
	}

	bindEditCharacterButtons() {
		this.querySelectorAll('button.edit').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				this.characterEdited = dataListItemId
				this.dialogMode = Dialog.MODES.EDIT
				
				this.querySelector("[slot='dialog-caption']").textContent = `🧝‍♂️ Edit Character`
				hydrateForm(this.querySelector('#modify-character-dialog form'), this.characters.find(character => character.id == dataListItemId))
				this.modifyCharacterDialog.showModal()
			})
		})
	}

	bindDeleteCharacterButtons() {
		this.querySelectorAll('button.delete').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const characters = this.characters.filter( character => character.id != dataListItemId )
				this.characters = characters
				this.renderCharacters()
			})
		})
	}

	renderCharacters() {
		hydrateList(this.querySelector('#characters-list'), document.getElementById('characters-list-item-template'), this.characters)
		this.bindEditCharacterButtons()
		this.bindDeleteCharacterButtons()
	}

	connectedCallback() {
		this.bindCreateCharacterButton()
		this.bindDialogConfirmButton()
		this.renderCharacters()
	}
}

export { CharactersCategory }
