import { hydrateForm, hydrateList, parseForm } from '../utilities.js'
import { Dialog } from '../components/dialog.js'

class EnvironmentsCategory extends HTMLElement {
	constructor() {
		super()
		this.dialogMode = Dialog.MODES.CREATE
		this.environmentEdited = null
		this.append(document.getElementById('environments-template').content.cloneNode(true))
		this.modifyEnvironmentDialog = this.querySelector('#modify-environment-dialog')
	}

	get environments() {
		return JSON.parse(localStorage.getItem('environments')) || []
	}
	set environments(environments) {
		localStorage.setItem('environments', JSON.stringify(environments))
	}

	bindCreateEnvironmentButton() {
		this.querySelector('#create-environment-button').addEventListener('click', event => {
			this.dialogMode = Dialog.MODES.CREATE
			this.querySelector('[slot="dialog-caption"]').textContent = `🌱 Create Environment`
			hydrateForm(this.querySelector('#environment-modification-form'), {})
			this.modifyEnvironmentDialog.showModal()
		})
	}

	bindDialogConfirmButton() {
		this.querySelector('#confirm-dialog-button').addEventListener('click', event => {
			const newEnvironmentData = parseForm(event.target.form)

			let environments = this.environments
			switch(this.dialogMode) {
				case Dialog.MODES.CREATE:
					environments.push(newEnvironmentData)
					break
				case Dialog.MODES.EDIT:
					const itemIndex = environments.findIndex( environment => environment.id == this.environmentEdited )
					environments[itemIndex] = newEnvironmentData
					break
			}
			environments = environments.map((environment, index) => ({ ...environment, id: index }))
			this.environments = environments

			this.renderEnvironments()
			this.modifyEnvironmentDialog.close()
		})
	}

	bindEditEnvironmentButtons() {
		this.querySelectorAll('button.edit').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				this.environmentEdited = dataListItemId
				this.dialogMode = Dialog.MODES.EDIT

				this.querySelector("[slot='dialog-caption']").textContent = `🌱 Edit Environment`
				hydrateForm(this.querySelector('#modify-environment-dialog form'), this.environments.find(environment => environment.id == dataListItemId))
				this.modifyEnvironmentDialog.showModal()
			})
		})
	}

	bindDeleteEnvironmentButtons() {
		this.querySelectorAll('button.delete').forEach( button => {
			button.addEventListener('click', event => {
				const { dataListItemId } = event.target.dataset
				const environments = this.environments.filter(environment => environment.id != dataListItemId)
				this.environments = environments
				this.renderEnvironments()
			})
		})
	}

	renderEnvironments() {
		hydrateList(this.querySelector('#environments-list'), document.getElementById('environments-list-item-template'), this.environments)
		this.bindEditEnvironmentButtons()
		this.bindDeleteEnvironmentButtons()
	}

	connectedCallback() {
		this.renderEnvironments()
		this.bindCreateEnvironmentButton()
		this.bindDialogConfirmButton()
	}
}

export { EnvironmentsCategory }
