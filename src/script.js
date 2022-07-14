import Drag from './class/Drag.js'
import Modal from './class/Modal.js'
import Crop from './class/Crop.js'
//import Alert from './class/Alert.js'

Object.prototype.typeof = function(){
	return Object.prototype.toString.call(this).slice(8, -1).toLowerCase();
};

document.querySelectorAll('drag').forEach(() => {
	const drag = new Drag()
})

const modal = new Modal({
	title: 'Cropper',
	color: '#ffcc00',
	content: new Crop()
})

//const drag = new Drag()
// const alert = new Alert()
// const alert2 = new Alert()