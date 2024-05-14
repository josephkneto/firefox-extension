var thirdPartyUrlList = [];
var localStorageData;
var sessionStorageData;
var fingerprint;
var base64;
var secScore = 1000;

function updateScore() {
    if (secScore < 0) secScore = 0;
    document.getElementById("privacy").textContent = "Security Score: " + secScore;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("fingerprint").addEventListener("click", () => {
        let data = document.getElementById("fingerprint-data")
        if (data.style.display === "none" || data.style.display === "") {
            data.style.display = "block";
            data.src = base64
        } else {
            data.style.display = "none";
        }
    })
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("local-storage").addEventListener("click", toggleLocalStorage);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("session-storage").addEventListener("click", toggleSessionStorage);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("thirdparty-urls").addEventListener("click", toggleUrls);
});

function toggleSessionStorage() {
    let list = document.getElementById("session-storage-list");
    if (list.style.display === "none") {
        list.style.display = "block";
        getSessionStorage();
    } else {
        list.style.display = "none";
    }
}

function getSessionStorage() {
    let list = document.getElementById("session-storage-list");
    list.innerHTML = "";
    for (let key in sessionStorageData) {
        let item = document.createElement("li");
        item.textContent = `${key}: ${sessionStorageData[key]}`;
        list.appendChild(item);
    }
}

function toggleLocalStorage() {
    let list = document.getElementById("local-storage-list");
    if (list.style.display === "none") {
        list.style.display = "block";
        getLocalStorage();
    } else {
        list.style.display = "none";
    }
}

function getLocalStorage() {
    let list = document.getElementById("local-storage-list");
    list.innerHTML = "";
    for (let key in localStorageData) {
        let item = document.createElement("li");
        item.textContent = `${key}: ${localStorageData[key]}`;
        list.appendChild(item);
    }
}

function toggleUrls() {
    let list = document.getElementById("thirdparty-urls-list");
    if (list.style.display === "none") {
        list.style.display = "block";
        getUrls();
    } else {
        list.style.display = "none";
    }
}

function getUrls() {
    let list = document.getElementById("thirdparty-urls-list");
    list.innerHTML = "";
    for (let i = 0; i < thirdPartyUrlList.length; i++) {
        let item = document.createElement("li");
        item.textContent = thirdPartyUrlList[i];
        list.appendChild(item);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    browser.runtime.onMessage.addListener((message) => {
        if (message.thirdPartyLength != undefined) {
            document.getElementById("thirdparty-urls-count").textContent = `Number of third party URLs: ${message.thirdPartyLength}`;

            secScore -= 4;
            updateScore()
        }

        if (message.thirdPartyUrls != undefined) {
            thirdPartyUrlList = message.thirdPartyUrls;
        }

        if (message.cookiesWebLen != undefined) {
            document.getElementById("websiteUrl-cookie-count").textContent = `Number of cookies from websiteUrl: ${message.cookiesWebLen}`;

            secScore -= 2;
            updateScore()
        }

        if (message.firstPartyCookiesWeb != undefined) {
            document.getElementById("websiteUrl-firstparty-cookie-count").textContent = `Number of first party cookies from websiteUrl: ${message.firstPartyCookiesWeb}`;

            secScore -= 2;
            updateScore()
        }

        if (message.thirdPartyCookiesWeb != undefined) {
            document.getElementById("websiteUrl-thirdparty-cookie-count").textContent = `Number of third party cookies from websiteUrl: ${message.thirdPartyCookiesWeb}`;

            secScore -= 2;
            updateScore()
        }
        if (message.sessionCookiesWeb != undefined) {
            document.getElementById("websiteUrl-session-cookies").textContent = `Number of session cookies from websiteUrl: ${message.sessionCookiesWeb}`;

            secScore -= 2;
            updateScore()
        }

        if (message.persistentCookiesWeb != undefined) {
            document.getElementById("websiteUrl-persistent-cookies").textContent = `Number of persistent cookies from websiteUrl: ${message.persistentCookiesWeb}`;

            secScore -= 2;
            updateScore()
        }

        if (message.cookiesReqLen != undefined) {
            document.getElementById("requestUrl-cookie-count").textContent = `Number of cookies from requestUrl: ${message.cookiesReqLen}`;

            secScore -= 2;
            updateScore()
        }

        if (message.firstPartyCookiesReq != undefined) {
            document.getElementById("requestUrl-firstparty-cookie-count").textContent = `Number of first party cookies from requestUrl: ${message.firstPartyCookiesReq}`;

            secScore -= 2;
            updateScore()
        }

        if (message.thirdPartyCookiesReq != undefined) {
            document.getElementById("requestUrl-thirdparty-cookie-count").textContent = `Number of third party cookies from requestUrl: ${message.thirdPartyCookiesReq}`;

            secScore -= 2;
            updateScore()
        }

        if (message.sessionCookiesReq != undefined) {
            document.getElementById("requestUrl-session-cookies").textContent = `Number of session cookies from requestUrl: ${message.sessionCookiesReq}`;

            secScore -= 2;
            updateScore()
        }

        if (message.persistentCookiesReq != undefined) {
            document.getElementById("requestUrl-persistent-cookies").textContent = `Number of persistent cookies from requestUrl: ${message.persistentCookiesReq}`;

            secScore -= 2;
            updateScore()
        }

        if (message.fingerprint != undefined) {
            base64 = message.fingerprint;

            secScore -= 1;
            updateScore()
        }

        if (message.unsync != undefined) {
            document.getElementById("unsync").textContent = "Unsynchronized cookies? Yes"

            secScore -= 1;
            updateScore()
        }

        if (message.hook != undefined) {
            document.getElementById("hook").textContent = "Is hooking possible? Yes"

            secScore -= 5;
            updateScore()
        }

        if (message.hijack != undefined) {
            document.getElementById("hijacking").textContent = "Is session hijacking possible? Yes"

            secScore -= 5;
            updateScore()
        }

        if (message.storageData != undefined) {
            let localStorage = message.storageData.localDetails;
            let sessionStorage = message.storageData.sessionDetails;

            document.getElementById("local-storage-count").textContent = `Number of items in Local Storage: ${Object.keys(localStorage).length}`;
            document.getElementById("session-storage-count").textContent = `Number of items in Session Storage: ${Object.keys(sessionStorage).length}`;

            secScore -= 2;
            secScore -= 2;
            updateScore()

            localStorageData = localStorage;
            sessionStorageData = sessionStorage;
        }
    });
});
