const ongoingItmes = document.getElementsByClassName('ongoing-items')
const drawerClose = document.getElementById('drawer-close');
const incomingDeadline = document.getElementById('incoming-deadline');


const showDrawer = (e) => {
    const drawer = document.getElementById('drawer');
    console.log(e.className);
    drawer.style.display = "block";    
}

drawerClose.onclick = function(e) {
    const drawer = document.getElementById('drawer');
    drawer.style.display = "none";
};
