function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function copyStreamUrl(el, url) {
    copyToClipboard(url);
    el.classList.remove('btn-secondary');
    el.classList.add('btn-success');
    el.innerHTML = '&check; ' + el.innerHTML;
}