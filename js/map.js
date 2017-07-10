! function(global) {
    var ym = {
        project: {
            preload: [],
            namespace: "ym",
            jsonpPrefix: "",
            loadLimit: 500
        },
        ns: {},
        env: {},
        envCallbacks: []
    };

    ! function() {
        var e = {
                exports: {}
            },
            t = e.exports;
        ! function(n) {
            var r, o = {
                    NOT_RESOLVED: "NOT_RESOLVED",
                    IN_RESOLVING: "IN_RESOLVING",
                    RESOLVED: "RESOLVED"
                },
                i = function() {
                    var e = {
                            trackCircularDependencies: !0,
                            allowMultipleDeclarations: !0
                        },
                        t = {},
                        f = !1,
                        m = [],
                        g = function(e, n, i) {
                            i || (i = n, n = []);
                            var a = t[e];
                            a || (a = t[e] = {
                                name: e,
                                decl: r
                            }), a.decl = {
                                name: e,
                                prev: a.decl,
                                fn: i,
                                state: o.NOT_RESOLVED,
                                deps: n,
                                dependents: [],
                                exports: r
                            }
                        },
                        y = function(e, t, r) {
                            "string" == typeof e && (e = [e]), f || (f = !0, d(w)), m.push({
                                deps: e,
                                cb: function(e, o) {
                                    o ? (r || a)(o) : t.apply(n, e)
                                }
                            })
                        },
                        v = function(e) {
                            var n = t[e];
                            return n ? o[n.decl.state] : "NOT_DEFINED"
                        },
                        h = function(e) {
                            var n = t[e];
                            return n ? n.decl.deps : null
                        },
                        E = function(e) {
                            return !!t[e]
                        },
                        b = function(t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        },
                        w = function() {
                            f = !1, S()
                        },
                        S = function() {
                            var e, t = m,
                                n = 0;
                            for (m = []; e = t[n++];) x(null, e.deps, [], e.cb)
                        },
                        x = function(e, n, r, o) {
                            var i = n.length;
                            i || o([]);
                            for (var a, c, u = [], l = function(e, t) {
                                    if (t) return void o(null, t);
                                    if (!--i) {
                                        for (var n, r = [], a = 0; n = u[a++];) r.push(n.exports);
                                        o(r)
                                    }
                                }, p = 0, d = i; p < d;) {
                                if (a = n[p++], "string" == typeof a) {
                                    if (!t[a]) return void o(null, s(a, e));
                                    c = t[a].decl
                                } else c = a;
                                u.push(c), I(c, r, l)
                            }
                        },
                        I = function(t, r, i) {
                            if (t.state === o.RESOLVED) return void i(t.exports);
                            if (t.state === o.IN_RESOLVING) return void(e.trackCircularDependencies && p(t, r) ? i(null, c(t, r)) : t.dependents.push(i));
                            if (t.dependents.push(i), t.prev && !e.allowMultipleDeclarations) return void L(t, l(t));
                            e.trackCircularDependencies && (r = r.slice()).push(t);
                            var a = !1,
                                s = t.prev ? t.deps.concat([t.prev]) : t.deps;
                            t.state = o.IN_RESOLVING, x(t, s, r, function(e, r) {
                                return r ? void L(t, r) : (e.unshift(function(e, n) {
                                    return a ? void i(null, u(t)) : (a = !0, void(n ? L(t, n) : T(t, e)))
                                }), void t.fn.apply({
                                    name: t.name,
                                    deps: t.deps,
                                    global: n
                                }, e))
                            })
                        },
                        T = function(e, t) {
                            e.exports = t, e.state = o.RESOLVED;
                            for (var n, i = 0; n = e.dependents[i++];) n(t);
                            e.dependents = r
                        },
                        L = function(e, t) {
                            e.state = o.NOT_RESOLVED;
                            for (var n, r = 0; n = e.dependents[r++];) n(null, t);
                            e.dependents = []
                        };
                    return {
                        create: i,
                        define: g,
                        require: y,
                        getState: v,
                        getDependencies: h,
                        isDefined: E,
                        setOptions: b,
                        flush: w,
                        nextTick: d
                    }
                },
                a = function(e) {
                    d(function() {
                        throw e
                    })
                },
                s = function(e, t) {
                    return Error(t ? 'Module "' + t.name + '": can\'t resolve dependence "' + e + '"' : 'Required module "' + e + "\" can't be resolved")
                },
                c = function(e, t) {
                    for (var n, r = [], o = 0; n = t[o++];) r.push(n.name);
                    return r.push(e.name), Error('Circular dependence has been detected: "' + r.join(" -> ") + '"')
                },
                u = function(e) {
                    return Error('Declaration of module "' + e.name + '" has already been provided')
                },
                l = function(e) {
                    return Error('Multiple declarations of module "' + e.name + '" have been detected')
                },
                p = function(e, t) {
                    for (var n, r = 0; n = t[r++];)
                        if (e === n) return !0;
                    return !1
                },
                d = function() {
                    var e = [],
                        t = function(t) {
                            return 1 === e.push(t)
                        },
                        r = function() {
                            var t = e,
                                n = 0,
                                r = e.length;
                            for (e = []; n < r;) t[n++]()
                        };
                    if ("object" == typeof process && process.nextTick) return function(e) {
                        t(e) && process.nextTick(r)
                    };
                    if (n.setImmediate) return function(e) {
                        t(e) && n.setImmediate(r)
                    };
                    if (n.postMessage && !n.opera) {
                        var o = !0;
                        if (n.attachEvent) {
                            var i = function() {
                                o = !1
                            };
                            n.attachEvent("onmessage", i), n.postMessage("__checkAsync", "*"), n.detachEvent("onmessage", i)
                        }
                        if (o) {
                            var a = "__modules" + +new Date,
                                s = function(e) {
                                    e.data === a && (e.stopPropagation && e.stopPropagation(), r())
                                };
                            return n.addEventListener ? n.addEventListener("message", s, !0) : n.attachEvent("onmessage", s),
                                function(e) {
                                    t(e) && n.postMessage(a, "*")
                                }
                        }
                    }
                    var c = n.document;
                    if ("onreadystatechange" in c.createElement("script")) {
                        var u = c.getElementsByTagName("head")[0],
                            l = function() {
                                var e = c.createElement("script");
                                e.onreadystatechange = function() {
                                    e.parentNode.removeChild(e), e = e.onreadystatechange = null, r()
                                }, u.appendChild(e)
                            };
                        return function(e) {
                            t(e) && l()
                        }
                    }
                    return function(e) {
                        t(e) && setTimeout(r, 0)
                    }
                }();
            "object" == typeof t ? e.exports = i() : n.modules = i()
        }(this), ym.modules = e.exports
    }(), ym.modules.setOptions({
            trackCircularDependencies: !0,
            allowMultipleDeclarations: !1
        }), ym.ns.modules = ym.modules,
        function(e) {
            function t(e, t, n) {
                if (t) {
                    var r = e;
                    t = t.split(".");
                    for (var o, i = 0, a = t.length - 1; i < a; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                    return r[t[a]] = n, r[t[a]]
                }
                return n
            }
            ym.project.namespace && ("function" == typeof setupAsync ? ym.envCallbacks.push(function(n) {
                n.namespace !== !1 && t(e, n.namespace || ym.project.namespace, ym.ns)
            }) : t(e, ym.project.namespace, ym.ns))
        }(this), ym.modules.define("error", ["util.defineClass", "util.extend"], function(e, t, n) {
            function r(e, t) {
                function n(t) {
                    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.name = e, this.message = t
                }
                return t && (n.errorClass = t), o[e] = n, n
            }
            var o = {
                    create: function(e, t) {
                        return o[e] ? new o[e](t) : void o.log("ProcessError", e + ": is undefined error type")
                    },
                    throwException: function(e, t) {
                        if (ym.env.debug) throw "object" == typeof e ? e : o.create(e, t)
                    },
                    throwExceptionIf: function(e, t, n) {
                        e && o.throwException(t, n)
                    },
                    warn: function(e, t) {
                        if (ym.env.debug && "object" == typeof console && console.warn) {
                            var n = "object" == typeof e ? e : o.create(e, t),
                                r = new Error(n.name + ": " + n.message);
                            r.stack = n.stack, console.warn(r)
                        }
                    },
                    warnIf: function(e, t, n) {
                        e && o.warn(t, n)
                    }
                },
                i = r("_YMError");
            t(i, Error);
            var a = r("ClientError");
            t(a, i);
            var s = r("InputError", "ClientError");
            t(s, a);
            var c = r("StateError", "ClientError");
            t(c, a);
            var u = r("ProcessError", "ClientError");
            t(u, a);
            var l = r("StorageItemAccessError", "ClientError");
            t(l, a);
            var p = r("FeatureRemovedError", "ClientError");
            t(p, a);
            var d = r("ExternalError");
            t(d, i);
            var f = r("RequestError", "ExternalError");
            t(f, d);
            var m = r("DataProcessingError", "ExternalError");
            t(m, d);
            var g = r("AccessError", "ExternalError");
            t(g, d);
            var y = r("NotSupportedError", "ExternalError");
            t(y, d);
            var v = r("Reject");
            t(v, i);
            var h = r("OperationUnallowedReject", "Reject");
            t(h, v);
            var E = r("OperationCanceledReject", "Reject");
            t(E, v);
            var b = r("EmptyResultReject", "Reject");
            t(b, v);
            var w = r("OperationUnavailableReject", "Reject");
            t(w, v);
            var S = r("Warning");
            t(S, i);
            var x = r("DeprecationWarning", "Warning");
            t(x, S);
            var I = r("OveruseWarning", "Warning");
            t(I, S), e(o)
        }), ym.modules.define("main", ["map-data", "params", "current-script"], function(e, t, n, r) {
            function o() {
                var e = document.createElement("ymaps");
                return e.setAttribute("id", "ymaps" + n.tid), e.style.display = "block", e.style.width = n.containerSize[0], e.style.height = n.containerSize[1], e
            }

            function i(e) {
                for (; e;) {
                    if (e.parentNode === document.body) return !0;
                    e = e.parentNode
                }
                return !1
            }

            function a(e) {
                console && console.error && console.error(e)
            }
            return t.maps && t.maps.length ? (r ? ym.modules.require(["ymaps", "create-map"], function(e, t) {
                var s, c = o();
                if (n.elementId) {
                    if (s = document.getElementById(n.elementId), !s) return void a("DOMElement #" + n.elementId + " not found.");
                    s.appendChild(c)
                } else {
                    if (!document.documentElement.contains(r)) return void a("Script element was removed from document.");
                    i(r) ? r.parentNode.insertBefore(c, r) : document.body.appendChild(c)
                }
                t(c), r.parentNode && r.parentNode.removeChild(r)
            }) : a("Script element was not found."), void e({})) : void e()
        }), ym.modules.require("main", function() {}), ym.modules.define("config", [], function(e) {
            e({
                "host": "https://api-maps.yandex.ru/",
                "enterpriseHost": "https://enterprise.api-maps.yandex.ru/",
                "originalUrl": "api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A2aa4936201f53f6c4fd1e507e73d4dff7f4672b94c84b3d55baf458b13567438",
                "namespace": "ymaps_ctor",
                "apiVersion": "2.1.52",
                "minContainerSize": [320, 200],
                "mapHost": "https://yandex.ru/maps/"
            })
        }), ym.modules.define("map-data", [], function(e) {
            e({
                "ymj": "1.0",
                "maps": [{
                    "properties": {
                        "sid": "2aa4936201f53f6c4fd1e507e73d4dff7f4672b94c84b3d55baf458b13567438",
                        "created": 1499176928,
                        "updated": 1499606453,
                        "authorUid": "205195238",
                        "access": "public",
                        "revision": "25",
                        "name": "4inu",
                        "description": ""
                    },
                    "state": {
                        "size": [500, 400],
                        "center": [36.519135294230146, 55.011965397515],
                        "zoom": 10,
                        "type": "yandex#map",
                        "traffic": {
                            "shown": false
                        }
                    },
                    "geoObjects": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "id": "99639412",
                            "properties": {
                                "name": "+200 рублей и 30 минут ожидания",
                                "description": "",
                                "iconContent": "",
                                "iconCaption": ""
                            },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [
                                        [36.14247710514236, 54.97414027097631],
                                        [36.48579985904838, 55.252803990662265],
                                        [36.83049590397043, 55.236327535071354],
                                        [36.761831353189116, 54.99625260962236],
                                        [36.284929948165974, 54.78712894280081],
                                        [36.14247710514236, 54.97414027097631]
                                    ],
                                    [
                                        [36.23411818058913, 54.98828245649752],
                                        [36.57744093449538, 55.16084525012924],
                                        [36.7051569989485, 55.1112804822073],
                                        [36.768328385667246, 55.090807157719695],
                                        [36.382433610276614, 54.888660686238794],
                                        [36.23411818058913, 54.98828245649752]
                                    ]
                                ]
                            },
                            "options": {
                                "zIndex": 100000000,
                                "order": 100000000,
                                "preset": "fillColor:ffd21e99_strokeColor:ffd21ee6_strokeWidth:3"
                            }
                        }, {
                            "type": "Feature",
                            "id": "99639413",
                            "properties": {
                                "name": "Бесплатный выезд мастера",
                                "description": "",
                                "iconContent": "",
                                "iconCaption": ""
                            },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [
                                        [36.23761063602717, 54.98749278326215],
                                        [36.5795600989178, 55.16005899053707],
                                        [36.77182084110527, 55.09159478803678],
                                        [36.38317948368341, 54.889452311365964],
                                        [36.23761063602717, 54.98749278326215]
                                    ]
                                ]
                            },
                            "options": {
                                "zIndex": 100000001,
                                "order": 100000001,
                                "preset": "fillColor:56db4099_strokeColor:ffd21ee6_strokeWidth:0"
                            }
                        }]
                    }
                }],
                "presetStorage": {
                    "fillColor:ffd21e99_strokeColor:ffd21ee6_strokeWidth:3": {
                        "fillColor": "ffd21e99",
                        "strokeColor": "ffd21ee6",
                        "strokeWidth": 3
                    },
                    "fillColor:56db4099_strokeColor:ffd21ee6_strokeWidth:0": {
                        "fillColor": "56db4099",
                        "strokeColor": "ffd21ee6",
                        "strokeWidth": 0
                    }
                }
            })
        }), ym.modules.define("params", ["config", "map-data"], function(e, t, n) {
            function r(e) {
                return e ? isNaN(Number(e)) ? e : e + "px" : "100%"
            }
            var o = {
                "scrollZoomBehavior": false,
                "size": [null, null],
                "sid": "2aa4936201f53f6c4fd1e507e73d4dff7f4672b94c84b3d55baf458b13567438",
                "elementId": "",
                "sourceType": "constructor",
                "key": "",
                "apikey": "",
                "csp": false
            };
            o.containerSize = [r(o.size[0]), r(o.size[1])], o.isEnterprise = t.originalUrl.indexOf("enterprise.") > -1, o.lang = (o.lang || n.maps[0] && n.maps[0].state && n.maps[0].state.lang || "ru_RU").replace("-", "_"), o.tid = String(Number(new Date)) + String(Math.round(1e6 * Math.random())), o.ns = [t.namespace, o.lang, o.key.replace(/\W/g, ""), o.apikey.replace(/\W/g, ""), o.isEnterprise ? "_ntrp" : ""].join("__"), e(o)
        });
    var currentScript = document.currentScript;
    ym.modules.define("current-script", ["config"], function(e, t) {
        function n(e, t) {
            return !!e && t.indexOf(e.replace(/^.*?\/\//, "")) > -1
        }
        if (!currentScript || !currentScript.parentNode)
            for (var r, o = document.getElementsByTagName("script"), i = 0, a = o.length; i < a; i++)
                if (r = o[i], !r.ctorInited && n(r.src, t.originalUrl)) {
                    r.ctorInited = !0, currentScript = r;
                    break
                }
        e(currentScript)
    }), ym.modules.define("ie-version", [], function(e) {
        e(function() {
            for (var e, t = 3, n = document.createElement("div"), r = n.getElementsByTagName("i"); n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", r[0];);
            return t > 4 ? t : e
        }())
    }), ym.modules.define("js-loader", [], function(e) {
        e(function(e, t) {
            var n = document.getElementsByTagName("head")[0],
                r = document.createElement("script"),
                o = function() {
                    n.removeChild(r), t && t(), t = null
                };
            return r.charset = "utf-8", r.src = e, n.insertBefore(r, n.firstChild), r.onreadystatechange = function() {
                "complete" !== this.readyState && "loaded" !== this.readyState || o()
            }, r.onload = o, r.src = e, r
        })
    }), ym.modules.define("ymaps", ["config", "params", "js-loader"], function(e, t, n, r) {
        function o() {
            e(window[i])
        }
        var i = n.ns,
            a = window[i],
            s = i + "loader";
        if (a && !window[s]) a.ready(o);
        else if (window[s]) window[s].queue.push(o);
        else {
            var c = "fid" + n.tid,
                u = n.isEnterprise ? t.enterpriseHost : t.host;
            0 === u.indexOf("/") && (u = "https:" + u);
            var l = u + t.apiVersion + "/",
                p = ["Map", "GeoObject", "geoObject.addon.balloon", "map.associate.serviceGeoObjects", "geoObject.addon.hint", "templateLayoutFactory", "domEvent.manager", "control.Button", "control.FullscreenControl", "control.GeolocationControl", "control.RouteEditor", "control.RulerControl", "control.SearchControl", "control.TrafficControl", "control.TypeSelector", "control.ZoomControl", "system.browser", "meta", "mapType.storage", "option.presetStorage", "util.dom.styleSheet"];
            l = [l, "?lang=", n.lang, "&coordorder=longlat&load=", p.join(","), "&wizard=constructor&ns=", n.ns, "&counter_prefix=constructor"].join(""), n.csp && (l += "&csp=true"), n.key && (l += "&key=" + n.key), n.apikey && (l += "&apikey=" + n.apikey), "debug" === n.mode && (l += "&mode=debug"), r(l + "&onload=" + c), window[c] = function(e) {
                e.ready(function() {
                    function e() {
                        var e = window[s];
                        try {
                            delete window[c], delete window[s]
                        } catch (t) {
                            window[c] = window[s] = null
                        }
                        for (var n = 0, r = e.queue.length; n < r; n++) e.queue[n]()
                    }
                    e()
                })
            }, window[s] = {
                queue: [o],
                callback: window[c]
            }
        }
    }), ym.modules.define("check-size-component", ["config", "params", "distribution"], function(e, t, n, r) {
        var o;
        e(function(e) {
            function n() {
                e.container.events.add(["fullscreenenter", "fullscreenexit"], a), window.attachEvent ? window.attachEvent("onresize", a) : window.addEventListener("resize", a)
            }

            function i() {
                e.container.events.remove(["fullscreenenter", "fullscreenexit"], a), window.detachEvent ? window.detachEvent("onresize", a) : window.removeEventListener("resize", a)
            }

            function a() {
                var n, i = document.documentElement;
                if (e.container.isFullscreen()) n = [i.clientWidth, i.clientHeight];
                else {
                    var s = e.container.getParentElement().getBoundingClientRect();
                    n = [s.width, s.height]
                }
                for (var c = t.minContainerSize, u = "0,0" === n.toString(), l = n[0] < c[0], p = !u && (l || n[1] < c[1]), d = ["rulerControl", "routeEditor", "searchControl", "trafficControl", "geolocationControl"], f = 0, m = d.length; f < m; f++) e.controls.get(d[f]).options.set("visible", !p);
                !e.state.get("narrowMode") && e.options.get("suppressMapOpenBlock", !1) || (e.state.get("narrowMode") !== l ? l ? r.show(e) : r.hide(e) : l && r.onResize(e)), e.state.get("compactMode") !== p && (p ? (e.controls.remove("typeSelector"), e.controls.get("zoomControl").options.set({
                    position: {
                        top: 10,
                        left: 10
                    },
                    size: "small"
                })) : (e.controls.add("typeSelector"), e.controls.get("zoomControl").options.unset(["position", "size"]))), u ? o || (o = window.setInterval(a, 200)) : o && (window.clearInterval(o), o = 0), e.state.set({
                    compactMode: p,
                    narrowMode: l
                })
            }
            e.events.add("destroy", i), n(), a()
        })
    }), ym.modules.define("create-map", ["config", "params", "map-data", "check-size-component", "ymaps"], function(e, t, n, r, o, i) {
        var a = r.maps[0];
        e(function(e) {
            function t(e) {
                if (e.indexOf("___sport") > -1) {
                    var t = e.split("___");
                    return ["islands#", t[1], "Run", t[0].indexOf("circle") > -1 ? "CircleIcon" : "Icon"].join("")
                }
                return "#" === e[0] ? n.sid.toString() + e.toString() : e.replace(/^twirl#/, "islands#").replace(/^default#/, "islands#").replace(/Dot$/, "Icon").replace("white", "gray")
            }

            function s(e, t) {
                if (window.MutationObserver) {
                    var n = new window.MutationObserver(function(r) {
                        var o = !r.some(function(e) {
                            return 0 === e.removedNodes.length
                        });
                        o && !document.body.contains(t) && (n.disconnect(), n = null, e.destroy(), e = null, t = null)
                    });
                    n.observe(document.body, {
                        childList: !0,
                        subtree: !0
                    })
                }
            }
            var c = i.templateLayoutFactory.createClass("{{ properties.iconContent }}", {
                    build: function() {
                        c.superclass.build.call(this);
                        var e = this.getData().properties.get("iconContent");
                        if (e && String(e).length > 2) {
                            var t = this.getElement();
                            t.style.fontSize = "9px", t.style.lineHeight = "16px", t.style.display = "block"
                        }
                    }
                }),
                u = {
                    autoFitToViewport: "always",
                    geoObjectStrokeOpacity: 1,
                    geoObjectFillOpacity: 1,
                    geoObjectStrokeColor: "ff0000e6",
                    geoObjectStrokeWidth: 5,
                    geoObjectFillColor: "ff000099",
                    geoObjectBalloonContentLayout: i.templateLayoutFactory.createClass("{{ properties.name|raw }}"),
                    geoObjectIconContentLayout: c,
                    geoObjectZIndexActive: Math.pow(10, 9) + 10,
                    geoObjectZIndexHover: Math.pow(10, 9) + 9
                };
            n.isEnterprise || (u.searchControlProvider = "yandex#search");
            var l = new i.Map(e, {
                center: a.state.center,
                zoom: Math.round(a.state.zoom),
                type: a.state.type,
                controls: ["fullscreenControl", "rulerControl", "routeEditor", "searchControl", "trafficControl", "typeSelector", "zoomControl", "geolocationControl"]
            }, u);
            o(l, e), l.state.set({
                mapSid: n.sid,
                mapSourceType: n.sourceType
            }), n.scrollZoomBehavior || l.behaviors.disable("scrollZoom");
            var p = r.presetStorage;
            for (var d in p) p.hasOwnProperty(d) && i.option.presetStorage.add(d, p[d]);
            a.state.traffic && a.state.traffic.shown && l.controls.get("trafficControl").state.set("trafficShown", !0);
            for (var f = a.geoObjects.features, m = i.map.associate.serviceGeoObjects.get(l), g = 0, y = f.length; g < y; g++) {
                var v, h = f[g];
                h.options && (v = t(h.options.preset || "")), m.add(new i.GeoObject({
                    geometry: h.geometry,
                    properties: h.properties
                }, {
                    preset: v,
                    zIndex: h.options && h.options.zIndex || g + 1
                }))
            }
            s(l, e)
        })
    }), ym.modules.define("distribution", ["config", "params", "ymaps", "ymaps-counter", "ie-version"], function(e, t, n, r, o, i) {
        function a(e) {
            function t(e) {
                var t = e.getElement();
                t && t.firstChild && t.parentNode && (t.firstChild.style.width = "100%", t.firstChild.firstChild && (t.firstChild.firstChild.style.padding = "0px"))
            }
            y = "cnst_" + (new Date).getTime();
            var n = y + "-button",
                o = r.util.dom.styleSheet;
            o.addStyle("." + n, "{display: block; text-align:center;}"), o.addStyle("." + n + "-inner", "{ " + f + "} "), g = new r.control.Button({
                data: {
                    content: ['<ymaps class="' + n + '">', '<ymaps class="' + y + " " + n + '-inner">', p, "</ymaps>", "</ymaps>"].join("")
                },
                options: {
                    maxWidth: "99999",
                    selectOnClick: !1
                }
            }), e.controls.add(g, {
                position: {
                    left: 10,
                    right: 10,
                    bottom: 5
                }
            }), g.getLayoutSync() ? t(g.getLayoutSync()) : g.getLayout().then(t), e.panes.get("copyrights").getElement().style.marginBottom = "29px", s(e)
        }

        function s(e) {
            function t(t) {
                var n = t.getElement().querySelector("." + y),
                    r = e.container.getSize();
                r[0] < 175 ? (n.style.paddingLeft = "0px", n.style.backgroundImage = null) : (n.style.paddingLeft = "18px", n.style.backgroundImage = "url(" + d + ")")
            }
            i < 9 || g && (g.getLayoutSync() ? t(g.getLayoutSync()) : g.getLayout().then(t))
        }

        function c(e) {
            e.controls.remove("fullscreenControl")
        }

        function u(e) {
            e.controls.add("fullscreenControl")
        }
        var l = {
                ru_RU: "На большую карту",
                en_US: "See full-size map",
                ru_UA: "На большую карту",
                uk_UA: "На велику карту",
                tr_TR: "Haritalar'da aç"
            },
            p = l[n.lang] || l.ru_RU,
            d = ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAxNCAyMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtLjUgLS4yMjIpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik01LjUgMjMuMjIybDUuNTM1LTcuNTdzMS42LTIuMTg1IDIuNjEtNC4xNWMxLjAxLTEuOTY2Ljg0NS00LjI4Ljg0NS00LjI4TDggMTMuMiA1LjUgMjMuMjJ6IiBmaWxsPSIjQ0QwMDAwIi8+PGNpcmNsZSBmaWxsPSIjRTAwIiBjeD0iNy41IiBjeT0iNy4yMjIiIHI9IjciLz48ZWxsaXBzZSBmaWxsPSIjRkZGIiBjeD0iNy41IiBjeT0iNy4yMjIiIHJ4PSIzIiByeT0iMyIvPjwvZz48L3N2Zz4="].join(""),
            f = "background-size: 10px 16px; background-repeat: no-repeat; background-position: left center;display: inline-block;";
        i < 9 && (f = "");
        var m, g, y;
        e({
            show: function(e) {
                function i(e) {
                    o.countByKey("distribution", [e, r.system.browser.platform, r.meta.version.replace(/\W/g, "_")].join("."))
                }
                e.options.set({
                    copyrightLogoVisible: !1,
                    suppressMapOpenBlock: !0
                }), a(e), c(e), g.events.add("click", function() {
                    window.open([t.mapHost, "?um=", n.sourceType, ":", n.sid, "&source=constructor"].join("")), i("mapsButton-constructor.smallMap")
                })
            },
            onResize: function(e) {
                s(e)
            },
            hide: function(e) {
                g && e.controls.remove(g), u(e), e.panes.get("copyrights").getElement().style.marginBottom = "0px", e.options.unset(["copyrightLogoVisible", "suppressMapOpenBlock"]), m && (m.removeAll(), m = null)
            }
        })
    }), ym.modules.define("ymaps-counter", ["ymaps"], function(e, t) {
        var n;
        e({
            countByKey: function(e, r) {
                n ? n.then(function(t) {
                    t.countByKey(e, r)
                }) : n = t.modules.require("yandex.counter").then(function(t) {
                    var n = t[0];
                    return n.countByKey(e, r), n
                })
            }
        })
    }), ym.modules.define("system.createNs", [], function(e) {
        e(function(e, t, n) {
            if (t) {
                var r = e;
                t = t.split(".");
                for (var o, i = 0, a = t.length - 1; i < a; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                return r[t[a]] = n, r[t[a]]
            }
            return n
        })
    }), ym.modules.define("system.mergeImports", [], function(e) {
        function t(e, t, n) {
            if (t) {
                var r = e;
                t = t.split(".");
                for (var o, i = 0, a = t.length - 1; i < a; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                return r[t[a]] = n, r[t[a]]
            }
            return n
        }

        function n(e, t) {
            return e[2] - t[2]
        }

        function r(e) {
            return 0 === e.indexOf("package.")
        }

        function o(e, n, r) {
            for (var o = [], i = {}, a = 0, s = n.length; a < s; ++a) {
                var c = r[a].__package;
                if (c)
                    for (var u = 0; u < c.length; ++u) i[c[u][0]] || (t(e, c[u][0], c[u][1]), o.push([c[u][0], c[u][1]]), i[c[u][0]] = 1);
                else t(e, n[a], r[a]), i[n[a]] || (o.push([n[a], r[a]]), i[n[a]] = 1)
            }
            return e.__package = o, e
        }

        function i(e, i, a, s) {
            var c = [],
                u = r(e);
            if (u) return o(i, a, s);
            for (var l = 0, p = a.length; l < p; ++l) c.push([a[l], l, a[l].length]);
            c.sort(n);
            for (var l = 0, p = c.length; l < p; ++l) {
                var d = c[l][1],
                    f = a[d];
                if (r(f))
                    for (var m = s[d].__package, g = 0; g < m.length; ++g) t(i, m[g][0], m[g][1]);
                else t(i, f, s[d])
            }
            return i
        }
        e({
            isPackage: r,
            joinImports: i,
            createNS: t
        })
    }), ym.modules.define("system.provideCss", ["system.nextTick", "system.supports.csp"], function(e, t, n) {
        function r() {
            if (c = !1, s.length) {
                if (o || (o = document.createElement(d ? "link" : "style"), o.type = "text/css", o.rel = "stylesheet", o.setAttribute && o.setAttribute("data-ymaps", "css-modules"), l && p && l.style_nonce && o.setAttribute && o.setAttribute("nonce", l.style_nonce)), o.styleSheet) a += i, o.styleSheet.cssText = a, o.parentNode || document.getElementsByTagName("head")[0].appendChild(o);
                else {
                    if (d) {
                        var e = new Blob([i], {
                                type: "text/css"
                            }),
                            t = u.createObjectURL(e);
                        o.setAttribute("href", t)
                    } else o.appendChild(document.createTextNode(i));
                    document.getElementsByTagName("head")[0].appendChild(o), o = null
                }
                i = "";
                var n = s;
                s = [];
                for (var r = 0, f = n.length; r < f; ++r) n[r]()
            }
        }
        var o, i = "",
            a = "",
            s = [],
            c = !1,
            u = window.URL || window.webkitURL || window.mozURL,
            l = n.isSupported && ym.env.server && ym.env.server.params.csp,
            p = n.isNonceSupported,
            d = l && (!l.style_nonce || !p);
        e(function(e, n) {
            i += e + "\n/**/\n", n && s.push(n), c || (t(r), c = !0)
        })
    }), ym.modules.define("system.supports.csp", [], function(e) {
        var t = ym.env ? ym.env.browser : null;
        e({
            isSupported: "undefined" != typeof Blob && "undefined" != typeof URL,
            isNonceSupported: t ? !(t.name.search("Safari") != -1 && Number(t.version.split(".")[0]) < 10) : null
        })
    }), ym.modules.define("system.supports.css", [], function(e) {
        function t(e) {
            return "undefined" == typeof p[e] ? p[e] = n(e) : p[e]
        }

        function n(e) {
            return r(e) || r(f + i(e)) || r(d.cssPrefix + i(e))
        }

        function r(e) {
            return "undefined" != typeof o().style[e] ? e : null
        }

        function o() {
            return c || (c = document.createElement("div"))
        }

        function i(e) {
            return e ? e.substr(0, 1).toUpperCase() + e.substr(1) : e
        }

        function a(e) {
            var n = t(e);
            return n && n != e && (n = "-" + f + "-" + e), n
        }

        function s(e) {
            return u[e] && t("transitionProperty") ? a(u[e]) : null
        }
        var c, u = {
                transform: "transform",
                opacity: "opacity",
                transitionTimingFunction: "transition-timing-function",
                userSelect: "user-select",
                height: "height"
            },
            l = {},
            p = {},
            d = ym.env.browser,
            f = d.cssPrefix.toLowerCase();
        e({
            checkProperty: t,
            checkTransitionProperty: function(e) {
                return "undefined" == typeof l[e] ? l[e] = s(e) : l[e]
            },
            checkTransitionAvailability: s
        })
    }), ym.modules.define("system.supports.graphics", [], function(e) {
        function t() {
            if (!window.WebGLRenderingContext) return !1;
            var e = ym.env.browser,
                t = {
                    "Samsung Internet": !0,
                    AndroidBrowser: !0
                },
                n = "Webkit" == e.engine && +e.engineVersion < 537;
            return !n && !t[e.name]
        }

        function n() {
            if (!t()) return null;
            var e;
            try {
                var n = document.createElement("canvas"),
                    r = n.getContext(e = "webgl", o);
                r || (r = n.getContext(e = "experimental-webgl", o), r || (e = null))
            } catch (i) {
                e = null
            }
            return e ? {
                contextName: e
            } : null
        }

        function r(e, t) {
            e.width = 226, e.height = 256, t.fillStyle = "#fff", t.fillRect(0, 0, 150, 150), t.globalCompositeOperation = "xor", t.fillStyle = "#f00", t.fillRect(10, 10, 100, 100), t.fillStyle = "#0f0", t.fillRect(50, 50, 100, 100);
            for (var n = t.getImageData(49, 49, 2, 2), r = [], o = 0; o < 16; o++) r.push(n.data[o]);
            return "0x0x0x0x0x0x0x0x0x0x0x0x0x255x0x255" == r.join("x")
        }
        var o = {
                failIfMajorPerformanceCaveat: !0,
                antialias: !1
            },
            i = {};
        e({
            hasSvg: function() {
                return "svg" in i || (i.svg = document.implementation && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")), i.svg
            },
            hasCanvas: function() {
                if (!("canvas" in i)) {
                    var e = document.createElement("canvas"),
                        t = "getContext" in e ? e.getContext("2d") : null;
                    i.canvas = !!t && r(e, t)
                }
                return i.canvas
            },
            hasWebGl: function() {
                return "webgl" in i || (i.webgl = n()), i.webgl
            },
            hasVml: function() {
                if (!("vml" in i)) {
                    var e, t = !1,
                        n = document.createElement("div");
                    n.innerHTML = '<v:shape id="yamaps_testVML"  adj="1" />', e = n.firstChild, e && e.style && (e.style.behavior = "url(#default#VML)", t = !e || "object" == typeof e.adj, n.removeChild(e)), i.vml = t
                }
                return i.vml
            },
            redetect: function() {
                i = {}
            },
            getWebGlContextName: function() {
                return i.webgl && i.webgl.contextName
            }
        })
    }), ym.modules.define("template.Parser", ["util.id", "system.supports.csp"], function(provide, utilId, cspSupport) {
        function trim(e) {
            return nativeTrim ? e.trim() : e.replace(trimRegExp, "")
        }

        function escape(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")
        }

        function getKeyValuePairs(e) {
            for (var t = [], n = trim(e).replace(/\s*=\s*/g, "=").replace(/\s+/g, " ").split(" "), r = 0, o = n.length; r < o; r++) t.push(n[r].split("=", 2));
            return t
        }

        function removeQuotes(e) {
            var t = e.charAt(0);
            return "'" == t || '"' == t ? e.slice(1, e.length - 1) : e
        }

        function parseExpression(e) {
            for (var t, n = /'|"/g, r = 0, o = []; t = n.exec(e);) {
                var i = t.index;
                if (i >= r) {
                    var a = e.indexOf(t[0], i + 1);
                    r != i && parseExpressionSubstitutes(o, e.slice(r, i)), o.push(e.slice(i, a + 1)), r = a + 1
                }
            }
            return r < e.length && parseExpressionSubstitutes(o, e.slice(r)), o.join("")
        }

        function parseExpressionSubstitutes(e, t) {
            for (var n, r = /(^|[^\w\$])([A-Za-z_\$][\w\$\.]*)(?:[^\w\d_\$]|$)/g, o = 0; n = r.exec(t);) {
                var i = n.index + n[1].length,
                    a = n[2],
                    s = i + a.length;
                i > o && e.push(t.slice(o, i)), stopWords[a] ? e.push(a) : e.push('data.get("' + a + '")'), o = s
            }
            o < t.length && e.push(t.slice(o))
        }

        function evaluateExpression(expression, data) {
            var result;
            return eval("result = " + expression), result
        }
        var trimRegExp = /^\s+|\s+$/g,
            nativeTrim = "function" == typeof String.prototype.trim,
            DataLogger = function(e) {
                this._dataManager = e, this._renderedValues = {}, this._contexts = {}
            };
        DataLogger.prototype.get = function(e) {
            if (this._renderedValues.hasOwnProperty(e)) return this._renderedValues[e].value;
            var t = e.indexOf("."),
                n = trim(t > -1 ? e.substring(0, t) : e);
            this._contexts.hasOwnProperty(n) && (e = e.replace(n, this._contexts[n]));
            var r = this._dataManager.get(e);
            return this.set(e, r), r
        }, DataLogger.prototype.setContext = function(e, t) {
            this._contexts[e] = t
        }, DataLogger.prototype.set = function(e, t) {
            if (e.indexOf(".") > -1)
                for (var n = e.split("."), r = "", o = 0, i = n.length - 1; o < i; o++) r += (0 === o ? "" : ".") + n[o], this._renderedValues[r] = {
                    value: this._dataManager.get(r)
                };
            this._renderedValues[e] = {
                value: t
            }
        }, DataLogger.prototype.getRenderedValues = function() {
            return this._renderedValues
        };
        var stopWords = {
                "true": !0,
                "false": !0,
                undefined: !0,
                "null": !0,
                "typeof": !0
            },
            CONTENT = 0,
            startTokenRegExp = new RegExp(["\\$\\[\\[", "\\$\\[(?!\\])", "\\[if", "\\[else\\]", "\\[endif\\]", "\\{\\{", "\\{%"].join("|"), "g"),
            Parser = function(e) {
                this.filtersStorage = e
            };
        Parser.prototype.scanners = {}, Parser.prototype.builders = {}, Parser.prototype.parse = function(e) {
            var t, n, r, o, i = [],
                a = 0;
            for (startTokenRegExp.lastIndex = 0; o = startTokenRegExp.exec(e);)
                if (o.index >= a) {
                    t = o.index, r = t + o[0].length, a != t && i.push(CONTENT, e.slice(a, t));
                    var s = this.scanners[o[0]];
                    s.token ? (i.push(s.token, null), a = r) : (n = e.indexOf(s.stopToken, r), s.scan(i, e.slice(r, n)), a = n + s.stopToken.length)
                }
            return a < e.length && i.push(CONTENT, e.slice(a)), i
        }, Parser.prototype.build = function(e, t) {
            var n = {
                nodes: e,
                left: 0,
                right: e.length,
                empty: !0,
                flags: {},
                subnodes: [],
                sublayouts: [],
                strings: [],
                data: new DataLogger(t)
            };
            return this._buildTree(n), n.renderedValues = n.data.getRenderedValues(), n
        }, Parser.prototype._buildTree = function(e) {
            for (var t = e.nodes, n = e.strings; e.left < e.right;) {
                var r = t[e.left];
                r == CONTENT ? (n.push(t[e.left + 1]), e.empty = !1, e.left += 2) : this.builders[r](e, this)
            }
        };
        var OLD_SUBSTITUTE = 1001,
            OLD_SUBLAYOUT = 1002,
            OLD_IF = 1003,
            OLD_ELSE = 1004,
            OLD_ENDIF = 1005;
        Parser.prototype.scanners["$[["] = {
            stopToken: "]]",
            scan: function(e, t) {
                var n = t.match(/^(\S+)\s*(\S.*)?$/);
                e.push(OLD_SUBLAYOUT, [n[1], n[2] ? getKeyValuePairs(n[2]) : []])
            }
        }, Parser.prototype.scanners["$["] = {
            stopToken: "]",
            scan: function(e, t) {
                var n = t.split("|", 2);
                e.push(OLD_SUBSTITUTE, n)
            }
        }, Parser.prototype.scanners["[if"] = {
            stopToken: "]",
            scan: function(e, t) {
                var n = t.match(/^(def)? (.+)$/),
                    r = parseExpression(n[2]);
                e.push(OLD_IF, [n[1], r])
            }
        }, Parser.prototype.scanners["[else]"] = {
            token: OLD_ELSE
        }, Parser.prototype.scanners["[endif]"] = {
            token: OLD_ENDIF
        }, Parser.prototype.builders[OLD_SUBSTITUTE] = function(e, t) {
            var n = e.nodes[e.left + 1][0],
                r = e.data.get(n);
            "undefined" == typeof r && (r = e.nodes[e.left + 1][1]), e.strings.push(r), e.left += 2, e.empty = e.empty && !r
        }, Parser.prototype.builders[OLD_SUBLAYOUT] = function(e, t) {
            var n = utilId.prefix() + utilId.gen(),
                r = e.nodes[e.left + 1][0];
            e.strings.push('<ymaps id="' + n + '"></ymaps>');
            for (var o = {
                    id: n,
                    key: r,
                    value: e.data.get(r) || r
                }, i = [], a = [], s = e.nodes[e.left + 1][1], c = 0, u = s.length; c < u; c++) {
                var l, p = s[c],
                    d = p[0],
                    f = p[1] || "true",
                    m = f.length - 1;
                '"' == f.charAt(0) && '"' == f.charAt(m) || "'" == f.charAt(0) && "'" == f.charAt(m) ? l = f.substring(1, m) : isNaN(Number(f)) ? "true" == f ? l = !0 : "false" == f ? l = !1 : (a = f.split("|"), l = e.data.get(a[0], a[1]), i.push(a[0])) : l = f, o[d] = l
            }
            o.monitorValues = i, e.sublayouts.push(o), e.left += 2
        }, Parser.prototype.builders[OLD_IF] = function(e, t) {
            for (var n, r, o, i = e.nodes, a = e.left, s = i[a + 1][0], c = i[a + 1][1], u = evaluateExpression(c, e.data), l = s ? "undefined" != typeof u : !!u, p = e.left + 2, d = e.right, f = 1; p < d && (i[p] == OLD_IF ? f++ : i[p] == OLD_ELSE ? 1 == f && (r = p) : i[p] == OLD_ENDIF && (--f || (o = p)), !o);) p += 2;
            if (l ? (n = e.left + 2, d = r ? r : o) : (n = r ? r + 2 : o, d = o), n != d) {
                var m = e.right,
                    g = e.empty;
                e.left = n, e.right = d, t._buildTree(e), e.empty = e.empty && g, e.right = m
            }
            e.left = o + 2
        };
        var SUBSTITUTE = 2001,
            INCLUDE = 2002,
            IF = 2003,
            ELSE = 2004,
            ENDIF = 2005,
            FOR = 2006,
            ENDFOR = 2007,
            ELSEIF = 2008,
            STYLE = 2009,
            ENDSTYLE = 2010;
        Parser.prototype.scanners["{{"] = {
            stopToken: "}}",
            scan: function(e, t) {
                for (var n = t.split("|"), r = [], o = 1, i = n.length; o < i; o++) {
                    var a = n[o].split(":", 2),
                        s = trim(a[0]),
                        c = a[1];
                    a[1] && (c = "default" != s ? parseExpression(removeQuotes(a[1])) : trim(a[1])), r.push([s, c])
                }
                e.push(SUBSTITUTE, [trim(n[0]), r])
            }
        }, Parser.prototype.scanners["{%"] = {
            stopToken: "%}",
            scan: function(e, t) {
                var n = trim(t).match(/^([A-Za-z]+)(\s+\S.*)?$/),
                    r = n[1],
                    o = n[2] ? trim(n[2]) : null;
                switch (r) {
                    case "if":
                        e.push(IF, parseExpression(o));
                        break;
                    case "else":
                        e.push(ELSE, null);
                        break;
                    case "elseif":
                        e.push(ELSEIF, parseExpression(o));
                        break;
                    case "endif":
                        e.push(ENDIF, null);
                        break;
                    case "include":
                        var i = getKeyValuePairs(o);
                        e.push(INCLUDE, [removeQuotes(i[0][0]), i.slice(1)]);
                        break;
                    case "for":
                        e.push(FOR, o);
                        break;
                    case "endfor":
                        e.push(ENDFOR, null);
                        break;
                    case "style":
                        e.push(STYLE, o);
                        break;
                    case "endstyle":
                        e.push(ENDSTYLE, o)
                }
            }
        }, Parser.prototype.builders[SUBSTITUTE] = function(e, t) {
            var n, r, o, i = /\[\s*(\d+|\'[^\']+\'|\"[^\"]+\")\s*\]/g,
                a = e.nodes[e.left + 1],
                s = a[0],
                c = !0,
                u = a[1];
            if (i.test(s)) {
                var l, p = s.match(i),
                    d = s.split(p[0]);
                if (o = p.length, s = d[0], l = s + "." + removeQuotes(trim(p[0].replace("[", "").replace("]", ""))), d = d[1], o > 1)
                    for (r = 1; r < o; r++) {
                        var f = p[r];
                        d = d.split(f), f = trim(f.replace("[", "").replace("]", "")), f = removeQuotes(f), d[0].length && (l += d[0]), l += "." + f, d = d[1]
                    } else l += d;
                n = e.data.get(l)
            } else n = e.data.get(s);
            for (r = 0, o = u.length; r < o; r++) {
                var m, g = u[r];
                t.filtersStorage && (m = t.filtersStorage.get(g[0])) ? n = m(e.data, n, g[1]) : "raw" == g[0] && (c = !1)
            }
            c && "string" == typeof n && (n = escape(n)), e.strings.push(n), e.left += 2, e.empty = e.empty && !n
        }, Parser.prototype.builders[INCLUDE] = Parser.prototype.builders[OLD_SUBLAYOUT], Parser.prototype.builders[FOR] = function(e, t) {
            for (var n, r, o = e.nodes, i = e.left + 2, a = e.right, s = 1; i < a && (o[i] == FOR ? s++ : o[i] == ENDFOR && (--s || (r = i)), !r);) i += 2;
            if (n = e.left + 2, a = r, n != a) {
                var c = o[e.left + 1].split(/\sin\s/),
                    u = trim(c[0]),
                    l = trim(c[1]),
                    p = e.data.get(l),
                    d = u.split(","),
                    f = d.length,
                    m = e.right,
                    g = e.empty,
                    y = e.data,
                    v = new DataLogger(y);
                e.data = v;
                for (var h in p) e.left = n, e.right = a, p.hasOwnProperty(h) && (1 == f ? v.setContext(u, l + "." + h) : (v.set(trim(d[0]), h), v.setContext(trim(d[1]), l + "." + h)), t._buildTree(e));
                e.empty = e.empty && g, e.right = m, e.data = y
            }
            e.left = r + 2
        }, Parser.prototype.builders[IF] = Parser.prototype.builders[ELSEIF] = function(e, t) {
            for (var n, r, o, i, a, s = e.nodes, c = e.left, u = s[c + 1], l = evaluateExpression(u, e.data), p = !!l, d = e.left + 2, f = e.right, m = 1; d < f && (a = s[d], a == IF ? m++ : a == ELSEIF ? 1 != m || o || (o = d) : a == ELSE ? 1 == m && (r = d) : a == ENDIF && (--m || (i = d)), !i);) d += 2;
            if (p ? (n = e.left + 2, f = o || r || i) : o ? (n = o, f = i + 1) : (n = r ? r + 2 : i, f = i), n != f) {
                var g = e.right,
                    y = e.empty;
                e.left = n, e.right = f, t._buildTree(e), e.empty = e.empty && y, e.right = g
            }
            e.left = i + 2
        }, Parser.prototype.builders[STYLE] = function(e, t) {
            for (var n, r, o, i = e.nodes, a = e.left + 2, s = e.right, c = 1; a < s;) {
                if (o = i[a], o == STYLE) c++;
                else if (o == ENDSTYLE && 1 == c) {
                    r = a;
                    break
                }
                a += 2
            }
            if (n = e.left + 2, s = r, n != s) {
                var u = e.right,
                    l = e.empty;
                e.left = n, e.right = s, cspSupport.isSupported && ym.env.server && ym.env.server.params.csp ? (e.strings.push('data-ymaps-style="'), e.flags.containsInlineStyle = !0) : e.strings.push('style="'), t._buildTree(e), e.strings.push('"'), e.empty = e.empty && l, e.right = u
            }
            e.left = r + 2
        }, provide(Parser)
    }), ym.modules.define("util.defineClass", ["util.extend"], function(e, t) {
        function n(e, n, r) {
            return e.prototype = (Object.create || function(e) {
                function t() {}
                return t.prototype = e, new t
            })(n.prototype), e.prototype.constructor = e, e.superclass = n.prototype, e.superclass.constructor = n, r && t(e.prototype, r), e.prototype
        }

        function r(e, r, o) {
            var i = "function" == typeof r;
            i && n(e, r);
            for (var a = i ? 2 : 1, s = arguments.length; a < s; a++) t(e.prototype, arguments[a]);
            return e
        }
        e(r)
    }), ym.modules.define("util.extend", ["util.objectKeys"], function(e, t) {
        function n(e) {
            if (ym.env.debug && !e) throw new Error("util.extend: не передан параметр target");
            for (var t = 1, n = arguments.length; t < n; t++) {
                var r = arguments[t];
                if (r)
                    for (var o in r) r.hasOwnProperty(o) && (e[o] = r[o])
            }
            return e
        }

        function r(e) {
            if (ym.env.debug && !e) throw new Error("util.extend: не передан параметр target");
            for (var n = 1, r = arguments.length; n < r; n++) {
                var o = arguments[n];
                if (o)
                    for (var i = t(o), a = 0, s = i.length; a < s; a++) e[i[a]] = o[i[a]]
            }
            return e
        }
        e("function" == typeof Object.keys ? r : n)
    }), ym.modules.define("util.id", [], function(e) {
        var t = new function() {
            function e() {
                return (++n).toString()
            }
            var t = ("id_" + +new Date + Math.round(1e4 * Math.random())).toString(),
                n = Math.round(1e4 * Math.random());
            this.prefix = function() {
                return t
            }, this.gen = e, this.get = function(n) {
                return n === window ? t : n[t] || (n[t] = e())
            }
        };
        e(t)
    }), ym.modules.define("util.jsonp", ["util.id", "util.querystring", "util.script"], function(e, t, n, r) {
        function o(e) {
            return o.handler ? o.handler(e, i) : i(e)
        }

        function i(e) {
            var o, i, s = "undefined" == typeof e.checkResponse || e.checkResponse,
                p = e.responseFieldName || "response",
                d = e.requestParams ? "&" + n.stringify(e.requestParams, null, null, {
                    joinArrays: !0
                }) : "",
                f = ym.vow.defer(),
                m = f.promise(),
                g = e.timeout || 3e4,
                y = setTimeout(function() {
                    f.reject(u)
                }, g),
                v = function() {
                    a(i, o), clearTimeout(y), y = null
                };
            if (!e.padding) {
                if (o = e.paddingKey || t.prefix() + t.gen(), "function" == typeof window[o] && window[o].promise) return window[o].promise;
                c(o), window[o] = function(e) {
                    if (s) {
                        var t = !e || e.error || e[p] && e[p].error;
                        t ? f.reject(t) : f.resolve(e && e[p] || e)
                    } else f.resolve(e)
                }, window[o].promise = m
            }
            var h = e.url + (/\?/.test(e.url) ? "&" : "?") + (e.paramName || "callback") + "=" + (e.padding || o) + (e.noCache ? "&_=" + Math.floor(1e7 * Math.random()) : "") + d;
            if (e.postprocessUrl)
                if ("function" == typeof e.postprocessUrl) h = e.postprocessUrl(h);
                else
                    for (; e.postprocessUrl.length;) h = e.postprocessUrl.shift()(h);
            return i = r.create(h), i.onerror = function() {
                f.reject(l)
            }, m.always(v), m
        }

        function a(e, t) {
            t && s(t), setTimeout(function() {
                e && e.parentNode && e.parentNode.removeChild(e)
            }, 0)
        }

        function s(e) {
            window[e] = p, d[e] = setTimeout(function() {
                window[e] = void 0;
                try {
                    delete window[e]
                } catch (t) {}
            }, 500)
        }

        function c(e) {
            d[e] && (clearTimeout(d[e]), d[e] = null)
        }
        var u = {
                message: "timeoutExceeded"
            },
            l = {
                message: "scriptError"
            },
            p = function() {},
            d = {};
        e(o)
    }), ym.modules.define("system.nextTick", [], function(e) {
        var t = function() {
            var e = [],
                t = function(t) {
                    return 1 === e.push(t)
                },
                n = function() {
                    var t = e,
                        n = 0,
                        r = e.length;
                    for (e = []; n < r;) t[n++]()
                };
            if ("object" == typeof process && process.nextTick) return function(e) {
                t(e) && process.nextTick(n)
            };
            if (global.setImmediate) return function(e) {
                t(e) && global.setImmediate(n)
            };
            if (global.postMessage && !global.opera) {
                var r = !0;
                if (global.attachEvent) {
                    var o = function() {
                        r = !1
                    };
                    global.attachEvent("onmessage", o), global.postMessage("__checkAsync", "*"), global.detachEvent("onmessage", o)
                }
                if (r) {
                    var i = "__ym" + +new Date,
                        a = function(e) {
                            e.data === i && (e.stopPropagation && e.stopPropagation(), n())
                        };
                    return global.addEventListener ? global.addEventListener("message", a, !0) : global.attachEvent("onmessage", a),
                        function(e) {
                            t(e) && global.postMessage(i, "*")
                        }
                }
            }
            var s = global.document;
            if ("onreadystatechange" in s.createElement("script")) {
                var c = s.getElementsByTagName("head")[0],
                    u = function() {
                        var e = s.createElement("script");
                        e.onreadystatechange = function() {
                            e.parentNode.removeChild(e), e = e.onreadystatechange = null, n()
                        }, c.appendChild(e)
                    };
                return function(e) {
                    t(e) && u()
                }
            }
            return function(e) {
                t(e) && setTimeout(n, 0)
            }
        }();
        e(t)
    }), ym.modules.define("util.objectKeys", [], function(e) {
        var t = "function" == typeof Object.keys ? Object.keys : function(e) {
            var t = [];
            for (var n in e) e.hasOwnProperty(n) && t.push(n);
            return t
        };
        e(function(e) {
            var n, r = typeof e;
            if ("object" != r && "function" != r) throw new TypeError("Object.keys called on non-object");
            return n = t(e)
        })
    }), ym.modules.define("util.providePackage", ["system.mergeImports"], function(e, t) {
        e(function(e, n) {
            var r = n[0],
                o = Array.prototype.slice.call(n, 1),
                i = t.joinImports(e.name, {}, e.deps, o);
            r(i)
        })
    }), ym.modules.define("util.querystring", [], function(e) {
        function t(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
        e({
            parse: function(e, n, r, o) {
                n = n || "&", r = r || "=", o = o || {};
                for (var i, a, s, c = o.decodeURIComponent || decodeURIComponent, u = {}, l = e.split(n), p = 0; p < l.length; ++p) i = l[p].split(r), a = c(i[0]), s = c(i.slice(1).join(r)), t(u[a]) ? u[a].push(s) : u.hasOwnProperty(a) ? u[a] = [u[a], s] : u[a] = s;
                return u
            },
            stringify: function(e, n, r, o) {
                n = n || "&", r = r || "=", o = o || {};
                var i, a, s = o.encodeURIComponent || encodeURIComponent,
                    c = [];
                for (i in e)
                    if (e.hasOwnProperty(i))
                        if (a = e[i], t(a))
                            if (o.joinArrays) c.push(s(i) + r + s(a.join(",")));
                            else
                                for (var u = 0; u < a.length; ++u) "undefined" != typeof a[u] && c.push(s(i) + r + s(a[u]));
                else "undefined" != typeof a && c.push(s(i) + r + s(a));
                return c.join(n)
            }
        })
    }), ym.modules.define("util.script", [], function(e) {
        var t = document.getElementsByTagName("head")[0];
        e({
            create: function(e, n) {
                var r = document.createElement("script");
                return r.charset = n || "utf-8", r.src = e, setTimeout(function() {
                    t.insertBefore(r, t.firstChild)
                }, 0), r
            }
        })
    })
}(this);
var zoomControl = new YMaps.Zoom();
ym.removeControl(zoomControl);