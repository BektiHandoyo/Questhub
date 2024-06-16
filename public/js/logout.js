const logout = document.getElementById('logout');
const alertBackground = document.getElementById('alert-background');
const no = document.getElementById('no');
const yes = document.getElementById('yes');
logout.addEventListener('click', (e) => {
    const alertBackground = document.getElementById('alert-background');
    alertBackground.style.visibility = "visible";
})

alertBackground.addEventListener('click', (e) => {
    const alertBackground = document.getElementById('alert-background');
    alertBackground.style.visibility = "hidden";
})

no.addEventListener('click', (e) => {
    const alertBackground = document.getElementById('alert-background');
    alertBackground.style.visibility = "hidden";
})

yes.addEventListener('click', async (e) => {
    window.location.href = '/api/logout'
})