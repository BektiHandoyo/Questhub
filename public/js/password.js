const tooglePassword = document.getElementById('togglePassword');

tooglePassword.addEventListener('click', () => {
    const password = document.getElementById('password');
    const konfirmasi = document.getElementById('password-confirmation') || {};
    
    if(password.type == 'password'){
        password.type = 'text';
        konfirmasi.type = 'text';
    } else {
        password.type = 'password';
        konfirmasi.type = 'password';
    }
    if(tooglePassword.classList.contains("fa-eye-slash")){
        tooglePassword.classList.remove("fa-eye-slash");
        tooglePassword.classList.add("fa-eye");
    } else {
        tooglePassword.classList.remove("fa-eye");
        tooglePassword.classList.add("fa-eye-slash");
    };
})