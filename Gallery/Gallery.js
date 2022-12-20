const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';

class Gallery {
    constructor(element, options = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;
        this.currentSlideWasChanged = false

        this.manageHTML = this.manageHTML.bind(this);
        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this)

        //wraps slide
        this.manageHTML();
        // setting inline css style.
        this.setParameters();
        //set the events
        this.setEvents()


    }

    manageHTML() {
        this.containerNode.classList.add(GalleryClassName);

        this.containerNode.innerHTML = `
            <div class='${GalleryLineClassName}'>
                ${this.containerNode.innerHTML}
            </div>
        `;
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`);
        
        this.slideNode = Array.from(this.lineNode.children).map(node => {
            return wrapElementByDiv({
                el: node,
                className: GallerySlideClassName
            })
        })


    }

    setParameters(){
        const coordsContiner = this.containerNode.getBoundingClientRect();
        this.width = coordsContiner.width;
        this.lineNode.style.width = `${this.size * this.width}px`;
        this.x = -this.currentSlide * this.width;

        Array.from(this.slideNode).forEach(node => {
            node.style.width = `${this.width}px`
        })
        
    }

    setEvents(){
        this.debounceResizeGallery = debounce(this.resizeGallery);
        window.addEventListener('resize',this.debounceResizeGallery);
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
    }

    destrouEvents(){
        window.removeEventListener('resize', this.debounceResizeGallery);
        window.removeEventListener('pointerup', this.stopDrag)
    }

    resizeGallery(){
        this.setParameters();
    }

    startDrag(event){
        this.currentSlideWasChanged = false;
        this.clickX = event.pageX;
        this.startX = this.x;
        window.addEventListener('pointermove', this.dragging);
    }

    stopDrag(){
        window.removeEventListener('pointermove', this.dragging);
    }

    dragging(event){
        this.dragX = event.pageX;
        const dragShift = this.dragX - this.clickX;
        this.x = this.startX + dragShift;
        this.setStylePosition()

        //change active slide
        
        if(
            dragShift > 20 &&
            dragShift > 0 && 
            !this.currentSlideWasChanged &&
            this.currentSlide > 0
        ){
            this.currentSlideWasChanged = true;
            console.log("двигаю вправо")
        }

        if(
            dragShift < -20 &&
            dragShift > 0 && 
            !this.currentSlideWasChanged &&
            this.currentSlide < this.size - 1
        ){
            this.currentSlideWasChanged = true;
            console.log("двигаю вправо")
        }
    }

    setStylePosition(){
        this.lineNode.style.transform = `translate3d(${this.x}px, 0px, 0px)`
    }
}

//helpers
function wrapElementByDiv({el, className}){
    const div = document.createElement('div');
    div.classList.add(className);

    el.parentNode.insertBefore(div, el);
    div.appendChild(el)

    return div;
}

function debounce(fn,time = 100){
    let timer;
    return function(event){
        clearTimeout(timer);
        setTimeout(fn,time,event)
    }
}
