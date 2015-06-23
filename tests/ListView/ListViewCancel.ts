// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
// <reference path="ms-appx://$(TargetFramework)/js/WinJS.js" />
// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/Helper.ListView.ts" />


module WinJSTests {

    "use strict";

    var listViewEl;
    var defaultDisableCustomPagesPrefetch;
    var ListView = <typeof WinJS.UI.PrivateListView> WinJS.UI.ListView;

    export class ListViewCancel {


        setUp() {
            listViewEl = document.createElement("DIV");
            document.body.appendChild(listViewEl);
            listViewEl.style.cssText = "height: 200px; width: 200px; background-color: blue;";
            defaultDisableCustomPagesPrefetch = WinJS.UI._VirtualizeContentsView._disableCustomPagesPrefetch;
        }

        tearDown() {
            document.body.removeChild(listViewEl);
            WinJS.UI._VirtualizeContentsView._disableCustomPagesPrefetch = defaultDisableCustomPagesPrefetch;
        }

        testCancelItems(complete) {
            WinJS.UI._VirtualizeContentsView._disableCustomPagesPrefetch = true;
            var pausedSignal = new WinJS._Signal();
            pausedSignal.complete();
            var canceledCount = 0;
            var itemsFromIndexRequestCount = 0;
            var pendingStep = null;

            function CancelableDataAdapter() {
                var count = 1000;
                this.itemsFromIndex = function (index, countBefore, countAfter) {
                    if (pendingStep) {
                        WinJS.Utilities._setImmediate(pendingStep);
                        pendingStep = null;
                    }

                    itemsFromIndexRequestCount++;
                    var canceled = false;
                    return new WinJS.Promise(function (c, e, p) {
                        pausedSignal.promise.then(function () {
                            if (canceled) {
                                return;
                            }
                            var first = index - countBefore;
                            var last = Math.min(index + countAfter, count - 1);
                            var items = new Array(last - first + 1);

                            for (var i = first; i <= last; i++) {
                                items[i - first] = {
                                    data: {
                                        title: 'Item ' + i
                                    },
                                    key: '' + i
                                };
                            }

                            c(WinJS.Promise.wrap({
                                items: items,
                                offset: countBefore,
                                absoluteIndex: index,
                                totalCount: count
                            }));
                        });
                    }, function () {
                            canceled = true;
                            canceledCount++;
                        });
                };

                this.getCount = function () {
                    return WinJS.Promise.wrap(count);
                };
            };

            var CancelableDataSource = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function (array, keyOf) {
                this._baseDataSourceConstructor(new CancelableDataAdapter());
            })

        var cancelableDataSource = new CancelableDataSource();
            var listView = new ListView(listViewEl, {
                itemDataSource: cancelableDataSource,
                itemTemplate: function (itemPromise) {
                    return itemPromise.then(function (item) {
                        var element = document.createElement("DIV");
                        element.style.cssText = "width: 50px; height: 50px; background-color: green;";
                        element.textContent = item.data.title;
                        return element;
                    });
                }
            });

            listView.addEventListener('loadingstatechanged', waitForReady1);
            function waitForReady1() {
                if (listView.loadingState === "complete") {
                    listView.removeEventListener('loadingstatechanged', waitForReady1);
                    step2();
                }
            }

            function step2() {
                LiveUnit.Assert.areEqual(0, canceledCount, "Item Promise Canceled");
                pausedSignal = new WinJS._Signal();

                pendingStep = step3;
                listView.scrollPosition = 100 * 5;
            }

            var numOfRequestsThatWillGetCanceled;
            function step3() {
                LiveUnit.Assert.areEqual(0, canceledCount, "Item Promise Canceled");
                LiveUnit.Assert.isTrue(itemsFromIndexRequestCount > 0, "At least 1 request occurred");

                numOfRequestsThatWillGetCanceled = itemsFromIndexRequestCount;
                itemsFromIndexRequestCount = 0;

                pendingStep = step4;
                listView.scrollPosition = 100 * 12;
            }

            function step4() {
                pausedSignal.complete();
                listView.addEventListener('loadingstatechanged', step5);
            }

            function step5() {
                if (listView.loadingState === "complete") {
                    listView.removeEventListener('loadingstatechanged', step5);
                    WinJS.Utilities._setImmediate(step6);
                }
            }

            function step6() {
                // VDS Doesnt actually cancel the itemsFromIndexCall so it wont actually happen:
                //LiveUnit.Assert.areEqual(numOfRequestsThatWillGetCanceled, canceledCount, "Item Promise Canceled");
                // However we can verify that the right amount of elements are in the itemsManager Handle Map.
                LiveUnit.Assert.areEqual(Object.keys(listView._view.items._itemData).length, Object.keys(listView._itemsManager._handleMap).length, "Correct number of handles");
                LiveUnit.Assert.isTrue(itemsFromIndexRequestCount > 0, "At least 1 more request occurred");

                complete();
            }
        }
    }
}
LiveUnit.registerTestClass("WinJSTests.ListViewCancel");