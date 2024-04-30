const angle_down = document.getElementsByClassName('fa-angle-down')
for(let element of angle_down){
    element.addEventListener('click', e => {
        const parentTarget = e.target.parentElement.parentElement.parentElement;
        let descriptionDisplay = parentTarget.childNodes[5]
        if(descriptionDisplay.style.display == "none"){
            descriptionDisplay.style.display = "block"
        } else {
            descriptionDisplay.style.display = "none"
        }
    })
}