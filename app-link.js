customElements.define('app-link', class AppLink extends HTMLElement
{
    #a;

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        
    }
    
    connectedCallback()
    {
        const href = this.getAttribute('href') || '#';

        this.shadowRoot.innerHTML = `
            <style>
                a
                {
                    all: inherit;
                    pointer-events: none !important;
                }
            </style>
            <a href="${href}">
                <slot style="pointer-events: none;"></slot>
            </a>
        `;

        this.#a = this.shadowRoot.querySelector('a');

        this.addEventListener('click', () => this.#a.click());


        this.#a.addEventListener('click', e =>
        {
            e.preventDefault();

            const href = e.target.getAttribute('href');

            const path = href === '/' ? '/' : `#${href}`;

            navigate(path);
        });
    }

    static get observedAttributes()
    {
        return ['href'];
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        if(name === 'href' && oldValue !== newValue)
        {
            if(!this.#a) return;

            this.#a.setAttribute('href', newValue);
        }
    }
});