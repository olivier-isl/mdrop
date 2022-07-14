/*!
 * Alert.js - https://myrage.be
 * Version - 1.0.0
 * 
 *
 * Copyright (c) 2020 Myrage.be
 */

class Alert {
	fire(options) {
		if (typeof options.cancelButtonText === 'undefined') {
			options.cancelButtonText = 'Annuler'
		}
		if(typeof options.confirmButtonText === 'undefined') {
			options.confirmButtonText= 'Confirmer'
		}
		this.t = 'ma'
		this.options = options
		this.type = ['warning', 'question', 'info', 'success', 'error', 'custom']
		this.positions = ['top', 'left', 'right', 'center', 'middle', 'bottom']
		this.close = null
		this.icons = {
			warning		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"></path></svg>`,
			question	: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path></svg>`,
			info		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path></svg>`,
			success		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>`,
			error		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>`,
		}
		/* 
		 * type : warning, infos, success, custom
		 * color: hex, hsl, rgb, rgba
		 * containerClass - Array or String
		 * animation : String
		 * position: top center, top left, top right, bottom center, bottom left, bottom right, middle center, middle left, middle right
		 * title - String
		 * titleClass - Array or String
		 * text - String
		 * textClass - Array or String
		 * cancelButton - Bool
		 * cancelButtonText - String
		 * confirmButton - Bool
		 * confirmButtonText - String
		 * timer - Number
		 * padding - Number
		 */
		this.container= this.createBlock()
		this.alert = this.createAlert()
		this.setPosition(this.container)
		this.showBlock(this.alert)
	}

	noti(options) {
		this.t = 'mn'
		this.options = options
		this.type = ['warning', 'question', 'info', 'success', 'error', 'custom']
		this.positions = ['top', 'left', 'right', 'center', 'middle', 'bottom']
		this.close = null
		this.icons = {
			warning		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"></path></svg>`,
			question	: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path></svg>`,
			info		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path></svg>`,
			success		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>`,
			error		: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>`,
		}

		this.container= this.createNotiBlock()
		if(document.querySelector('.mn-noti') === null) {
			this.notif = this.createNoti()
			this.setPosition(this.notif)
			this.showBlock(this.notif)
		} else {
			this.addNoti(document.querySelector('.mn-noti'))
		}
		
	}

	createTimer(container) {
		if(this.options.timer) {
			const sec = 1000
			const fps = 25
			const time = sec/fps
			let progress = document.createElement('div')
			progress.className = 'ma-progress'
			let bar = document.createElement('div')
			bar.className ='ma-bar'
			progress.appendChild(bar)
			container.appendChild(progress)
			let i = 0
			this.setTimer = setInterval(() => {
				const tempo = (i/time) / (this.options.timer/sec)
				bar.style.setProperty('transform', 'scaleX('+ tempo +')')
				i++
				if(i/time > this.options.timer/sec) {
					clearInterval(this.setTimer)
					switch(this.t) {
						case 'ma':
							this.removeAnimation(container , this.alert)
							break;
						case 'mn':
							this.removeAnimationNoti(this.container, this.notif)
							break;
					}
				}
			}, time)
		}
	}
	
	createAlert() {
		const alert = document.createElement('div')
		alert.setAttribute('class', 'ma-alert')
		alert.appendChild(this.container)
		return alert
	}

	createBlock() {
		const windowContainer = document.createElement('div')
		windowContainer.setAttribute('class', 'ma-container')
		windowContainer.classList.add(this.options.type)
		const container = document.createElement('div')
		container.setAttribute('class', 'ma-wrap')
		windowContainer.appendChild(container)
		this.addAnimation(container)
		this.createHeader(container)
		this.createCloseButton(container)
		this.closeWindow(container)
		this.createBody(container)
		this.createFooter(container)
		this.createTimer(container)
		
		return windowContainer
	}

	createNoti() {
		const alert = document.createElement('div')
		alert.setAttribute('class', 'mn-noti')
		alert.appendChild(this.container)
		return alert
	}

	addNoti(el) {
		el.appendChild(this.container)
	}

	createNotiBlock() {
		const type = this.t
		const windowContainer = document.createElement('div')
		windowContainer.setAttribute('class', 'mn-container')
		windowContainer.classList.add(this.options.type)
		const container = document.createElement('div')
		container.setAttribute('class', 'mn-wrap')
		windowContainer.appendChild(container)
		this.addAnimation(windowContainer)
		this.createHeader(container, type)
		this.createCloseButton(container)
		this.createBody(container, type)
		this.createTimer(container)
		
		return windowContainer
	}

	setPosition(container) {
		if(this.options.positions !== undefined) {
			const pos = this.options.positions.split(' ')
			if(pos.length < 2) {
				console.warn("veillez mettre la configuration manquante dans 'positions' du plugin Alert (x y)")
				container.setAttribute('style', 'top:50%; left: 50%; transform: translate3d(-50%,-50%,0);')
			}else {
				let {x, y} = 0
				let name = ''
				pos.forEach((el,i) => {
					let count = "30px"
					switch(el) {
						case 'top': 
							name = el
							y = 0
						break;
						case 'middle':
							name = 'top'
							y = 50
							count = "50%"
						break;
						case 'bottom':
							name = el
							y = 0
						break;
						case 'left': 
							name = el
							x = 0
						break;
						case 'right': 
							name = el
							x = 0
						break;
						case 'center': 
							name = 'left'
							x = 50
							count = "50%"
						break;
					}
					container.style.setProperty(name, count, '')
				})
				container.style.setProperty('transform', 'translate3d(-'+x+'%, -'+y+'%, 0)')
			}
		} else {
			container.setAttribute('style', 'top:50%; left: 50%; transform: translate3d(-50%,-50%,0);')
		}
	}

	createCloseButton(container) {
		if(this.options.closeButton) {
			this.close= document.createElement('a')
			this.close.setAttribute('class', 'ma-close')
			this.close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>`;
			container.appendChild(this.close)
			this.close.addEventListener('click', (e) => {
				e.preventDefault()
				switch(this.t) {
					case 'ma':
						this.removeAnimation(container, this.alert)
						break;
					case 'mn':
						this.removeAnimationNoti(this.container , this.notif)
						break;
				}
			})
		}
	}

	closeWindow(container) {
		window.addEventListener('keydown', (e) => {
			if(e.code === 'Escape' || e.key === 'Escape') {
				e.preventDefault()
				switch(this.t) {
					case 'ma':
						this.removeAnimation(container, this.alert)
						break;
					case 'mn':
						this.removeAnimationNoti(this.container , this.notif)
						break;
				}
			}
		})
	}

	createHeader(container, type = 'ma') {
		//contains icon
		const header = document.createElement('div')
		header.setAttribute('class', type+'-header')
		if(typeof this.options.type !== 'undefined'){
			const icons = document.createElement('div')
			icons.className= type+"-icon"

			icons.innerHTML = this.icons[this.options.type]
			header.appendChild(icons)
		}
		container.appendChild(header)
	}

	createBody(container, type = 'ma') {
		//contains content
		const body = document.createElement('div')
		body.setAttribute('class', type+'-body')
		if(typeof this.options.title === 'string') {
			const title = document.createElement('h2')
			title.className = type+"-title"
			title.innerHTML = this.options.title
			body.appendChild(title)
		}
		if(typeof this.options.text === 'string') {
			const text = document.createElement('div')
			text.className= type+"-content"
			text.innerHTML = this.options.text
			body.appendChild(text)
		}
		
		
		container.appendChild(body)
	}

	createFooter(container, type = 'ma') {
		//contains button
		const footer = document.createElement('div')
		footer.setAttribute('class', type+'-footer')
		if(this.options.cancelButton || this.options.cancelButton === undefined) {
			const cancelButton = this.createButton('cancel', this.options.cancelButtonText, this.options.cancelButtonClass)
			footer.appendChild(cancelButton)
			cancelButton.addEventListener('click', () => {
				this.removeAnimation(container, this.alert)
				if(typeof this.options.cancel === "function") {
					this.callBack(this.options.cancel())
				}
				
			})
		}
		if(this.options.confirmButton) {
			const confirmButton = this.createButton('confirm', this.options.confirmButtonText, this.options.confirmButtonClass)
			footer.appendChild(confirmButton)
			confirmButton.addEventListener('click', () => {
				this.removeAnimation(container, this.alert)
				if(typeof this.options.confirm === "function") {
					this.callBack(this.options.confirm())
				}
			})
		}
		
		container.appendChild(footer)
	}

	callBack(cb) {
		cb
	}

	createButton(opt, text, classe) {
		const button = document.createElement('button')
		button.setAttribute('class', 'ma-'+ opt)
		if(typeof classe !== 'undefined') {
			if(classe.length !== 0) {
				if(classe.typeof() === 'string') {
					button.className += ' ' + classe
				}
				if(classe.typeof() === 'array') {
					button.className += ' ' + classe.join(' ')
				}
			}
		}
		button.innerText = text
		return button
	}

	get getTransitionEndEventName() {
		var transitions = {
			"animation"       : "animationend",
			"OAnimation"      : "oAnimationEnd",
			"MozAnimation"    : "animationend",
			"WebkitAnimation" : "webkitAnimationEnd"
		}
		let bodyStyle = document.body.style;
		for(let transition in transitions) {
			if(bodyStyle[transition] != undefined) {
				return transitions[transition];
			} 
		}
	}

	addAnimation(container) {
		container.className += ' animate__animated ' + this.options.animation
	}

	removeAnimation(container, object) {
		container.classList.remove(this.options.animation)
		container.classList.add('animate__zoomOut')
		container.addEventListener(this.getTransitionEndEventName, () => {
			object.remove()
		}, false);
	}

	removeAnimationNoti(container) {
		container.classList.remove(this.options.animation)
		container.classList.add('animate__zoomOut')
		container.addEventListener(this.getTransitionEndEventName, () => {
			container.remove()
			if(this.t === 'mn') {
				this.removeNotiBlock() 
			}
		}, false);
	}

	removeNotiBlock() {
		if(document.querySelector('.mn-noti').childNodes.length <= 0) {
			document.querySelector('.mn-noti').remove()
		}
	}

	showBlock(el) {
		document.body.append(el)
	}
}

export default Alert