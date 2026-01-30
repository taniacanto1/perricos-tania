// 1. IMPORTACIONES (CORREGIDAS a una versión que funciona: 10.11.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// 2. TUS CREDENCIALES
const firebaseConfig = {
    apiKey: "AIzaSyAH10P2uxv16W5JB2OoyDpyXF1Vd8r3-kE",
    authDomain: "dog-match-37798.firebaseapp.com",
    projectId: "dog-match-37798",
    storageBucket: "dog-match-37798.firebasestorage.app",
    messagingSenderId: "353912658243",
    appId: "1:353912658243:web:396d29971cd0bd78d437f6",
    measurementId: "G-DDX29C0R4Y"
};

// 3. INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 Firebase inicializado correctamente");

// 4. FUNCIONES DEL MODAL
function openModal(mode) {
    console.log("📂 Abriendo modal en modo:", mode);
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginFormContainer');
    const signupForm = document.getElementById('signupFormContainer');
    
    if (!modal) {
        console.error("❌ Modal no encontrado");
        return;
    }
    
    // Mostrar el modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Forzar reflow para que la transición funcione
    modal.offsetHeight;
    
    // Activar el modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Mostrar el formulario correcto
    if (mode === 'signup') {
        loginForm?.classList.add('hidden');
        signupForm?.classList.remove('hidden');
    } else {
        loginForm?.classList.remove('hidden');
        signupForm?.classList.add('hidden');
    }
    
    console.log("✅ Modal abierto exitosamente");
}

function closeModal() {
    console.log("🚪 Cerrando modal");
    const modal = document.getElementById('authModal');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }, 300);
}

// 5. ESPERAR A QUE EL DOM CARGUE
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM Cargado - Iniciando setup");
    
    // A. Buscar elementos
    const modal = document.getElementById('authModal');
    const loginBtn = document.querySelector('.nav-button-login');
    const signUpBtn = document.querySelector('.nav-button-sign-up');
    const closeBtn = document.querySelector('.close-modal');
    const logoutBtn = document.getElementById('btnLogout');
    
    console.log("🔍 Elementos encontrados:");
    console.log("  - Modal:", modal ? "✅" : "❌");
    console.log("  - Botón Login:", loginBtn ? "✅" : "❌");
    console.log("  - Botón Sign Up:", signUpBtn ? "✅" : "❌");
    console.log("  - Botón Cerrar:", closeBtn ? "✅" : "❌");
    
    // B. Conectar botón Login
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            console.log("🖱️ Click en botón Login");
            e.preventDefault();
            e.stopPropagation();
            openModal('login');
        });
        console.log("✅ Event listener añadido a botón Login");
    } else {
        console.error("❌ No se encontró el botón Login");
    }
    
    // C. Conectar botón Sign Up
    if (signUpBtn) {
        signUpBtn.addEventListener('click', (e) => {
            console.log("🖱️ Click en botón Sign Up");
            e.preventDefault();
            e.stopPropagation();
            
            // Si el botón dice "Ir a mi Perfil", redirige
            if(signUpBtn.innerText.includes('Perfil')) {
                console.log("🔄 Redirigiendo al perfil");
                window.location.href = 'profile.html';
            } else {
                openModal('signup');
            }
        });
        console.log("✅ Event listener añadido a botón Sign Up");
    } else {
        console.error("❌ No se encontró el botón Sign Up");
    }
    
    // D. Conectar botón cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            console.log("🖱️ Click en botón cerrar");
            e.preventDefault();
            closeModal();
        });
        console.log("✅ Event listener añadido a botón cerrar");
    }
    
    // E. Cerrar al hacer click fuera del modal
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log("🖱️ Click fuera del modal");
                closeModal();
            }
        });
        console.log("✅ Event listener añadido para cerrar al click fuera");
    }
    
    // F. Enlaces de cambio entre login y signup
    const linkToSignup = document.getElementById('showSignUp');
    const linkToLogin = document.getElementById('showLogin');
    
    if (linkToSignup) {
        linkToSignup.addEventListener('click', () => {
            console.log("🖱️ Click en 'Regístrate aquí'");
            openModal('signup');
        });
        console.log("✅ Event listener añadido a link 'Regístrate'");
    }
    
    if (linkToLogin) {
        linkToLogin.addEventListener('click', () => {
            console.log("🖱️ Click en 'Inicia sesión'");
            openModal('login');
        });
        console.log("✅ Event listener añadido a link 'Inicia sesión'");
    }
    
    // G. FORMULARIO DE REGISTRO
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("📝 Enviando formulario de registro");
            
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            console.log("📧 Email:", email);
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("✅ Cuenta creada:", userCredential.user.email);
                alert("¡Cuenta creada! Redirigiendo...");
                closeModal();
                window.location.href = "profile.html";
            } catch (error) {
                console.error("❌ Error al crear cuenta:", error);
                let mensaje = "Error al crear cuenta.";
                if (error.code === 'auth/email-already-in-use') mensaje = "Ese correo ya está registrado.";
                if (error.code === 'auth/weak-password') mensaje = "La contraseña es muy débil (mínimo 6 caracteres).";
                if (error.code === 'auth/invalid-email') mensaje = "El correo electrónico no es válido.";
                alert(mensaje);
            }
        });
        console.log("✅ Event listener añadido a formulario de registro");
    }
    
    // H. FORMULARIO DE LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("📝 Enviando formulario de login");
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log("📧 Email:", email);
            
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("✅ Login exitoso:", userCredential.user.email);
                closeModal();
                window.location.href = "profile.html";
            } catch (error) {
                console.error("❌ Error al iniciar sesión:", error);
                let mensaje = "Correo o contraseña incorrectos.";
                if (error.code === 'auth/user-not-found') mensaje = "No existe una cuenta con ese correo.";
                if (error.code === 'auth/wrong-password') mensaje = "Contraseña incorrecta.";
                if (error.code === 'auth/invalid-email') mensaje = "El correo electrónico no es válido.";
                alert(mensaje);
            }
        });
        console.log("✅ Event listener añadido a formulario de login");
    }
    
    // I. LOGOUT
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("🚪 Cerrando sesión");
            signOut(auth).then(() => {
                console.log("✅ Sesión cerrada");
                window.location.href = "index.html";
            });
        });
        console.log("✅ Event listener añadido a botón logout");
    }
    
    console.log("🎉 Setup completado");
});

// 6. OBSERVADOR DE ESTADO
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    
    if (user) {
        console.log("👤 Usuario autenticado:", user.email);
        
        // Si estamos en profile.html, mostrar el email
        const emailDisplay = document.getElementById('userEmailDisplay');
        if (emailDisplay) {
            emailDisplay.innerText = user.email;
        }
        
        // Cambiar botones en index.html o perros.html
        const loginBtn = document.querySelector('.nav-button-login');
        const signUpBtn = document.querySelector('.nav-button-sign-up');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (signUpBtn) signUpBtn.innerText = 'Ir a mi Perfil';
        
    } else {
        console.log("👤 No hay usuario autenticado");
        
        // Protección: Si intenta entrar a profile.html sin login
        if (currentPath.includes('profile.html')) {
            console.log("🚫 Acceso denegado - Redirigiendo a index");
            window.location.href = "index.html";
        }
        
        // Restaurar botones
        const loginBtn = document.querySelector('.nav-button-login');
        const signUpBtn = document.querySelector('.nav-button-sign-up');
        
        if (loginBtn) loginBtn.style.display = 'block';
        if (signUpBtn) signUpBtn.innerText = 'Sign Up';
    }
});