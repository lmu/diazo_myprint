document.addEventListener("DOMContentLoaded", function () {
    var elForm = document.getElementById("form1");
    var elHeader = document.getElementById("headerNavigationWrapper");
    var elNavigation = document.getElementById("mainNavigation");
    var elAboveContentNavigation = document.getElementById("aboveContentNavigation");

    var elTopPanel = document.getElementById("RightTopPanel");

    var elLanguageSelector = elTopPanel ? elTopPanel.querySelector("select") : null;

    var CURRENT_LANGUAGE = "";


    function moveLanguageSelector() {
        var hiddenLanguageSelector = document.createElement("input");
        hiddenLanguageSelector.setAttribute("type", "hidden")
        hiddenLanguageSelector.setAttribute("name", elLanguageSelector.getAttribute("name"));
        hiddenLanguageSelector.setAttribute("value", elLanguageSelector.value);

        elForm.appendChild(hiddenLanguageSelector);

        elLanguageSelector.removeAttribute("onchange");
        elLanguageSelector.addEventListener("change", function (evt) {
            hiddenLanguageSelector.setAttribute("value", elLanguageSelector.value);
            __doPostBack('ctl00$ddllanguages', '');
        })

        elHeader.appendChild(elLanguageSelector);
    };


    function moveActions() {
        var elActions = document.querySelectorAll(".HyperlinkAlignRight");

        // Use fetch to call the logout link, granting immunity from the redirect.
        // When the fetch completes, redirect to the root.
        function fixLogout(evt) {
            evt.preventDefault();

            let elHref = evt.target.getAttribute("href");
            function redirectToRoot() { window.location.href = "/" };
            fetch(elHref).then(redirectToRoot).catch(redirectToRoot);

            return false;
        }

        if (elActions.length) {
            for (let i = elActions.length - 1; i >= 0; i--) {
                let el = elActions[i];
                let elID = el.getAttribute("id");
                el.setAttribute("data-id", elID);
                // Removing id as we will be cloning these elements.
                el.removeAttribute("id");
                // Fix logout link. 
                // The log-out redirects to the original proxied domain, 
                // which directs the user outside the theme.
                if (elID.toLowerCase().indexOf("logout") != -1) {
                    el.addEventListener("click", fixLogout);
                }
                elLi = document.createElement("li");
                elLi.appendChild(el);
                elNavigation.appendChild(elLi);
                elAboveContentNavigation.appendChild(elLi.cloneNode(true));
            }
        }
    }

    async function _loadRemoteContent(url) {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status, {cause: response})
        }
        let content = await response.text();
        let wrapper = document.createElement("div");
        wrapper.innerHTML = content;
        return wrapper.firstElementChild;
    }

    async function _loadRemoteIntoContainer(url, container, method) {
        let content = await _loadRemoteContent(url);
        if (method === "replace") {
            container.replaceWith(content)
        }
        else {
            container.appendChild(content)
        }

    }

    async function _tryLoadRemoteIntoContainer(url, container, method, fallbackUrl) {
        try {
            await _loadRemoteIntoContainer(
                url,
                container,
                method,
            );
        } 
        catch {
            _loadRemoteIntoContainer(
                fallbackUrl,
                container,
                method,
            );
        }

    }

    async function loadMensaKarteContent() {
        _tryLoadRemoteIntoContainer(
            `/static/templates/${CURRENT_LANGUAGE}/mensa-karte.html`,
            document.getElementById("mensaKartePlaceholder"),
            "replace",
            "/static/templates/en/mensa-karte.html",
        );
    }

    async function loadHinweiseKostenContent() {
        _tryLoadRemoteIntoContainer(
            `/static/templates/${CURRENT_LANGUAGE}/hinweise-kosten.html`,
            document.getElementById("hinweiseKostenPlaceholder"),
            "replace",
            "/static/templates/en/hinweise-kosten.html",
        );
    }

    async function loadFooterLinks() {
        _tryLoadRemoteIntoContainer(
            `/static/templates/${CURRENT_LANGUAGE}/footer-links.html`,
            document.getElementById("footerLinks"),
            "replace",
            "/static/templates/en/footer-links.html",
        );
    }

    function loadRemoteContent() {
        loadHinweiseKostenContent();
        loadMensaKarteContent();
        loadFooterLinks();
    }

    function addBodyPageClass() {
        let splitPath = window.location.pathname.split("/");
        let pageFile = splitPath.pop();
        let pageName = pageFile.split(".")[0];
        let pageClass = `page-${pageName.toLowerCase()}`;
        document.body.classList.add(pageClass);
    };

    function hideInactiveErrorMessages() {
        let els = document.querySelectorAll(
            "#ContentPlaceHolder1_lblInvalidPassword, #ContentPlaceHolder1_lblIdentiferNotFound");
        [].slice.call(els).forEach(function (el) {
            if (el.style.visibility === "hidden") {
                el.style.display = "none";
            }
        });
    }

    function hideInstallPrinterRowOnMobile() {
        // On mobile devices, the install printer button is not
        // present in the markup, in that case, remove the entire row.
        let elBtn = document.getElementById("ContentPlaceHolder1_btnInstallPrinter");
        if (!elBtn) {
            let elBtnComputerImage = document.getElementById("ContentPlaceHolder1_Polaroid");
            if (elBtnComputerImage) {
                let elTable = elBtnComputerImage.parentElement.parentElement.parentElement;
                elTable.parentElement.removeChild(elTable);
            }
        }
    }

    function setCurrentLanguage() {
        CURRENT_LANGUAGE = elLanguageSelector.value.split("-")[0];
        document.documentElement.setAttribute("lang", CURRENT_LANGUAGE);
        document.documentElement.setAttribute("xml:lang", CURRENT_LANGUAGE);
    }

    function init() {
        addBodyPageClass();
        setCurrentLanguage();
        if (elLanguageSelector) {
            moveLanguageSelector();
        };
        moveActions();
        loadRemoteContent();
        hideInactiveErrorMessages();
        hideInstallPrinterRowOnMobile();
    }

    init();

});