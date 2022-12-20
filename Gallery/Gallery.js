const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';
const GalleryDotsClassName = 'galerry-dots';
const GalleryDotActiveClassName = 'galerry-dot-active';
const GalleryNavClassName = 'gallery-nav';
const GalleryNavLeftClassName = 'gallery-nav-left';
const GalleryNavRightClassName = 'gallery-nav-right';

class Gallery {
    constructor(element, options = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;
        this.lineNode = '';
        this.currentSlideWasChanged = false;
        this.settings = {
            margin : options.margin || 0,
        }

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
        this.maximumX = -(this.size - 1) * (this.width + this.settings.margin);
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;
        this.x = -this.currentSlide * (this.width + this.settings.margin);
        
        this.lineNode.style.width = `${this.size * (this.width + this.settings.margin)}px`
        
        Array.from(this.slideNodes).forEach(slideNode => {
            slideNode.style.width = `${this.width}px`;
            slideNode.style.marginRight = `${this.settings.margin}px`;
        })
    }


    setEvents(){
        this.debounceRisezeGallery = debounce(this.resizeGallery)
        window.addEventListener('resize', debounce(this.debounceRisezeGallery));
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
    }

    startDrag(evt){
        this.currentSlideWasChanged = false;
        this.clickX = evt.pageX
        this.startX = this.x;
        window.addEventListener('pointermove', this.dragging);
    }

    stopDrag(){ 
        window.removeEventListener('pointermove', this.dragging);
        this.x = -this.currentSlide * (this.width + this.settings.margin);
        this.setStylePosition();
        this.setStyleTransition();
    }

    dragging(evt){
        this.resetStyleTransition();
        this.dragX = evt.pageX;
        const dragShift = this.dragX - this.clickX;
        const easing = dragShift / 5;
        this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
        this.setStylePosition();

        if(
            dragShift > 20 && dragShift > 0 && 
            !this.currentSlideWasChanged && 
            this.currentSlide > 0
        ){
            this.currentSlideWasChanged = true;
            this.currentSlide = this.currentSlide - 1;
        }

        if(
            dragShift < -20 && dragShift < 0 && 
            !this.currentSlideWasChanged &&
            this.currentSlide < this.size - 1
        ){
            this.currentSlideWasChanged = true;
            this.currentSlide = this.currentSlide + 1;
        }
    }

    setStylePosition(){
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)` 
    }

    destroyEvents(){
        window.removeEventListener('resize', this.debounceRisezeGallery);
        this.lineNode.removeEventListener('pointerdown', this.startDrag);
        window.removeEventListener('pointerup', this.stopDrag)
    }

    resizeGallery(){
        this.setParams();
    }

    setStyleTransition(){
        this.lineNode.style.transition = `all 0.25s ease 0s`;
    }

    resetStyleTransition(){
        this.lineNode.style.transition = `all 0s ease 0s`;
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