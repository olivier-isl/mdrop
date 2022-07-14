/*!
 * Modal.js - https://myrage.be
 * Version - 1.0.0
 * 
 *
 * Copyright (c) 2020 Myrage.be
 */

class Modal {

	constructor(options) {

		this.sizes = ['md', 'lg', 'xl', 'full']

		this.options = {
			title: 'test',
			size: 'full',
			btnText: 'Enregistrer',
			content: ''
		}

		//console.log(typeof options)
		if(typeof options !== 'undefined') {
			Object.keys(options).forEach((el, i) => {
				this.options[el] = options[el]
			})
		}

		console.log(this.options)

		this.modal = this.createModal()
		this.show()
	}

	show() {
		document.body.append(this.modal)
	}
	hide() {
		this.modal.remove()
	}

	createModal() {
		const modal = document.createElement('div')
		modal.className = "mm-modal"

		const container = document.createElement('div')
		container.className = "mm-container"
		container.classList.add(this.sizes.includes(this.options.size)? 'mm-'+this.options.size : 'mm-md')

		

		const wrap = document.createElement('div')
		wrap.className = "mm-wrap"

		container.appendChild(wrap)
		modal.appendChild(container)

		this.createHeader(wrap)
		this.createBody(wrap)
		this.createFooter(wrap)

		return modal

	}

	createHeader(wrap) {
		const header = document.createElement('div')
		header.className=" mm-header"

		const title = document.createElement('h2')
		title.innerHTML = this.options.title
		
		header.appendChild(title)

		wrap.appendChild(header)
	}
	createBody(wrap) {
		const body = document.createElement('div')
		body.className=" mm-body"

		body.appendChild(typeof this.options.content === 'function'? this.options.content(): this.options.content)
		wrap.appendChild(body)
	}
	createFooter(wrap) {
		const footer = document.createElement('div')
		footer.className=" mm-footer"
		this.saveBtn = this.createButton(this.options, 'save')

		footer.appendChild(this.saveBtn)
		wrap.appendChild(footer)
	}

	createButton(opt, classe) {
		const button = document.createElement('button')
		button.setAttribute('class', 'mm-button-'+classe)
		if(typeof opt.btnClass !== 'undefined') {
			if(opt.btnClass.length !== 0) {
				if(opt.btnClass.typeof() === 'string') {
					button.className += ' ' + opt.btnClass
				}
				if(opt.btnClass.typeof() === 'array') {
					button.className += ' ' + opt.btnClass.join(' ')
				}
			}
		}
		button.innerText = opt.btnText
		return button
	}
}

export default Modal