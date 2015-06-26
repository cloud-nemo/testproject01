/**
 * navigation.js
 *
 * @copyright Copyright © 2015 cloud-nemo
 * @author    cloud-nemo
 */
function navBarInvoked(ev) {
    var navbarCommand = ev.detail.navbarCommand;
    log(navbarCommand.label + " NavBarCommand invoked<br/>");
}

function log(msg) {
    var statusEl = document.getElementById("status");
    statusEl.innerHTML += msg;
    statusEl.scrollTop = statusEl.scrollHeight;
}

function toggleNavBarVisibility(ev) {
    document.getElementById('createNavBar').winControl.open();
}

WinJS.Namespace.define("Navi", {
    navBarInvoked: WinJS.UI.eventHandler(navBarInvoked)
});

WinJS.UI.processAll().done(function () {
    document.getElementById('createNavBar').addEventListener('click', toggleNavBarVisibility);
});