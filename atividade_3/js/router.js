// js/router.js
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.mainContent = document.getElementById('main-content');
        
        // Configura o listener para links SPA
        this.setupLinkListener();
        
        // Configura o gerenciamento de histórico para hash-based routing
        window.addEventListener('hashchange', () => {
            const route = window.location.hash.replace('#', '') || 'home';
            this.navigate(route, false);
        });
    }

    addRoute(path, template) {
        this.routes[path] = template;
    }

    setupLinkListener() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route, true);
            }
        });
    }

    async navigate(route, addToHistory = true) {
        // Se a rota estiver vazia, usa 'home'
        if (!route || route === '#') {
            route = 'home';
        }

        // Remove # se existir
        route = route.replace('#', '');
        
        if (addToHistory) {
            window.location.hash = route;
        }

        this.currentRoute = route;
        
        // Mostra loading
        this.showLoading();
        
        try {
            // Carrega o template
            await this.loadTemplate(route);
            
            // Atualiza navegação ativa
            this.updateActiveNav();
            
            // Rola para o topo
            window.scrollTo(0, 0);
            
            console.log(`Rota carregada: ${route}`);
            
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            // Tenta carregar página 404
            try {
                await this.loadTemplate('404');
            } catch (e) {
                this.showError('Página não encontrada');
            }
        }
    }

    async loadTemplate(route) {
        // Verifica se a rota existe, senão usa 404
        const templateFile = this.routes[route] || this.routes['404'];
        
        if (!templateFile) {
            throw new Error(`Rota não encontrada: ${route}`);
        }

        const response = await fetch(`pages/${templateFile}`);
        if (!response.ok) {
            throw new Error('Template não encontrado');
        }
        
        const html = await response.text();
        
        // Verifica se o mainContent ainda existe
        if (this.mainContent) {
            this.mainContent.innerHTML = html;
        } else {
            console.error('Elemento main-content não encontrado');
            return;
        }
        
        // Inicializa componentes específicos da página
        this.initializePageComponents();
    }

    showLoading() {
        if (!this.mainContent) return;
        
        this.mainContent.innerHTML = `
            <div class="loading" style="text-align: center; padding: 50px;">
                <div style="font-size: 3em; margin-bottom: 20px;">🎮</div>
                <p>Carregando...</p>
            </div>
        `;
    }

    showError(message) {
        if (!this.mainContent) return;
        
        this.mainContent.innerHTML = `
            <section class="section section-light">
                <div class="container" style="text-align: center; padding: 40px;">
                    <h2 style="color: var(--accent-red);">Erro</h2>
                    <p>${message}</p>
                    <a href="#home" class="btn btn-primary" data-route="home">Voltar para Home</a>
                </div>
            </section>
        `;
    }

    updateActiveNav() {
        // Remove classe active de todos os links
        document.querySelectorAll('[data-route]').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona classe active no link atual
        const currentLink = document.querySelector(`[data-route="${this.currentRoute}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
        
        // Também atualiza links com href que correspondem à rota atual
        document.querySelectorAll(`[href="#${this.currentRoute}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    initializePageComponents() {
        // Inicializa validação de formulários se existirem na página
        if (typeof FormValidator !== 'undefined') {
            FormValidator.initialize();
        }
        
        // Inicializa outros componentes específicos
        this.initializePageSpecificScripts();
        
        // Re-configura event listeners para elementos dinâmicos
        this.setupDynamicEventListeners();
    }

    setupDynamicEventListeners() {
        // Configura listeners para elementos carregados dinamicamente
        const dynamicLinks = this.mainContent.querySelectorAll('[data-route]');
        dynamicLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route, true);
            });
        });
    }

    initializePageSpecificScripts() {
        // Scripts específicos para cada página
        const scripts = {
            'projetos': () => {
                // Inicializa validação do formulário de mentoria
                const form = document.getElementById('mentoria-form');
                if (form && typeof FormValidator !== 'undefined') {
                    FormValidator.initializeForm('mentoria-form');
                }
            },
            'doacao': () => {
                // Inicializa componentes de doação
                this.initializeDonationComponents();
            },
            'cadastro': () => {
                // Inicializa componentes da página de cadastro/mentoria
                this.initializeMentoriaComponents();
            }
        };

        if (scripts[this.currentRoute]) {
            scripts[this.currentRoute]();
        }
    }

    initializeDonationComponents() {
        // Sistema de progresso de doação
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            // Animação do progresso
            setTimeout(() => {
                progressBar.style.width = '75%';
                const progressText = document.querySelector('.progress-bar + p');
                if (progressText) {
                    progressText.innerHTML = '<strong>R$ 1.500</strong> de R$ 2.000 arrecadados (75%)';
                }
            }, 500);
        }
    }

    initializeMentoriaComponents() {
        // Inicializa componentes específicos da página de mentoria
        console.log('Inicializando componentes de mentoria...');
    }

    // Método para obter a rota atual
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Método para verificar se uma rota existe
    routeExists(route) {
        return !!this.routes[route];
    }
}

// Torna o Router globalmente acessível
window.Router = Router;
