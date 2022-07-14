/*!
 * Drag.js - https://myrage.be
 * Version - 1.0.0
 * 
 *
 * Copyright (c) 2020 Myrage.be
 */

import Alert from './Alert.js'
import Modal from './Modal.js'

class Drag {
	constructor(options = "") {

		this.alert = new Alert()
		let opts = new Object()
		// this.modal = new Modal({

		// })
		this.options = null
		this.maxsize = '2.5Mo'
		this.zone = document.querySelector('drag')
		this.files = new Array()
		this.msg = null
		this.error = null
		this.mimeType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp']
		
		if(options === "") {
			for(let i = 0; i < this.zone.attributes.length; i++) {
				opts[this.zone.attributes[i].name] = this.zone.attributes[i].value
			}
			if(typeof opts.maxsize === 'undefined') {
				opts.maxsize = this.maxsize
			}
			opts.maxsize = this.#FileConvertSize(opts.maxsize, 'desc')
			this.options = opts
		} else {
			if(typeof options.maxsize === 'undefined') {
				options.maxsize = this.maxsize
			}
			options.maxsize = this.#FileConvertSize(options.maxsize, 'desc')
			this.options = options
		}
		
		this.input = this.#createInput(this.options.id)
		this.form = this.#createZone()
		this.#switchZone()
		this.click()
		this.#drag()
		this.#drop()
	}

	/* SWITCH DRAG TAG TO FORM TAG START */

	#switchZone() {
		this.zone.parentNode.insertBefore(this.form,this.zone)
		this.zone.remove()
	}

	/* SWITCH DRAG TAG TO FORM TAG END */
	/* SYSTEM START */

	//create b64 based on image uploaded
	#toBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		})
	}

	// List file to inject into a new DataTransfert
	#FileListItems (files) {
		var b = new ClipboardEvent("").clipboardData || new DataTransfer()
		for (var i = 0, len = files.length; i<len; i++) b.items.add(files[i])
		return b.files
	}

	// take file size octet and show on a specific size o,Ko,Mo,Go,To
	#FileConvertSize(aSize, order = 'asc'){
		if(order === 'asc') {
			aSize = Math.abs(parseInt(aSize, 10));
			var def = [[1, 'o'], [1024, 'Ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
			for(var i=0; i<def.length; i++){
				if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
			}
		}
		if(order === 'desc') {
			var def = [[1024*1024*1024*1024, 'To'], [1024*1024*1024, 'Go'] , [1024*1024, 'Mo'], [1024, 'Ko'], [1, 'o']];
			for(var i = 0; i<def.length; i++) {
				if(aSize.includes(def[i][1])) {
					let size = Math.abs(parseInt(Number(aSize.replace(def[i][1],'')),10))
					if(size<def[i][0]) return (size*def[i][0]).toFixed(2);
				}
			}
		}
	}

	//shortener name
	#shortName(name) {
		let n = ''
		for(let i = 0; i < 11; i++) {
			n += name[i]
		}
		return n
	}

	/* SYSTEM END */
	/* DOM GENERATION START */

	#createInput(id) {
		const input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('multiple', 'multiple')
		input.classList.add('md-none')
		input.setAttribute('id', 'md-input-'+id)

		document.querySelector('drag').parentNode.nodeName !== 'FORM' ? document.body.append(input): document.querySelector('drag').parentNode.append(input)
		

		return input
	}

	#clickPreview() {
		this.modal.show()
	}

	#createZone() {
		let form = document.querySelector('drag').parentNode.nodeName !== 'FORM' ?
			document.createElement('form'):
			document.createElement('div');
		form.setAttribute('class', 'md-drop isClickable md-clickable')
		this.msg = document.createElement('div')
		this.msg.classList.add('md-message')
		form.appendChild(this.msg)
		Object.keys(this.options).forEach(el => {
			switch(el) {
				case 'title':
					let button = document.createElement('button')
					button.innerHTML = this.options[el]
					button.classList.add('md-button')
					this.msg.appendChild(button)
				break;
				case 'url': 
					document.querySelector('drag').parentNode.nodeName !== 'FORM'? form.setAttribute('action', this.options[el]): null;
				break;
				case 'msg':
					let span = document.createElement('span')
					span.classList.add('note')
					span.innerHTML = this.options[el]
					this.msg.appendChild(document.createElement('br'))
					this.msg.appendChild(span)
				break;
			}
		})
		return form
	}

	#createImage(file) {
		const preview = document.createElement('div')
		preview.setAttribute('class', 'md-preview md-image-preview')
		preview.setAttribute('id', file.name)

		const windowImage = document.createElement('div')
		windowImage.setAttribute('class', 'md-image')

		var img = document.createElement('img')
		img.src = file.url

		const removeImage = document.createElement('a')
		removeImage.classList.add('md-remove')
		removeImage.innerHTML = this.iconDelete
		removeImage.onclick = () => {
			this.#clickRemove(file.name, preview)
		}

		preview.addEventListener('click', (e) => {
			e.stopPropagation()
			if(e.target.nodeName === 'A' || e.target.nodeName === 'svg' || e.target.nodeName === 'path') {
				return false
			}
			this.#clickPreview()
		})

		const contentDetails = document.createElement('div')
		contentDetails.classList.add('md-details')
		contentDetails.innerHTML = `
		<div class="md-size">
			<span data-mc-size>${this.#FileConvertSize(file.size)}</span>
		</div>
		<div class="md-filename">
			<span data-mc-name>${
				this.#shortName(file.name)
			}...</span>
		</div>`
		const scope = this
		contentDetails.querySelector('.md-filename').addEventListener('mouseover', function() {
			this.querySelector('span').innerHTML = file.name
		})
		contentDetails.querySelector('.md-filename').addEventListener('mouseout', function() {
			this.querySelector('span').innerHTML = scope.#shortName(file.name) + '...'
		})

		windowImage.appendChild(img)
		preview.appendChild(windowImage)
		preview.appendChild(removeImage)
		preview.appendChild(contentDetails)

		this.form.appendChild(preview)
	}

	/* DOM GENERATION END */

	#blockSize(size) {
		if(size < this.options.maxsize) {
			return true
		}
		return false
	}

	#setFiles(files) {
		Object.values(files).forEach((el, i) => {
			const notif = new Alert()
			if(this.mimeType.includes(el.type)) {
				if(this.#blockSize(el.size)) {
					this.msg.classList.add('md-none')
					this.files.push(el)
					this.#toBase64(el).then(res => {
						return res
					}).then(b64 => {
						const f = {
							url : b64,
							name: el.name,
							size: el.size
						}
						this.#createImage(f, (this.files.length-1) - i)
						this.#reiniInput()
						
						notif.noti({
							title: `Le fichier ${el.name} est accepté`,
							type: 'success',
							positions: 'top right',
							animation: 'animate__fadeInDown',
							closeButton: true, //default : false
							cancelButton: false, // default true
							timer: 3000,
						})
					})
				}else {
					notif.noti({
						title: `Le fichier ${el.name} est trop volumineux`,
						type: 'warning',
						positions: 'top right',
						animation: 'animate__fadeInDown',
						closeButton: true, //default : false
						cancelButton: false, // default true
						timer: 3000,
					})
				}
			} else {
					notif.noti({
						title: `le fichier ${el.name} n'est pas un format accepté`,
						type: 'error',
						positions: 'top right',
						animation: 'animate__fadeInDown',
						closeButton: true, //default : false
						cancelButton: false, // default true
						timer: 3000,
					})
			}
		})
	}

	#reiniInput() {
		this.input.files = this.#FileListItems(this.files)
	}

	#removeFile(name) {
		this.files = this.files.filter(el => {
			if(el.name !== name) {
				return el
			}
		})
		const dt = document.createElement('input')
		dt.setAttribute('type', 'file')
		dt.setAttribute('multiple', 'multiple')
		dt.files = this.#FileListItems(this.files)
		this.input.files = dt.files

		if(this.files.length === 0) {
			this.msg.classList.remove('md-none')
		}
		return true
	}

	

	#removeImage(preview) {
		preview.remove()
		return true
	}

	#clickRemove(name, prev) {
		this.alert.fire({
			title: 'êtes-vous sur de vouloir supprimer ceci ?',
			text: 'ceci sera irréversible',
			//positions: 'center middle',
			type: "warning",
			animation: 'animate__bounceIn',
			closeButton: true, //default : false
			cancelButton: true, // default true
			cancelButtonText: 'non',
			cancelButtonClass: 'test lorem ipsum',
			confirmButton: true, // default false
			confirmButtonText: 'oui',
			confirmButtonClass: ['dolor', 'site', 'amet'],
			confirm: () => {
				if(this.#removeFile(name) & this.#removeImage(prev)) {
					const success = new Alert()
					success.fire({
						title: `l'image à bien été supprimée`,
						//positions: 'center middle',
						type: "success",
						animation: 'animate__bounceIn',
						closeButton: true, //default : false
						cancelButton: true, // default true
						cancelButtonText: 'Ok !',
						timer: 2000
					})
				}
			}
		})
	}

	/* EVENT START */

	//click element to open input file
	click() {
		this.form.querySelector('.md-message').addEventListener('click', (e) => {
			e.preventDefault()
			this.input.click()
		})
		this.form.addEventListener('click', (e) => {
			e.preventDefault()
			if(e.target !== this.form) {
				return
			}
			this.input.click()
		})
		this.input.onchange = (e) => {
			this.#setFiles(this.input.files)
		}
	}

	//drag event files
	#drag(){
		this.form.addEventListener('dragover', (e) => {
			e.preventDefault();
			this.form.classList.add('isDragging')
		})
		this.form.addEventListener('dragleave', () => {
			this.form.classList.remove('isDragging')
		})
	}

	//drop event files
	#drop(){
		this.form.addEventListener('drop', (e) => { 
			e.preventDefault();
			this.#setFiles(e.dataTransfer.files)
		})
	}

	/* EVENT END */

	get iconDelete() {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"/></svg>`
	}
}

export default Drag
