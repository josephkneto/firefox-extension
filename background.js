const tpUrls = [];


browser.webRequest.onBeforeRequest.addListener(
    async function(details) {
        let websiteUrl = new URL(details.originUrl).hostname;
        let requestUrl = new URL(details.url).hostname;
        let thirdPartyCheck = websiteUrl !== requestUrl;

        if (thirdPartyCheck) {
            // console.log("Third party request from " + requestUrl + ":" + details.url);

            tpUrls.push(details.url);
            browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                browser.runtime.sendMessage({ thirdPartyLength: tpUrls.length });
                browser.runtime.sendMessage({ thirdPartyUrls: tpUrls });
            });
        }

        function cookiesInfo(cookies) {
            let firstP = 0
            let thirdP = 0
            let sess = 0
            let pers = 0

            let cookieData = {
                total: cookies.length,
                firstParty: 0,
                thirdParty: 0,
                session: 0,
                persistent: 0,
                cookies: cookies.map((cookie) => {
                    let isThirdParty = cookie.domain !== websiteUrl.replace("www.", "");
                    let isSession = cookie.session;
                    let cookieType = isThirdParty ? "thirdParty" : "firstParty";
                    let cookieDuration = isSession ? "session" : "persistent";

                    if (!isThirdParty) {
                        firstP++;
                    } else {
                        thirdP++;
                    }

                    if (isSession) {
                        sess++;
                    } else {
                        pers++;
                    }

                    return {
                        name: cookie.name,
                        value: cookie.value,
                        isThirdParty: isThirdParty,
                        isSession: isSession,
                        cookieType: cookieType,
                        cookieDuration: cookieDuration
                    };
                }),
            };

            cookieData.firstParty = firstP;
            cookieData.thirdParty = thirdP;
            cookieData.session = sess;
            cookieData.persistent = pers;

            return cookieData;
        }


        // Get websiteUrl cookies
        let filteredWebsiteUrl = websiteUrl.replace("www.", "");
        browser.cookies.getAll({ domain: filteredWebsiteUrl }).then((websiteCookies) => {
            let cookieData = JSON.stringify(cookiesInfo(websiteCookies))
            let parsedCookieData = JSON.parse(cookieData)

            // console.log("Total cookies from " + filteredWebsiteUrl + ":" + parsedCookieData.total);
            // console.log("First-party cookies from " + filteredWebsiteUrl + ":" + parsedCookieData.firstParty);
            // console.log("Third-party cookies from " + filteredWebsiteUrl + ":" + parsedCookieData.thirdParty);
            // console.log("Session cookies from " + filteredWebsiteUrl + ":" + parsedCookieData.session);
            // console.log("Persistent cookies from " + filteredWebsiteUrl + ":" + parsedCookieData.persistent);
            browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                browser.runtime.sendMessage({ cookiesWebLen: parsedCookieData.total });
                browser.runtime.sendMessage({ firstPartyCookiesWeb: parsedCookieData.firstParty });
                browser.runtime.sendMessage({ thirdPartyCookiesWeb: parsedCookieData.thirdParty });
                browser.runtime.sendMessage({ sessionCookiesWeb: parsedCookieData.session });
                browser.runtime.sendMessage({ persistentCookiesWeb: parsedCookieData.persistent });
            });

            // Get requestUrl cookies
            let filteredRequestUrl = requestUrl.replace("www.", "");
            browser.cookies.getAll({ domain: filteredRequestUrl }).then((requestCookies) => {
                let requestCookieData = JSON.stringify(cookiesInfo(requestCookies))
                let parsedCookieData = JSON.parse(requestCookieData)

                // console.log("Total cookies from " + filteredRequestUrl + ":" + parsedCookieData.total);
                // console.log("First-party cookies from " + filteredRequestUrl + ":" + parsedCookieData.firstParty);
                // console.log("Third-party cookies from " + filteredRequestUrl + ":" + parsedCookieData.thirdParty);
                // console.log("Session cookies from " + filteredRequestUrl + ":" + parsedCookieData.session);
                // console.log("Persistent cookies from " + filteredRequestUrl + ":" + parsedCookieData.persistent);
                browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    browser.runtime.sendMessage({ cookiesReqLen: parsedCookieData.total });
                    browser.runtime.sendMessage({ firstPartyCookiesReq: parsedCookieData.firstParty });
                    browser.runtime.sendMessage({ thirdPartyCookiesReq: parsedCookieData.thirdParty });
                    browser.runtime.sendMessage({ sessionCookiesReq: parsedCookieData.session });
                    browser.runtime.sendMessage({ persistentCookiesReq: parsedCookieData.persistent });
                });



                // Check for synchronization of cookies
                const unsyncedCookies = requestCookies.filter((requestCookie) => {
                    // Check if the cookie from the request exists locally
                    return !websiteCookies.some((localCookie) => {
                        return requestCookie.name === localCookie.name && requestCookie.value === localCookie.value;
                    });
                });

                if (unsyncedCookies.length > 0) {
                    // console.log("Unsynchronized cookies detected:", unsyncedCookies);

                    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        browser.runtime.sendMessage({ unsync: "yes" });
                    });

                }
            });
        });

        // Local and Storage Data
        browser.tabs.executeScript({
            code: `(${function() {
                let storageData = {
                    localDetails: {},
                    sessionDetails: {},
                };
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    storageData.localDetails[key] = localStorage.getItem(key);
                }
                for (let i = 0; i < sessionStorage.length; i++) {
                    let key = sessionStorage.key(i);
                    storageData.sessionDetails[key] = sessionStorage.getItem(key);
                }

                return storageData;
            }})();`,
        }).then((data) => {
            browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                browser.runtime.sendMessage({ storageData: data[0] });
            });
        });

        // Get canvas fingerprint
        browser.tabs
            .executeScript({
                code: `(${function() {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let txt = "BrowserLeaks,com <canvas> Fingerprint";
                    ctx.textBaseline = "top";
                    ctx.font = "14px 'Arial'";
                    ctx.fillStyle = "#f60";
                    ctx.fillRect(125, 1, 62, 20);
                    ctx.fillStyle = "#069";
                    ctx.fillText(txt, 2, 15);
                    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                    ctx.fillText(txt, 4, 17);
                    return { canvas: canvas.toDataURL() };
                }})();`,
            })
            .then((data) => {
                browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    browser.runtime.sendMessage({ fingerprint: data[0].canvas });
                });

            });

        // Hook threat detection
        if (details.type === "script" && thirdPartyCheck) {
            // console.log("Hook threat detected: ", details.url);

            browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                browser.runtime.sendMessage({ hook: true });
            });

        }

        // Hijack threat detection
        if (details.type === "main_frame" && thirdPartyCheck) {
            browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                // Check if the URL of the active tab matches the request URL
                if (tabs[0].url !== details.url) {
                    // console.log("Hijack threat detected: ", details.url);

                    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        browser.runtime.sendMessage({ hijack: true });
                    });

                }
            });
        }
    },
    { urls: ["<all_urls>"] }
);
