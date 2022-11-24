const pages =
[
    {
        name: 'home',
        path: '/',
        index: './home/'
    },
    {
        name: 'kamehameha',
        index: './animations/kamehameha/'
    }
];

const currentState =
{
    get path()
    {
        return '/' + location.hash.slice(2);
    },
    get page()
    {
        return pages.filter(p =>
        {
            const pagePath = p.path ?? `/${p.name}`;

            return pagePath === this.path;
        })[0];
    }
}

function navigate(path)
{
    history.pushState(null, null, '.' + path);
    pathUpdate();
}

window.addEventListener('popstate', e =>
{
    pathUpdate();
});

pathUpdate();

async function load()
{
}

async function pathUpdate()
{
    const path = currentState.path;

    console.log({ path });

    const pageHtml = await (await fetch(getPageIndex())).text();

    const domParser = new DOMParser();
    
    const pageDocument = domParser.parseFromString(pageHtml, 'text/html');
    
    loadPage(pageDocument);
}

/**
 * @param {Document} doc 
 */
function loadPage(doc)
{
    document.title = doc.title ? doc.title + ' - CSS Animations' : 'CSS Animations';

    const pageStyleLink = doc.querySelector('head link[rel="stylesheet"]');
    pageStyleLink.setAttribute('href', `./pages/${currentState.page.index}/index.css`)
    document.head.querySelector('link[rel="stylesheet"]:last-of-type').insertAdjacentElement('afterend', pageStyleLink);

    const scripts = doc.querySelectorAll('head script');
    scripts.forEach(script =>
    {
        // if(script.src)
        // {
        //     const src = `./pages${(new URL(script.src)).pathname}`;
        //     console.log(script.src, src);
        // }
        // console.log(script.textContent);
        document.head.querySelector('script:last-of-type').insertAdjacentElement('afterend', script);
    });

    const main = document.querySelector('main');

    main.innerHTML = doc.body.innerHTML;

}

function getPageIndex()
{
    return `./pages/${currentState.page.index}index.html`;
}

window.addEventListener('DOMContentLoaded', load);