import { hydrateList, hydrateForm, parseForm } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

class TriggersCategory extends HTMLElement {
	constructor() {
		super()
		this.append(document.getElementById('triggers-template').content.cloneNode(true))
		this.modifyTriggerDialog = this.querySelector('#modify-trigger-dialog')
	}

	get triggers() {
		return JSON.parse(localStorage.getItem('triggers')) || []
	}
	set triggers(triggers) {
		localStorage.setItem('triggers', JSON.stringify(triggers))
	}

	bindModifyTriggerButtons() {
		this.querySelectorAll('button.edit').forEach(button => {
			button.addEventListener('click', event => {
				const trigger = this.triggers.find( ({ id }) => id == event.target.dataset.dataListItemId )
				this.dialogMode = Dialog.MODES.MODIFY
				this.querySelector('[slot="dialog-caption"]').textContent = `🔔 Modify Trigger`
				hydrateForm(this.querySelector('#trigger-modification-form'), trigger)
				this.modifyTriggerDialog.showModal()
			})
		})
	}

	bindDeleteTriggerButtons() {
		this.querySelectorAll('button.delete').forEach(button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const triggers = this.triggers.filter( ({ id }) => id != dataListItemId )
				console.log(triggers)
				this.triggers = triggers
				this.renderTriggers()
			})
		})
	}

	bindCreateTriggerButton() {
		this.querySelector('#create-trigger-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector('[slot="dialog-caption"]').textContent = `🔔 Create Trigger`
			hydrateForm(this.querySelector('#trigger-modification-form'), {})
			this.modifyTriggerDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const form = this.querySelector('#trigger-modification-form')
			const trigger = parseForm(form)

			let triggers = this.triggers
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					triggers.push(trigger)
					break
				case Dialog.MODES.MODIFY:
					const index = this.triggers.findIndex(trigger => trigger.id == trigger.id)
					triggers[index] = trigger
					break
			}
			triggers = triggers.map( (trigger, index) => ({  id: index, ...trigger }) )
			this.triggers = triggers

			this.renderTriggers()
			this.modifyTriggerDialog.close()
		})
	}

	renderTriggers() {
		hydrateList(this.querySelector('#triggers-list'), document.getElementById('triggers-list-item-template'), this.triggers)
		this.bindModifyTriggerButtons()
		this.bindDeleteTriggerButtons()
	}

	connectedCallback() {
		this.bindCreateTriggerButton()
		this.bindDialogConfirmButton()
		this.renderTriggers()
	}
}

export { TriggersCategory }
