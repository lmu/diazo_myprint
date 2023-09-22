document.addEventListener("DOMContentLoaded", function () {
    var elForm = document.getElementById("form1");
    var elHeader = document.getElementById("headerNavigationWrapper");
    var elNavigation = document.getElementById("mainNavigation");
    var elAboveContentNavigation = document.getElementById("aboveContentNavigation");

    var elTopPanel = document.getElementById("RightTopPanel");

    var elLanguageSelector = elTopPanel ? elTopPanel.querySelector("select") : null;


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

    async function loadMensaKarteContent() {
        _loadRemoteIntoContainer(
            "/static/mensa-karte.html",
            document.getElementById("mensaKartePlaceholder"),
            "replace",
        );
    }

    async function loadHinweiseKostenContent() {
        _loadRemoteIntoContainer(
            "/static/hinweise-kosten.html",
            document.getElementById("hinweiseKostenPlaceholder"),
            "replace",
        );
    }

    function loadRemoteContent() {
        loadHinweiseKostenContent();
        loadMensaKarteContent();
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

    function init() {
        addBodyPageClass();
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