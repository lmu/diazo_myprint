document.addEventListener("DOMContentLoaded", function () {
    var elForm = document.getElementById("form1");
    var elHeader = document.querySelector(".header__navigation-wrapper");

    var elHeaderNavigation = document.createElement("nav");
    elHeaderNavigation.className = "c-main-navigation";
    elHeader.appendChild(elHeaderNavigation);


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
        if (elActions.length) {
            var elActionRow = elActions[0].parentElement.parentElement;

            var elActionsContainer = document.createElement("ul");
            elActionsContainer.className = "main-navigation__list";

            [].slice.call(elActions).forEach(function (el) {
                el.className = "main-navigation__list-link";
                elLi = document.createElement("li");
                elLi.className = "main-navigation__list-item";
                elLi.appendChild(el);
                elActionsContainer.appendChild(elLi);
            });

            elHeaderNavigation.appendChild(elActionsContainer);

            // Remove actions row (now empty)
            // elActionRow.parentElement.removeChild(elActionRow);
        }
    }

    async function loadMensaKarteContent(url) {
        let response = await fetch(url);
        let content = await response.text();
        let elMain = document.getElementById("r-main");
        let wrapper = document.createElement("div");
        wrapper.innerHTML = content;
        elMain.appendChild(wrapper.firstElementChild);
    }

    function addBodyPageClass() {
        let splitPath = window.location.pathname.split("/");
        let pageFile = splitPath.pop();
        let pageName = pageFile.split(".")[0];
        let pageClass = `page-${pageName.toLowerCase()}`;
        document.body.classList.add(pageClass);
    };

    function init() {
        addBodyPageClass();
        if (elLanguageSelector) {
            moveLanguageSelector();
        };
        moveActions();
        loadMensaKarteContent("/static/mensa-karte.html");
    }

    init();

});