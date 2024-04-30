const ongoingItmes = document.getElementsByClassName('ongoing-items')
const drawerClose = document.getElementById('drawer-close');
const incomingDeadline = document.getElementById('incoming-deadline');

for(let element of ongoingItmes){
    element.onclick = function(e) {
        const drawer = document.getElementById('drawer');
        drawer.style.display = "block";
    };    
};

incomingDeadline.onclick = function(e){
    const drawer = document.getElementById('drawer');
    drawer.style.display = "block";
}

drawerClose.onclick = function(e) {
    const drawer = document.getElementById('drawer');
    drawer.style.display = "none";
};
