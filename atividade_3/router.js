// js/router.js
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.mainContent = document.getElementById('main-content');
        
        // Configura o listener para links
        this.setupLinkListener();
        
        // Configura o gerenciamento de histórico
        window.addEventListener('popstate', (e) => {
            this.navigate(window.location.pathname, false);
        });
    }

    addRoute(path, template) {
        this.routes[path] = template;
    }

    setupLinkListener() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigate(path, true);
            }
        });
    }

    async navigate(path, addToHistory = true) {
        if (addToHistory) {
            history.pushState(null, null, path);
        }

        this.currentRoute = path;
        
        // Mostra loading
        this.showLoading();
        
        try {
            // Carrega o template
            await this.loadTemplate(path);
            
            // Atualiza navegação ativa
            this.updateActiveNav();
            
            // Rola para o topo
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            this.loadTemplate('/404');
        }
    }

    async loadTemplate(path) {
        const templatePath = this.routes[path] || this.routes['/404'];
        
        const response = await fetch(`pages${templatePath}`);
        if (!response.ok) throw new Error('Template não encontrado');
        
        const html = await response.text();
        this.mainContent.innerHTML = html;
        
        // Inicializa componentes específicos da página
        this.initializePageComponents();
    }

    showLoading() {
        this.mainContent.innerHTML = `
            <div class="loading" style="text-align: center; padding: 50px;">
                <div style="font-size: 3em; margin-bottom: 20px;">🎮</div>
                <p>Carregando...</p>
            </div>
        `;
    }

    updateActiveNav() {
        // Remove classe active de todos os links
        document.querySelectorAll('[data-route]').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona classe active no link atual
        const currentLink = document.querySelector(`[data-route][href="${this.currentRoute}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    initializePageComponents() {
        // Inicializa validação de formulários se existirem
        if (typeof FormValidator !== 'undefined') {
            FormValidator.initialize();
        }
        
        // Inicializa outros componentes específicos
        this.initializePageSpecificScripts();
    }

    initializePageSpecificScripts() {
        // Scripts específicos para cada página
        const scripts = {
            '/cadastro': () => {
                // Inicializa validação do formulário de cadastro
                if (typeof FormValidator !== 'undefined') {
                    FormValidator.initializeForm('mentoria-form');
                }
            },
            '/doacao': () => {
                // Inicializa componentes de doação
                this.initializeDonationComponents();
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
            // Simula progresso (em uma aplicação real viria de uma API)
            setTimeout(() => {
                progressBar.style.width = '75%';
                document.querySelector('.progress-text').textContent = 
                    'R$ 1.500 de R$ 2.000 arrecadados (75%)';
            }, 1000);
        }
    }
}
