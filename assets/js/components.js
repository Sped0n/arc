let pby = document.getElementById("poweredBy");
let hif = document.getElementById("hideInfo");

function hoverAnimationInit() {
    pby.addEventListener(
        "mouseover",
        function () {
            pby.style.transitionDelay = "0.3s";
            hif.style.transitionDelay = "0s";
            pby.style.opacity = "1";
            hif.style.opacity = "0";
        },
        {passive: true}
    );
    pby.addEventListener(
        "mouseout",
        function () {
            pby.style.transitionDelay = "0s";
            hif.style.transitionDelay = "0.3s";
            pby.style.opacity = "0";
            hif.style.opacity = "1";
        },
        {passive: true}
    );
}


async function fetchWithTimeout(resource, options = {}) {
    const {timeout = 8000} = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

async function loadMetric() {
    try {
        const response = await fetchWithTimeout('https://api.sped0nwen.com/arc_metric', {
            timeout: 5000
        });
        return await response.json()
    } catch (error) {
        console.log(error.name === 'AbortError');
        return {"pageviews": "N/A"}
    }
}

let counterContainer = document.querySelector(".website-counter");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function load_animation(json) {
    hif.style.transitionDelay = "0s";
    hif.style.opacity = "0"
    await sleep(300);
    counterContainer.innerHTML = json.pageviews;
    hif.style.opacity = "1"
    await sleep(300);
    hif.style.transitionDelay = "0.3s";
}


counterContainer.innerHTML = "...";
loadMetric().then(function (json) {
    load_animation(json).then(function () {
        hoverAnimationInit()
    })
})