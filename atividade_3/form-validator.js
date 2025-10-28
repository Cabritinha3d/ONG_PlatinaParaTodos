// js/form-validator.js
class FormValidator {
    static initialize() {
        this.setupFormValidation();
        this.setupRealTimeValidation();
    }

    static initializeForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            this.setupFormListeners(form);
        }
    }

    static setupFormValidation() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-validate]')) {
                e.preventDefault();
                this.validateForm(e.target);
            }
        });
    }

    static setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validateField(e.target);
            }
        });
    }

    static setupFormListeners(form) {
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            field.addEventListener('input', () => this.validateField(field));
            field.addEventListener('blur', () => this.validateField(field));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm(form);
        });
    }

    static validateField(field) {
        const value = field.value.trim();
        const rules = field.getAttribute('data-validate').split(' ');
        const errors = [];

        rules.forEach(rule => {
            switch (rule) {
                case 'required':
                    if (!value) errors.push('Este campo é obrigatório');
                    break;
                case 'email':
                    if (value && !this.isValidEmail(value)) {
                        errors.push('Email inválido');
                    }
                    break;
                case 'min-length-3':
                    if (value && value.length < 3) {
                        errors.push('Mínimo 3 caracteres');
                    }
                    break;
                case 'min-length-10':
                    if (value && value.length < 10) {
                        errors.push('Mínimo 10 caracteres');
                    }
                    break;
                case 'phone':
                    if (value && !this.isValidPhone(value)) {
                        errors.push('Telefone inválido');
                    }
                    break;
            }
        });

        this.displayFieldErrors(field, errors);
        return errors.length === 0;
    }

    static validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                field.focus();
            }
        });

        if (isValid) {
            this.showSuccessMessage(form);
            this.submitForm(form);
        } else {
            this.showErrorMessage('Por favor, corrija os erros destacados.');
        }

        return isValid;
    }

    static displayFieldErrors(field, errors) {
        // Remove mensagens anteriores
        this.removeFieldErrors(field);

        if (errors.length > 0) {
            field.classList.add('error');
            field.classList.remove('success');

            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            errorContainer.innerHTML = errors.join('<br>');
            
            field.parentNode.appendChild(errorContainer);
        } else {
            field.classList.remove('error');
            field.classList.add('success');
        }
    }

    static removeFieldErrors(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^[\d\s\(\)\-]+$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>✅ Sucesso!</strong> Formulário enviado com sucesso!
            </div>
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    static showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-global';
        errorDiv.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>❌ Erro!</strong> ${message}
            </div>
        `;
        
        document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    static async submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simula envio para API
        try {
            // Aqui viria a chamada real para sua API
            await this.simulateAPICall(data);
            
            // Salva no Local Storage
            this.saveToLocalStorage(form.id, data);
            
            // Redireciona ou mostra confirmação
            if (form.id === 'mentoria-form') {
                window.router.navigate('/obrigado');
            }
            
        } catch (error) {
            this.showErrorMessage('Erro ao enviar formulário. Tente novamente.');
        }
    }

    static simulateAPICall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados enviados:', data);
                resolve({ success: true });
            }, 2000);
        });
    }

    static saveToLocalStorage(formId, data) {
        const submissions = JSON.parse(localStorage.getItem(formId) || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem(formId, JSON.stringify(submissions));
    }
}
