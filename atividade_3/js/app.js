// js/app.js
class PlatinaApp {
    constructor() {
        this.router = new Router();
        this.initializeApp();
    }

    initializeApp() {
        this.setupRouter();
        this.initializeComponents();
        // Removido setupServiceWorker() pois não temos sw.js
        this.setupNavigation();
        
        // Inicia a rota atual - usando hash-based routing
        const initialRoute = window.location.hash.replace('#', '') || 'home';
        this.router.navigate(initialRoute, false);
    }

    setupRouter() {
        // Define as rotas da aplicação (hash-based)
        this.router.addRoute('home', 'home.html');
        this.router.addRoute('projetos', 'projetos.html');
        this.router.addRoute('cadastro', 'cadastro.html');
        this.router.addRoute('grupos', 'grupos.html');
        this.router.addRoute('guias', 'guias.html');
        this.router.addRoute('eventos', 'eventos.html');
        this.router.addRoute('discord', 'discord.html');
        this.router.addRoute('doacao', 'doacao.html');
        this.router.addRoute('formobrigado', 'formobrigado.html');
        this.router.addRoute('404', '404.html');

        // Torna o router globalmente acessível
        window.router = this.router;
    }

    setupNavigation() {
        // Configura navegação SPA para links com data-route
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.router.navigate(route);
            }
        });

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const route = window.location.hash.replace('#', '') || 'home';
            this.router.navigate(route, false);
        });
    }

    initializeComponents() {
        // Inicializa validação de formulários
        if (typeof FormValidator !== 'undefined') {
            FormValidator.initialize();
        }

        // Configura outros componentes
        this.setupGlobalEventListeners();
        
        console.log('PlatinaApp inicializado com sucesso!');
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
        window.addEventListener('scroll', this.throttle(this.handleScroll, 100));
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav-main');
        if (nav) {
            nav.classList.toggle('mobile-open');
        }
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
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
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

    // Método para mostrar loading
    showLoading() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<div class="loading">Carregando...</div>';
        }
    }

    // Método para mostrar erro
    showError(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <section class="section section-light">
                    <div class="container" style="text-align: center; padding: 40px;">
                        <h2 style="color: var(--accent-red);">Erro</h2>
                        <p>${message}</p>
                        <a href="#home" class="btn btn-primary" data-route="home">Voltar para Home</a>
                    </div>
                </section>
            `;
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new PlatinaApp();
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
        // Fallback básico se a SPA falhar
        document.getElementById('main-content').innerHTML = `
            <section class="section section-light">
                <div class="container" style="text-align: center; padding: 40px;">
                    <h2 style="color: var(--accent-red);">Erro na Aplicação</h2>
                    <p>Houve um problema ao carregar a aplicação. Recarregue a página.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">Recarregar</button>
                </div>
            </section>
        `;
    }
});

// Adiciona fallback para navegação tradicional se JavaScript falhar
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.setAttribute('href', link.getAttribute('href').replace('#', ''));
    });
});
