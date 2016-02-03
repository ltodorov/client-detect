/**
 * Client Detect is a modern library for detecting user's browser features.
 * @version 1.0.0
 * @license MIT License
 * @author Lyubomir Todorov
 * @copyright 2016 Lyubomir Todorov
 */

/* globals define, module, DocumentTouch */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        window.clientDetect = factory();
    }
}(function () {
    'use strict';

    var api = {},
        version = '1.0.0',
        classes = ['js'],
        classPrefix = '',
        tests = [],
        detects = {},
        vendors = {},
        rootElement = document.documentElement,
        rootStyles = window.getComputedStyle(rootElement);

    /**
     * Create a feature test.
     * @private
     * @param {string} name - A string name of the test.
     * @param {function|boolean} fn - A boolean or a function that will return
     *                              a boolean result.
     * @param {boolean} addClass - Whether or not to add the name as a class to
     *                             the root element.
     * @returns {object}
     */
    function addTest(name, fn, addClass) {
        var test = {
            name: name.toLowerCase(),
            fn: fn,
            addClass: addClass || false
        };

        tests.push(test);

        return test;
    }

    /**
     * Run a test and detect its support.
     * @private
     * @param {object} test - An object that has been added using `addTest()`.
     * @param {string} test.name
     * @param {function|boolean} test.fn
     * @param {boolean} test.addClass
     * @returns {boolean}
     */
    function runTest(test) {
        var cl = 'no-' + test.name,
            result = (typeof test.fn === 'function') ? test.fn() : test.fn;

        if (result) {
            cl = test.name;
        }

        if (test.addClass) {
            classes.push(cl);
        }

        detects[test.name] = result;

        return result;
    }

    /**
     * Run through all tests.
     * @private
     * @returns {object}
     */
    function runTests() {
        var len = tests.length;

        while (len--) {
            runTest(tests[len]);
        }

        tests = null;

        return detects;
    }

    /**
     * Determine wheather a property is supported.
     * @private
     * @param {object} obj - An object to check the properties.
     * @param {string[]} list - An array of the vendor prefixed properties.
     *                         The standard property must be the last item.
     * @returns {boolean}
     */
    function propTest(obj, list) {
        var len = list.length,
            name = list[len],
            prop = null;

        while (len--) {
            prop = list[len];

            if (prop in obj) {
                vendors[name] = prop;
                return true;
            }
        }

        return false;
    }

    /**
     * Get a list with the names of all detections.
     * @private
     * @returns {string[]}
     */
    function getTestNames() {
        return Object.keys(detects);
    }

    /**
     * Get a stored result from a specific detection.
     * @private
     * @param {string} name - A string name of the test.
     * @returns {boolean}
     */
    function getTestResult(name) {
        return detects[name.toLowerCase()];
    }

    /**
     * Get a prefixed or non-prefixed property name variant of your input.
     * @private
     * @param {string} name - The standard property name.
     * @returns {string|undefined}
     */
    function getVendor(name) {
        return vendors[name];
    }

    /**
     * Add a prefix to each item of an array.
     * @private
     * @param {string[]} origin - An array of class names.
     * @param {string} prefix - An optional prefix.
     * @returns {string[]}
     */
    function addPrefix(origin, prefix) {
        var result = origin;

        if (typeof prefix !== undefined) {
            result = origin.map(function (val) {
                return prefix + val;
            });
        }

        return result;
    }

    /**
     * Add class names to the root element.
     * @private
     * @param {string[]} classes - An array of class names.
     * @param {[type]} prefix - An optional prefix.
     * @returns {HTMLHtmlElement}
     */
    function setClasses(classes, prefix) {
        var list = addPrefix(classes, prefix);

        rootElement.className = list.join(' ');

        return rootElement;
    }

    // -------------------------------------------------------------------------
    // Feature detections
    // -------------------------------------------------------------------------

    addTest('localStorage', function () {
        var bool = true,
            val = 'ltodo';

        try {
            localStorage.setItem(val, val);
            localStorage.removeItem(val);
        } catch (e) {
            bool = false;
        }

        return bool;
    });

    addTest('sessionStorage', function () {
        var bool = true,
            val = 'ltodo';

        try {
            sessionStorage.setItem(val, val);
            sessionStorage.removeItem(val);
        } catch (e) {
            bool = false;
        }

        return bool;
    });

    addTest('requestAnimationFrame', function () {
        var list = [
            'webkitRequestAnimationFrame',
            'requestAnimationFrame'
        ];

        return propTest(window, list);
    });

    addTest('cancelAnimationFrame', function () {
        var list = [
            'webkitCancelAnimationFrame',
            'cancelAnimationFrame'
        ];

        return propTest(window, list);
    });

    addTest('fullscreenElement', function () {
        var list = [
            'webkitFullscreenElement',
            'mozFullScreenElement',
            'msFullscreenElement',
            'fullscreenElement'
        ];

        return propTest(document, list);
    });

    addTest('exitFullscreen', function () {
        var list = [
            'webkitExitFullscreen',
            'mozCancelFullScreen',
            'msExitFullscreen',
            'exitFullscreen'
        ];

        return propTest(document, list);
    });

    addTest('cssAnimations', function () {
        var list = [
            'webkitAnimation',
            'animation'
        ];

        return propTest(rootStyles, list);
    }, true);

    addTest('cssTransitions', function () {
        var list = [
            'webkitTransition',
            'transition'
        ];

        return propTest(rootStyles, list);
    }, true);

    addTest('cssTransforms', function () {
        var list = [
            'webkitTransform',
            'msTransform',
            'transform'
        ];

        return propTest(rootStyles, list);
    }, true);

    addTest('standalone', function () {
        return !!('standalone' in navigator && navigator.standalone);
    }, true);

    addTest('touchevents', function () {
        return !!(('ontouchstart' in window) || window.DocumentTouch &&
            document instanceof DocumentTouch);
    }, true);

    // -------------------------------------------------------------------------
    // End of feature detections
    // -------------------------------------------------------------------------

    runTests();

    setClasses(classes, classPrefix);

    // Public API
    api.list = getTestNames;
    api.prefixed = getVendor;
    api.support = getTestResult;
    api.version = version;

    return api;
}));