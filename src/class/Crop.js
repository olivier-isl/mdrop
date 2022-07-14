/*!
 * Crop.js - https://myrage.be
 * Version - 1.0.0
 * 
 *
 * Copyright (c) 2020 Myrage.be
 */

class Crop {
	constructor(img, opt) {
		const scope = this
		this.img = this.getImage(img)
		this.sizeOrigin = {
			w: this.img.width/2,
			h: this.img.height/2
		}

		this.scale = this.flip = {
			x: 1,
			y: 1
		}

		this.rotation = 0

		this.translate = this.translateCanvas = this.translateCanvasOld = this.center = this.centerOld = {
			x : 0,
			y : 0
		}

		this.setRange = {
			min : 1,
			max : 10,
			step: 0.01
		}

		this.cropperCanvas = document.createElement('div')
		
		//this.createInput()

		this.createCropper()
		this.content = this.createContent()
		
		this.aside = this.createAside()

		this.full = document.createElement('div')
		this.full.className="mc-container"
		this.full.appendChild(this.content)
		this.full.appendChild(this.aside)

		this.setTransform()

		return this.full
	}

	createInput() {
		this.input = document.createElement('input')
		this.input.setAttribute('type', 'file')
		this.input.className = 'test'
	}

	/* va servir pour la prévisualisation et les données brut */
	createAside() {
		const aside = document.createElement('div')
		aside.className = 'mc-aside'

		this.inputX  = document.createElement('input')
		this.inputY  = document.createElement('input')
		this.inputW  = document.createElement('input')
		this.inputH  = document.createElement('input')
		this.inputR  = document.createElement('input')
		this.inputSX = document.createElement('input')
		this.inputSY = document.createElement('input')

		return aside
	}

	createMenu() {
		const menu = document.createElement('nav')
		menu.className= "mc-menu"

		this.moveButton			= this.createButton({
			icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z"></path></svg>`,
			title: 'move',
			keep: true,
			callback: () => {
				let active = false
				if(this.moveButton.classList.contains('active')) {
					active = true
				}
				this.move(this, active)
			}
		})
		this.cropperButton		= this.createButton({
			icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M488 352h-40V96c0-17.67-14.33-32-32-32H192v96h160v328c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24v-40h40c13.25 0 24-10.75 24-24v-48c0-13.26-10.75-24-24-24zM160 24c0-13.26-10.75-24-24-24H88C74.75 0 64 10.74 64 24v40H24C10.75 64 0 74.74 0 88v48c0 13.25 10.75 24 24 24h40v256c0 17.67 14.33 32 32 32h224v-96H160V24z"></path></svg>`,
			title: 'cropper',
			keep: true,
			callback: () => {}
		})
		this.zoomInButton			= this.createButton({
			icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"></path></svg>',
			title: 'zoomIn',
			keep: false,
			callback: () => {}
		})
		this.zoomOutButton		= this.createButton({
			icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 192v32c0 6.6-5.4 12-12 12H124c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"></path></svg>',
			title: 'zoomOut',
			keep: false,
			callback: () => {}
		})
		this.rotateLeftButton		= this.createButton({
			icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M255.545 8c-66.269.119-126.438 26.233-170.86 68.685L48.971 40.971C33.851 25.851 8 36.559 8 57.941V192c0 13.255 10.745 24 24 24h134.059c21.382 0 32.09-25.851 16.971-40.971l-41.75-41.75c30.864-28.899 70.801-44.907 113.23-45.273 92.398-.798 170.283 73.977 169.484 169.442C423.236 348.009 349.816 424 256 424c-41.127 0-79.997-14.678-110.63-41.556-4.743-4.161-11.906-3.908-16.368.553L89.34 422.659c-4.872 4.872-4.631 12.815.482 17.433C133.798 479.813 192.074 504 256 504c136.966 0 247.999-111.033 248-247.998C504.001 119.193 392.354 7.755 255.545 8z"></path></svg>',
			title: 'rotateLeft',
			keep: false,
			callback: () => {
				this.rotation -= 10
				this.setTransform()
			}
		})
		this.rotateRightButton	= this.createButton({
			icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>',
			title: 'rotateRight',
			keep: false,
			callback: () => {
				this.rotation += 10
				this.setTransform()
			}
		})
		this.flipXButton			= this.createButton({
			icon: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">

					<path d="M256,0c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15V15C271,6.716,264.284,0,256,0z"/>

					<path d="M256,137c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,143.716,264.284,137,256,137z"/>

					<path d="M256,275c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,281.716,264.284,275,256,275z"/>

					<path d="M256,412c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,418.716,264.284,412,256,412z"/>

					<path d="M179.402,103.503l-120-36.842c-4.549-1.398-9.491-0.552-13.317,2.276C42.258,71.765,40,76.241,40,81v350
						c0,4.759,2.258,9.235,6.085,12.063c3.841,2.839,8.787,3.668,13.317,2.275l120-36.842c6.299-1.933,10.598-7.751,10.598-14.339
						V117.842C190,111.254,185.7,105.437,179.402,103.503z M160,383.071l-90,27.632V101.296l90,27.632V383.071z"/>
					<path d="M465.915,68.937c-3.827-2.828-8.769-3.674-13.317-2.276l-120,36.842c-6.299,1.933-10.598,7.751-10.598,14.339v276.316
						c0,6.588,4.3,12.405,10.598,14.339l120,36.842c4.566,1.402,9.505,0.541,13.317-2.276C469.742,440.235,472,435.759,472,431V81
						C472,76.241,469.742,71.765,465.915,68.937z M442,410.704l-90-27.632V128.928l90-27.632V410.704z"/>
			</svg>
			`,
			title: 'flipX',
			keep: false,
			callback: () => {
				this.flip.x = -this.flip.x
				this.setTransform()
			}
		})
		this.flipYButton			= this.createButton({
			icon: `<svg style="transform:rotate(90deg);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">

					<path d="M256,0c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15V15C271,6.716,264.284,0,256,0z"/>

					<path d="M256,137c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,143.716,264.284,137,256,137z"/>

					<path d="M256,275c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,281.716,264.284,275,256,275z"/>

					<path d="M256,412c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,418.716,264.284,412,256,412z"/>

					<path d="M179.402,103.503l-120-36.842c-4.549-1.398-9.491-0.552-13.317,2.276C42.258,71.765,40,76.241,40,81v350
						c0,4.759,2.258,9.235,6.085,12.063c3.841,2.839,8.787,3.668,13.317,2.275l120-36.842c6.299-1.933,10.598-7.751,10.598-14.339
						V117.842C190,111.254,185.7,105.437,179.402,103.503z M160,383.071l-90,27.632V101.296l90,27.632V383.071z"/>
					<path d="M465.915,68.937c-3.827-2.828-8.769-3.674-13.317-2.276l-120,36.842c-6.299,1.933-10.598,7.751-10.598,14.339v276.316
						c0,6.588,4.3,12.405,10.598,14.339l120,36.842c4.566,1.402,9.505,0.541,13.317-2.276C469.742,440.235,472,435.759,472,431V81
						C472,76.241,469.742,71.765,465.915,68.937z M442,410.704l-90-27.632V128.928l90-27.632V410.704z"/>
			</svg>
			`,
			title: 'flipY',
			keep: false,
			callback: () => {
				this.flip.y = -this.flip.y
				this.setTransform()
			}
		})
		this.resetButton	= this.createButton({
			icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path></svg>',
			title: 'reset',
			keep: false,
			callback: () => {
				this.reset()
				this.setTransform()
				
			}
		})

		menu.appendChild(this.moveButton)
		menu.appendChild(this.cropperButton)
		menu.appendChild(this.createSeparator)
		// menu.appendChild(this.zoomIn)
		// menu.appendChild(this.zoomOut)
		menu.appendChild(this.createZoom)
		menu.appendChild(this.createSeparator)
		menu.appendChild(this.rotateLeftButton)
		menu.appendChild(this.rotateRightButton)
		menu.appendChild(this.flipXButton)
		menu.appendChild(this.flipYButton)
		menu.appendChild(this.createSeparator)
		menu.appendChild(this.resetButton)
		return menu
	}

	get createZoom() {
		
		let active = false
		const zoom = document.createElement('input')
		const attrs = {
			'type' : 'range',
			'min' : this.setRange.min,
			'max' : this.setRange.max,
			'value' : 0,
			'step' : this.setRange.step,
			'id' : 'rangeZoom',
			'name' : 'rangeZoom'
		}
		for(let attr in attrs) {
			zoom.setAttribute(attr, attrs[attr])
		}
		zoom.className= "mc-input-range"

		const setScale = () => {
			this.scale = {
				x : zoom.value,
				y : zoom.value
			}
			
			this.center = {
				x : -((this.sizeOrigin.w * this.scale.x) / 2) + this.sizeOrigin.w/2 ,
				y : -((this.sizeOrigin.h * this.scale.y) / 2) + this.sizeOrigin.h/2
			}
		}

		zoom.addEventListener('mousedown', (e) => {
			active = true
			this.centerOld = {
				x : -((this.sizeOrigin.w * this.scale.x) / 2) + this.sizeOrigin.w/2 ,
				y : -((this.sizeOrigin.h * this.scale.y) / 2) + this.sizeOrigin.h/2
			}
		})
		zoom.addEventListener('mousemove', (e) => {
			if(active) {
				setScale()
			}
			this.setTransform()
		})
		zoom.addEventListener('mouseup', (e) => {
			active = false
			this.centerOld = this.center

			return false
		})
		zoom.addEventListener('change', (e) => {
			setScale() 
			this.setTransform()
		})
		return zoom
	}

	set createZoom(value) {
		const zoom = document.querySelector('.mc-input-range')
		zoom.value = value
	}

	get getZoom() {
		return document.querySelector('.mc-input-range')
	}

	get createSeparator() {
		const sep = document.createElement('span')
		sep.className='mc-separator'
		return sep
	}

	createButton(opts) {
		const button = document.createElement('button')
		button.className="mc-menu-btn btn-"+ opts.title
		button.innerHTML = opts.icon
		button.addEventListener('click', function(e) {
			if(opts.keep) {
				document.querySelectorAll('.mc-menu-btn').forEach(el => {
					if(el.classList.contains('active')) {
						el.classList.remove('active')
					}
				});
				this.classList.add('active')
			}
			opts.callback()
		})

		return button
	}

	createContent() {
		const content = document.createElement('div')
		content.className = 'mc-content'
		
		content.appendChild(this.createMenu())
		content.appendChild(this.cropper)

		return content
	}

	createCropper() {
		this.cropper = document.createElement('div')
		this.cropper.className="mc-cropper-box"

		this.cropperCanvas.className="mc-cropper-canvas"
		
		this.cropperCanvas.style.setProperty('width', this.getImage().width/2+'px', '')
		this.cropperCanvas.style.setProperty('height', this.getImage().height/2+'px', '')
		this.cropperCanvas.addEventListener('wheel', (e) => {
			let zoom = Number(this.getZoom.value)
			this.wheelZoom(e, zoom)
		}, {
			capture: false,
			passive: false
		})

		const center = document.createElement('span')
		center.className="mc-cropper-center"

		this.cropperCanvas.append(center)

		this.cropper.appendChild(this.cropperCanvas)
		this.createCropping()
		
		//this.createCanvas(this.content.getBoundingClientRect().width,100)
		//cropper.appendChild(this.canvas)
		// return cropper
	}

	wheelZoom(e, zoom) {
		const delta = e.deltaY
		
		if(delta < 0) {
			zoom >= this.setRange.max? zoom = 10 : zoom += this.setRange.step*4
		}
		if(delta > 0) {
			
			zoom <= this.setRange.min? zoom = 1 : zoom -= this.setRange.step*4
		}
		
		this.scale = {
			x : zoom,
			y : zoom
		}
		
		this.center = {
			x: -((this.sizeOrigin.w * this.scale.x) / 2) + this.sizeOrigin.w/2,
			y: -((this.sizeOrigin.h * this.scale.y) / 2) + this.sizeOrigin.h/2
		}

		this.setTransform()
		this.getZoom.value = zoom
	}

	move(el, active = false) {
		//! enclencher la variable active
		if (!active) {
			return
		}
		this.cropperCanvas.classList.add("c-grab")
		let hold = false

		this.setTransform()
		this.cropperCanvas.addEventListener('mousedown', (e) => {
			this.cropperCanvas.classList.remove("c-grab")
			this.cropperCanvas.classList.add("c-grabbing")
			hold = true
			this.translateCanvasOld = {
				x : e.clientX - this.translateCanvas.x,
				y: e.clientY - this.translateCanvas.y
			}
			this.setTransform()
		})
		this.cropperCanvas.addEventListener('mousemove', (e) => {
			if (hold) {
				this.cropperCanvas.classList.add("c-grabbing")
				console.log(
					this.center.x,
					this.translateCanvas.x,
					this.center.x + this.translateCanvas.x
				)

				this.translateCanvas = {
					x : e.clientX - this.translateCanvasOld.x,
					y : e.clientY - this.translateCanvasOld.y
				}
				this.setTransform()
			}
		})
		this.cropperCanvas.addEventListener('mouseup', () => {
			this.cropperCanvas.classList.remove("c-grabbing")
			this.cropperCanvas.classList.add("c-grab")
			this.setTransform()
			hold = false
		})
	}
	
	createCanvas(w, h) {
		this.canvas = document.createElement('canvas')
		this.canvas.width = w
		this.canvas.height = h
		this.ctx = this.canvas.getContext('2d')
	}

	createCropping() {
		this.box = document.createElement('div')
		this.box.className = "mc-cropper-dragBox"

		this.cropper.appendChild(this.box)
	}

	resize(size) {

	}

	filter() {

	}

	setTransform() {
		let width = `width: ${(this.sizeOrigin.w) * this.scale.x}px;`
		let height = `height: ${(this.sizeOrigin.h) * this.scale.y}px;`

		// this.translateCanvas = {
		// 	x : (this.sizeOrigin.w * this.scale.x) === this.sizeOrigin.w ? 0 : -(((this.sizeOrigin.w) * this.scale.x) / 2) + this.sizeOrigin.w/2,
		// 	y: (this.sizeOrigin.h * this.scale.y) === this.sizeOrigin.h ? 0 : -(((this.sizeOrigin.h) * this.scale.y) / 2) + this.sizeOrigin.h/2
		// }
		// this.translateCanvas = {
		// 	x : -(((this.sizeOrigin.w) * this.scale.x) / 2) + this.sizeOrigin.w/2,
		// 	y: -(((this.sizeOrigin.h) * this.scale.y) / 2) + this.sizeOrigin.h/2
		// }

		let position = `transform: translate3d(
			${this.translateCanvas.x + this.center.x}px, 
			${this.translateCanvas.y + this.center.y}px, 
			0);`

		this.cropperCanvas.style = width + height + position + 'transform-origin: center center;'

		/***********************************/
		/***********************************/
		/***********************************/

		let translate = `translate3d(${this.translate.x}px,${this.translate.y}px, 0)`
		let flip = ` scale(${this.flip.x}, ${this.flip.y})`
		let rotation = ` rotate(${this.rotation}deg)`
		
		let transform = `transform:`
			transform += translate + flip + rotation
			transform += ';'
		
		this.img.style = width + height + transform + 'transform-origin: center;'
	}

	reset() {
		this.flip = this.scale = {
			x : 1,
			y : 1
		}
		this.center = this.centerOld = {
			x : -((this.sizeOrigin.w * this.scale.x) / 2) + this.sizeOrigin.w/2 ,
			y : -((this.sizeOrigin.h * this.scale.y) / 2) + this.sizeOrigin.h/2 
		}

		this.translateCanvas = this.translateCanvasOld = {
			x : 0,
			y : 0
		}

		this.rotation = 0
		this.createZoom = 1
	}

	save() {

	}

	btoa(element) {
		console.log(window.btoa(element));
		return window.btoa(element);
	}

	getImage(url64 = null) {
		if(url64 == null) {
			url64 = 'data:image/jpeg;base64,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AAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADNwAAAAYAAAAAAAAAAAAAAeAAAALQAAAAAQA4AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAALQAAAB4AAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAB4AAAAABSZ2h0bG9uZwAAAtAAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAeAAAAAAUmdodGxvbmcAAALQAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAAAAEAAAAAAA5jZWxsVGV4dElzSFRNTGJvb2wBAAAA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AAAABwAEAQEAAQEA/+EM2Wh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iQ0Q3MUU3MzM0NUJDQzlBNjNCOEM3MkRCNjgyMjdDNUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzMwMGVlNDktNjg2ZS05NjQxLTgzM2MtOGZhNzY5ODM3MmYxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkNENzFFNzMzNDVCQ0M5QTYzQjhDNzJEQjY4MjI3QzVGIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSIiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA1LTE3VDExOjUwOjE5KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wNS0xOVQxNjozMToyNCswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wNS0xOVQxNjozMToyNCswMjowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMzMDBlZTQ5LTY4NmUtOTY0MS04MzNjLThmYTc2OTgzNzJmMSIgc3RFdnQ6d2hlbj0iMjAyMS0wNS0xOVQxNjozMToyNCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4AIUFkb2JlAGQAAAAAAQMAEAMCAwYAAAAAAAAAAAAAAAD/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBBwcHDQwNGBAQGBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/CABEIAeAC0AMBEQACEQEDEQH/xADSAAABBQEBAQEAAAAAAAAAAAAAAQIDBAUGBwgJAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUGEAABBAEDAwQBAwQCAgMBAQABABECAwQQEgUgIQYwMRMHQCIyFEEjMxUkCFAXQjQWJSYRAAED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'
		}
		
		const img = new Image()
		img.onload = () => {
			this.cropper.style.setProperty('width', `${img.width/2}px`, '')
			this.cropper.style.setProperty('height', `${img.height/2}px`, '')
			this.cropperCanvas.appendChild(this.img)
		}
		img.ondragstart = function() { return false; };
		img.src= url64
		return img
	}
}

export default Crop