const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide'

class Gallery {
    constructor(element, options = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;
        this.lineNode = '';

        this.manageHTML = this.manageHTML.bind(this);
        this.setParams = this.setParams.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this);


        this.manageHTML();
        this.setParams();
        this.resizeGallery();
        this.setEvents()


    };

    manageHTML() {
        this.containerNode.classList.add(GalleryClassName);

        //Adding class name of inner div
        this.containerNode.innerHTML = `
            <div class='${GalleryLineClassName}'>
                ${this.containerNode.innerHTML}    
            </div>
        `
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`)
        this.slideNodes = Array.from(this.lineNode.children).map((children) => {
            return wrapElementByDiv({
                element: children,
                className: GallerySlideClassName
            })
        })
    }

    setParams(){
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;
        this.x = -this.currentSlide * this.width;

        this.lineNode.style.width = `${this.size * this.width}px`
        
        Array.from(this.slideNodes).forEach(slideNode => {
            slideNode.style.width = `${this.width}px`;
        })
    }


    setEvents(){
        this.debounceRisezeGallery = debounce(this.resizeGallery)
        window.addEventListener('resize', debounce(this.debounceRisezeGallery));
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
    }

    startDrag(){
        window.addEventListener('pointermove', this.dragging);
    }

    stopDrag(evt){
        this.clickX = evt.pageX; 
        
        window.removeEventListener('pointermove', this.dragging);
    }

    dragging(evt){
        this.dragX = evt.pageX;
        const dragShift = this.dragX - this.clickX;

        this.x = dragShift;
        this.setStylePosition()
    }

    setStylePosition(shift){
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)` 
    }

    destroyEvents(){
        window.removeEventListener('resize', this.debounceRisezeGallery);
    }

    resizeGallery(){
        this.setParams();
    }
}
//Helpers
function wrapElementByDiv({ element, className }) {
    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add(className);

    element.parentNode.insertBefore(wrapperNode,element);
    wrapperNode.appendChild(element);


    return wrapperNode;
}

function debounce(fn, time = 100){
    let timer;
    
    return function(event){
        clearTimeout(timer);
        timer = setTimeout(fn, time, event)
    }
}