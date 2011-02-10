var cgpCommon = {
    init: function (c, b, a) {
        $("#navigation").css("display", "inline");
        $("#navigation").accordion({
            active: true,
            header: ".menuHead",
            navigation: true,
            navigationFilter: function () {
                if (this.href.toLowerCase() == location.href.toLowerCase()) {
                    return true
                } else {
                    if ((location.href.indexOf("gallery.html") > 0) && (this.href.indexOf("gallery.php") > 0)) {
                        var d = location.href.indexOf("#gal") + 4;
                        var g = this.href.indexOf("?gal=") + 5;
                        var f = parseInt(location.href.substring(d, d + 2));
                        var e = parseInt(this.href.substring(g, g + 2));
                        if (f == e) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if ((location.href.indexOf("blog") > 0) && (this.href.indexOf("blog") > 0)) {
                            return true
                        } else {
                            if ((location.href.indexOf("venues") > 0) && (this.href.indexOf("venues") > 0)) {
                                return true
                            } else {
                                if ((location.href.indexOf("weddingideas") > 0) && (this.href.indexOf("weddingideas") > 0)) {
                                    return true
                                } else {
                                    if ((location.href.indexOf("portraitlocations") > 0) && (this.href.indexOf("portraitlocations") > 0)) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
            },
            event: "mouseover"
        });
        if ($(window).height() < 650) {
            $(".treeMenuLogo").css("background-image", "url('')")
        }
        cgpCommon.setPage(c, b);
        if (cgpCommon.isIE6()) {
            $(".treeMenuLogo").css("background-image", "url('')");
            $(".pageContents").css("background-image", "url('')")
        }
        cgpCommon.roundCorners();
        Logger.init("#debug_txt");
        if (a) {
            Logger.show()
        }
    },
    setPage: function (b, a) {
        $(".menuItem").css("font-weight", "normal");
        switch (b) {
        case "home":
            break;
        case "gallery":
            $("#gal" + gl_currentGallery).css("font-weight", "bold");
            break;
        case "pricing":
            $("#pricingMenuItem").css("font-weight", "bold");
            break;
        case "products":
            $("#productsMenuItem").css("font-weight", "bold");
            break;
        case "contact":
            $("#contactMenuItem").css("font-weight", "bold");
            break;
        case "information":
            $("#infoMenuItem").css("font-weight", "bold");
            break;
        case "weddingtips":
            $("#weddingtipsMenuItem").css("font-weight", "bold");
            break;
        case "portraittips":
            $("#portraittipsMenuItem").css("font-weight", "bold");
            break;
        case "venues":
            $("#venuesMenuItem").css("font-weight", "bold");
            break;
        case "weddingideas":
            $("#weddingideasMenuItem").css("font-weight", "bold");
            break;
        case "portraitlocations":
            $("#portraitlocationsMenuItem").css("font-weight", "bold");
            break;
        case "blog":
            $("#blogMenuItem_" + a).css("font-weight", "bold");
            break
        }
    },
    gotoGallery: function (k) {
        var a = window.location.href;
        var d = "";
        var b = 0;
        var j = 0;
        b = a.indexOf("//");
        d = a.substring(b + 2);
        j = d.indexOf("/");
        var l = a.substring(0, b + j + 3);
        var c = 8;
        var i = 0;
        var f = 0;
        var h = DetectFlashVer(c, i, f);
        if (!h) {
            return true
        }
        try {
            if (cgpGallery) {
                cgpGallery.gotoGallery(k);
                return false
            }
        } catch (g) {}
        window.location = l + "gallery.html#gal" + k + "&img=1&play=true";
        return false
    },
    isIE6: function () {
        if ($.browser.msie && $.browser.version < 7) {
            return true
        }
        return false
    },
    getHashPara: function (c, b) {
        if (b.length > 1) {
            var a = b.indexOf(c);
            if (a != -1) {
                a = a + c.length;
                return parseInt(b.substring(a, a + 2))
            }
        }
        return false
    },
    roundCorners: function () {
        if (!$.browser.msie) {
            if ($.browser.mozilla && $.browser.version.substr(0, 3) == "1.9") {
                $("#container").corners();
                Logger.debug("Setting rounded corners (FF3)")
            }
            if ($.browser.safari) {
                $("#container").corners();
                Logger.debug("Setting rounded corners (Safari)")
            }
        }
    }
};