// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
// <reference path="ms-appx://$(TargetFramework)/js/WinJS.js" />
// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/Helper.ts"/>

module WinJSTests {
    "use strict";

    var _element;
    var utils = Helper;

    export class NavBarTests {


        setUp() {
            LiveUnit.LoggingCore.logComment("In setup");
            var newNode = document.createElement("div");
            newNode.id = "navbarDiv";
            newNode.style.height = "200px";
            document.body.appendChild(newNode);
            _element = newNode;
        }

        tearDown() {
            LiveUnit.LoggingCore.logComment("In tearDown");
            if (_element) {
                WinJS.Utilities.disposeSubTree(_element);
                document.body.removeChild(_element);
                _element = null;
            }
        }



        testNavBarInstantiationJS = function (complete) {
            var element = document.getElementById("navbarDiv"),
                navBar = new WinJS.UI.NavBar(element),
                className = "win-navbar";

            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(element, className), "CSS class not applied");
            LiveUnit.Assert.areEqual(element, navBar.element);
            LiveUnit.Assert.areEqual(element.winControl, navBar);
            element.addEventListener("childrenprocessed", function () {
                complete();
            });
        };

        testNavBarInstantiationMarkUp = function (complete) {
            var eventFired = false;
            var handler: any = function (e) {
                eventFired = true;
            };
            handler.supportedForProcessing = true;
            window['handler'] = handler;

            var htmlStr =
                "<div id='bar' style='background-color:grey;' data-win-control='WinJS.UI.NavBar' data-win-options='{ onchildrenprocessed: window.handler }'>" +
                "</div>",
                parent = document.getElementById("navbarDiv");

            parent.innerHTML = htmlStr;
            WinJS.UI.processAll().
                then(function () {
                    var element = document.getElementById("bar"),
                        navbar = document.querySelector(".win-navbar").winControl;

                    LiveUnit.Assert.areEqual(navbar.element, element, "Unexpected winControl");
                    return utils.waitForEvent(navbar, "afteropen", navbar.open.bind(navbar));
                }).
                then(function () {
                    LiveUnit.Assert.isTrue(eventFired);
                    delete window['handler'];
                    complete();
                });
        };

        testNavBar_LayoutProperty = function () {
            var navBar;

            navBar = new WinJS.UI.NavBar();
            LiveUnit.Assert.areEqual("custom", navBar._layout);
        };

        testNavBarClosedDisplayModeProperty = function () {
            var navBar;

            navBar = new WinJS.UI.NavBar();
            LiveUnit.Assert.areEqual("minimal", navBar.closedDisplayMode);

            navBar = new WinJS.UI.NavBar(null, { closedDisplayMode: "none" });
            LiveUnit.Assert.areEqual("none", navBar.closedDisplayMode);

            navBar = new WinJS.UI.NavBar();

            // The layout setter of the NavBar will respect the value 'none', anything else is consider 'minimal'
            navBar.closedDisplayMode = "compact";
            LiveUnit.Assert.areEqual("minimal", navBar.closedDisplayMode);
        };

        testNavBarPlacementProperty = function () {
            var navBar;

            navBar = new WinJS.UI.NavBar();
            LiveUnit.Assert.areEqual("top", navBar.placement);

            navBar = new WinJS.UI.NavBar(null, { placement: "bottom" });
            LiveUnit.Assert.areEqual("bottom", navBar.placement);

            navBar = new WinJS.UI.NavBar();
            navBar.placement = "bottom";
            LiveUnit.Assert.areEqual("bottom", navBar.placement);
        };

        testNavBarDispose = function (complete) {
            var element = document.getElementById("navbarDiv"),
                navBar = <WinJS.UI.PrivateNavBar>new WinJS.UI.NavBar(element);

            utils.waitForEvent(navBar, "afteropen", navBar.open.bind(navBar)).
                then(function () {
                    LiveUnit.Assert.isFalse(navBar._disposed);
                    navBar.dispose();
                    LiveUnit.Assert.isTrue(navBar._disposed);
                    navBar.dispose();
                    LiveUnit.Assert.isTrue(navBar._disposed);
                }).
                done(complete);
        };

        testNavBarOpenedProperty = function (complete) {
            var navBar = new WinJS.UI.NavBar(document.getElementById("navbarDiv"));
            navBar.addEventListener("afteropen", function () {
                LiveUnit.Assert.isTrue(navBar.opened);
                navBar.opened = false;
                LiveUnit.Assert.isFalse(navBar.opened);
                navBar.addEventListener("afterclose", function () {
                    LiveUnit.Assert.isFalse(navBar.opened);
                    complete();
                });
            });
            LiveUnit.Assert.isFalse(navBar.opened);
            navBar.opened = true;
            LiveUnit.Assert.isTrue(navBar.opened);
        };
    };
}
LiveUnit.registerTestClass("WinJSTests.NavBarTests");