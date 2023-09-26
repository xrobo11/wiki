// TOC 항목 설정

function getNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    return navbar.offsetHeight;;
}

function getTocList() {
    const h1s = document.getElementsByTagName("h1");
    const h2s = document.getElementsByTagName("h2");
    const h3s = document.getElementsByTagName("h3");
    const h4s = document.getElementsByTagName("h4");
    const hAll = [
        ...h1s,
        ...h2s,
        ...h3s,
        ...h4s,
    ];

    hAll.sort((a, b) => {
        if (a.offsetTop > b.offsetTop) {
            return 1;
        }
        if (a.offsetTop < b.offsetTop) {
            return -1;
        }
        return 0;
    })
    console.log(hAll);

    const toc = document.getElementById("toc");
    for (h of hAll) {
        const newElement = document.createElement("li");
        newElement.classList.add("level-" + h.tagName);
        newElement.innerText = h.innerText;
        toc.appendChild(newElement);
    }
}

function setContentPosition(targetElement) {
    const h1s = document.getElementsByTagName("h1");
    const h2s = document.getElementsByTagName("h2");
    const h3s = document.getElementsByTagName("h3");
    const h4s = document.getElementsByTagName("h4");
    const hAll = [
        ...h1s,
        ...h2s,
        ...h3s,
        ...h4s,
    ];
    for (let h of hAll) {
        if (h.innerText === targetElement.innerText) {
            console.log(targetElement)
            const height = getNavbarHeight();
            window.scrollTo({  top: h.offsetTop, behavior: "smooth" });
            // document.scrollY = h.offsetTop + height;
        }
    }
    
}

getTocList();

window.addEventListener('click', (event) => {
    setContentPosition(event.target);
});






// TOC toggle 설정

function toggleToc() {
    const toc = document.getElementById('toc');
    toc.classList.toggle('active');
    // const contentBody = document.querySelector('.markdown-body');

    if (toc.classList.contains('active')) {
        openToc();
    } else{
        closeToc();
    }
}

function openToc() {
    const toc = document.getElementById('toc');
    if (!toc.classList.contains('active')) {
        toc.classList.toggle('active');
    }
    setTocOpenView();
}

function closeToc() {
    const toc = document.getElementById('toc');
    if (toc.classList.contains('active')) {
        toc.classList.toggle('active');
    }
    setTocCloseView();
}

function setTocOpenView() {
    const toc = document.getElementById('toc');
    const tocWidth = toc.offsetWidth;

    const contentBody = document.querySelector('.markdown-body');
    contentBody.style.left = tocWidth + 'px';
    const contentBodyWidth = (document.documentElement.clientWidth - tocWidth) + 'px';
    contentBody.style.width = contentBodyWidth;
}

function setTocCloseView() {
    const toc = document.getElementById('toc');

    const contentBody = document.querySelector('.markdown-body');
    contentBody.style.left = 0 + 'px';
    const contentBodyWidth = (document.documentElement.clientWidth) + 'px';
    contentBody.style.width = contentBodyWidth;
}

function setTocView() {
    const toc = document.getElementById('toc');
    const contentBody = document.querySelector('.markdown-body');
    
    const height = getNavbarHeight();
    toc.style.top = height + 'px';
    contentBody.style.top = (height + 20) + 'px';

    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 700) {
        openToc();
    } else {
        closeToc();
    }
}

const tocOpenElement = document.getElementById('toc-open');
const tocCloseElement = document.getElementById('toc-close');
tocOpenElement.onclick = toggleToc;
tocCloseElement.onclick = toggleToc;

setTocView();

window.addEventListener('resize', function() {
    setTocView();
});





// Scroll 시 content body 위치 설정

function findTargetElementText(stdElementOffsettop, elements) {
    let clientTopElement = undefined;
    for (let elem of elements) {
        if (elem.offsetTop <= stdElementOffsettop) {
            clientTopElement = elem;
        }
    }
    return clientTopElement ? clientTopElement.innerText : '';
}

function setTocNowView(scrollPos) {
    let text = "";

    const h1s = document.getElementsByTagName("h1");
    if (h1s) {
        const topH1 = findTargetElementText(scrollPos, h1s);
        if (topH1 != "") {
            text += topH1;
        }
    }

    const h2s = document.getElementsByTagName("h2");
    if (h2s) {
        const topH2 = findTargetElementText(scrollPos, h2s);
        if (topH2 != "") {
            text = text + " > " + topH2;
        }
    }

    const h3s = document.getElementsByTagName("h3");
    if (h3s) {
        const topH3 = findTargetElementText(scrollPos, h3s);
        if (topH3 != "") {
            text = text + " > " + topH3;
        }
    }

    const h4s = document.getElementsByTagName("h4");
    if (h4s) {
        const topH4 = findTargetElementText(scrollPos, h4s);
        if (topH4 != "") {
            text = text + " > " + topH4;
        }
    }
    
    const tocNow = document.getElementById("toc-now");
    tocNow.innerText = text;
}



let lastKnownScrollPosition = 0;
let ticking = false;

document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            setTocNowView(lastKnownScrollPosition);
            ticking = false;
        });
    } else {
        ticking = true;
    }
});
