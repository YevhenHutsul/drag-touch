const GalleryClassName = 'gallery';
const GalleryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';

class Gallery {
    constructor(element, options = {}) {
        this.containerNode = element;
        this.size = element.childElementCount;
        this.currentSlide = 0;

        this.manageHTML = this.manageHTML.bind(this);
        this.setParams = this.setParams.bind(this);

        this.manageHTML();
        this.setParams();


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

    setParams(){
        const coordsContiner = this.containerNode.getBoundingClientRect();
        this.width = coordsContiner.width;
        //this.lineNode.style.width = `'${this.size * this.width}px'`
        console.log(this.size)
        this.lineNode.style.width = this.width * this.size + 'px';
        
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
