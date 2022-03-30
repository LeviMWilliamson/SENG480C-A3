import { hydrateList, hydrateForm, parseForm } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

const tagsListItemTemplate = document.getElementById('tags-list-item-template')
class TagsCategory extends HTMLElement {
	constructor() {
		super()
		this.dialogMode = Dialog.MODES.CREATE
		this.tagEdited = null

		this.append(document.getElementById('tags-template').content.cloneNode(true))

		this.tagsList = this.querySelector('#tags-list')
		this.dialogForm = this.querySelector('form[method="dialog"]')
		this.modifyTagDialog = this.querySelector('#modify-tag-dialog')
	}

	get tags() {
		return JSON.parse(localStorage.getItem('tags')) || []
	}
	set tags(tags) {
		localStorage.setItem('tags', JSON.stringify(tags))
	}

	bindCreateTagButton() {
		this.querySelector('#create-tag-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector("[slot='dialog-caption']").textContent = `🔖 Create Tag`
			this.modifyTagDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const newTagData = parseForm(event.target.form)

			let tags = this.tags
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					tags.push(newTagData)
					break
				case Dialog.MODES.EDIT:
					const itemIndex = tags.findIndex( tag => tag.id == this.tagEdited )
					tags[itemIndex] = newTagData
					break
			}
			tags = tags.map((tag, index) => ({ ...tag, id: index }))
			this.tags = tags

			this.renderTags()
			this.modifyTagDialog.close()
		})
	}

	bindDeleteTagButtons() {
		this.querySelectorAll('button.delete').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const itemIndex = tags.findIndex( tag => tag.id == dataListItemId )
				
				let tags = this.tags
				tags.splice(itemIndex, 1)
				this.tags = tags

				this.renderTags()
			})
		})
	}

	bindEditTagButtons() {
		this.querySelectorAll('button.edit').forEach( button => {
			button.addEventListener('click', event => {
				this.dialogMode = Dialog.MODES.EDIT
				this.querySelector('[slot="dialog-caption"]').textContent = `📝 Edit Tag`
	
				const { dataListItemId } = event.target.dataset
				hydrateForm(this.dialogForm, this.tags.find( tag => tag.id == dataListItemId ))
				this.modifyTagDialog.showModal()
	
				this.tagEdited = dataListItemId
			})
		})
	}

	renderTags() {
		hydrateList(this.tagsList, tagsListItemTemplate, this.tags)
		this.bindDeleteTagButtons()
		this.bindEditTagButtons()
	}

	connectedCallback() {
		this.bindCreateTagButton()
		this.bindDialogConfirmButton()
		this.renderTags()
	}
}

export { TagsCategory }
