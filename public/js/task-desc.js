const dropdown = document.getElementById('desc-dropdown');
    
dropdown.addEventListener('click', (e) => {
    const dropdownState = e.target.classList[1] ;
    const desc = document.getElementById('task-desc');
    const icon = document.getElementById('icon-dropdown')
    if(icon.classList[1] == 'fa-angle-down'){
        icon.classList.remove('fa-angle-down');
        icon.classList.add('fa-angle-up');
        desc.style.display = 'block';
    } else {
        icon.classList.remove('fa-angle-up');
        icon.classList.add('fa-angle-down');
        desc.style.display = 'none';
    }
    // console.log(e.target.classList[1]);
})