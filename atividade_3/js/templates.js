// js/templates.js
class TemplateManager {
    static async render(templateName, data = {}) {
        try {
            const response = await fetch(`templates/${templateName}.html`);
            let html = await response.text();
            
            // Substitui placeholders pelos dados
            html = this.replacePlaceholders(html, data);
            
            return html;
        } catch (error) {
            console.error('Erro ao carregar template:', error);
            return '<div class="error">Erro ao carregar conteúdo</div>';
        }
    }

    static replacePlaceholders(html, data) {
        return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match;
        });
    }

    static createMentorCard(mentor) {
        return `
            <div class="mentor-card" data-mentor-id="${mentor.id}">
                <h3 style="color: ${mentor.color}">${mentor.name}</h3>
                <p class="mentor-bio">${mentor.bio}</p>
                <div class="mentor-stats">
                    <span>🏆 ${mentor.platinas} platinas</span>
                    <span>⏱️ ${mentor.experience}</span>
                </div>
                <button class="btn-select-mentor" data-mentor="${mentor.id}">
                    Selecionar Mentor
                </button>
            </div>
        `;
    }

    static createGameCard(game) {
        return `
            <div class="game-card" data-game="${game.slug}">
                <h4>${game.name}</h4>
                <div class="game-meta">
                    <span class="difficulty difficulty-${game.difficulty}">
                        Dificuldade: ${game.difficulty}/5
                    </span>
                    <span class="time">⏱️ ${game.time}</span>
                </div>
                <p class="game-description">${game.description}</p>
            </div>
        `;
    }
}
