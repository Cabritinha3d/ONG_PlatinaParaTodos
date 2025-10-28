// js/app.js
class PlatinaApp {
    constructor() {
        this.router = new Router();
        this.initializeApp();
    }

    initializeApp() {
        this.setupRouter();
        this.initializeComponents();
        this.setupServiceWorker();
        
        // Inicia a rota atual
        this.router.navigate(window.location.pathname || '/', false);
    }

    setupRouter() {
        // Define as rotas da aplicação
        this.router.addRoute('/', '/home.html');
        this.router.addRoute('/mentoria', '/mentoria.html');
        this.router.addRoute('/grupos', '/grupos.html');
        this.router.addRoute('/guias', '/guias.html');
        this.router.addRoute('/eventos', '/eventos.html');
        this.router.addRoute('/discord', '/discord.html');
        this.router.addRoute('/doacao', '/doacao.html');
        this.router.addRoute('/cadastro', '/cadastro.html');
        this.router.addRoute('/obrigado', '/obrigado.html');
        this.router.addRoute('/404', '/404.html');

        // Torna o router globalmente acessível
        window.router = this.router;
    }

    initializeComponents() {
        // Inicializa validação de formulários
        if (typeof FormValidator !== 'undefined') {
            FormValidator.initialize();
        }

        // Inicializa sistema de templates
        if (typeof TemplateManager !== 'undefined') {
            window.TemplateManager = TemplateManager;
        }

        // Configura outros componentes
        this.setupGlobalEventListeners();
    }

    setupGlobalEventListeners() {
        // Menu mobile toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mobile-menu-toggle')) {
                this.toggleMobileMenu();
            }
        });

        // Modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal-open]')) {
                this.openModal(e.target.dataset.modalOpen);
            }
            if (e.target.matches('[data-modal-close]') || e.target.matches('.modal-overlay')) {
                this.closeModal();
            }
        });

        // Back to top
        document.addEventListener('scroll', this.throttle(this.handleScroll, 100));
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav-main');
        nav.classList.toggle('mobile-open');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    handleScroll() {
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PlatinaApp();
});
