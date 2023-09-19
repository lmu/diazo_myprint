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

    function _removeElements(selector) {
        var els = document.querySelectorAll(selector);
        [].slice.call(els).forEach(function (el) { el.parentElement.remove(el) });
    };

    function init() {
        if (elLanguageSelector) {
            moveLanguageSelector();
        };
        moveActions();
    }

    init();

});