document.addEventListener("DOMContentLoaded", function () {
    const t = document.querySelector(".animation-images"),
        e = Array.from(t.querySelectorAll(".animation-images__item")), o = [[], [], []];

    function n(t, e) {
        return Math.floor(Math.random() * (e - t + 1)) + t
    }

    function a(t, e) {
        return (Math.random() * (e - t) + t).toFixed(1)
    }

    for (let t = 0; t < 3; t++) e.forEach((e, r) => {
        const i = e.cloneNode();
        i.style.left = `${n(0, 100)}%`, i.style.animationDelay = `${a(.1, 3)}s`, i.classList.add(`is--group${t + 1}`), o[t].push(i)
    });
    o.forEach(e => {
        e.forEach(e => {
            t.appendChild(e)
        })
    })
});

