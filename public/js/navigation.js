/**
 * navigation.js
 *
 * @copyright Copyright © 2015 cloud-nemo
 * @author    cloud-nemo
 */
function navBarInvoked(ev) {
    var navbarCommand = ev.detail.navbarCommand;
    if (0 < navbarCommand.location.length) {
        window.location.href = navbarCommand.location;
    }
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