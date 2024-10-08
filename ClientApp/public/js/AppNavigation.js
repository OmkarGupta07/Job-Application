(function(n, e) {
    "use strict";
    var a = function() {
            var n = this;
            e(document).ready(function() {
                n.initialize()
            })
        },
        i = a.prototype;
    a.MENU_MAXIMIZED = 1, a.MENU_COLLAPSED = 2, a.MENU_HIDDEN = 3, i._lastOpened = null, i.initialize = function() {
        this._enableEvents(), this._invalidateMenu(), this._evalMenuScrollbar()
    }, i._enableEvents = function() {
        var n = this;
        e(window).on("resize", function(e) {
            n._handleScreenSize(e)
        }), e('[data-toggle="menubar"]').on("click", function(e) {
            n._handleMenuToggleClick(e)
        }), e('[data-dismiss="menubar"]').on("click", function(e) {
            n._handleMenubarLeave()
        }), e("#main-menu").on("click", "li", function(e) {
            n._handleMenuItemClick(e)
        }), e("#main-menu").on("click", "a", function(e) {
            n._handleMenuLinkClick(e)
        }), e("body.menubar-hoverable").on("mouseenter", "#menubar", function(e) {
            setTimeout(function() {
                n._handleMenubarEnter()
            }, 1)
        })
    }, i._handleScreenSize = function(n) {
        this._invalidateMenu(), this._evalMenuScrollbar(n)
    }, i._handleMenuToggleClick = function(n) {
        materialadmin.App.isBreakpoint("xs") || e("body").toggleClass("menubar-pin");
        var i = this.getMenuState();
        i === a.MENU_COLLAPSED ? this._handleMenubarEnter() : i === a.MENU_MAXIMIZED ? this._handleMenubarLeave() : i === a.MENU_HIDDEN && this._handleMenubarEnter()
    }, i._handleMenuItemClick = function(n) {
        n.stopPropagation();
        var i = e(n.currentTarget),
            t = i.find("> ul"),
            l = i.closest("ul");
        if (this._handleMenubarEnter(i), 0 !== t.children().length) {
            this._closeSubMenu(l);
            var s = this.getMenuState() === a.MENU_COLLAPSED;
			
			if(i.hasClass("expanded"))
			{
				this._lastOpened = null;
			}
            (s || i.hasClass("expanded") === !1) && this._openSubMenu(i)
        }
    }, i._handleMenubarEnter = function(n) {
        var a = this,
            i = e("body").hasClass("offcanvas-left-expanded"),
            t = e("#menubar").data("expanded"),
            l = void 0 !== n;
        if ((l === !0 || i === !1) && t !== !0 && (e("#content").one("mouseover", function(n) {
                a._handleMenubarLeave()
            }), e("body").addClass("menubar-visible"), e("#menubar").data("expanded", !0), e("#menubar").triggerHandler("enter"), l === !1))
            if (this._lastOpened) {
				
                var a = this;
                this._openSubMenu(this._lastOpened, 0), this._lastOpened.parents(".gui-folder").each(function() {
                    a._openSubMenu(e(this), 0)
                })
            } else {
                var s = e("#main-menu > li.active");
                this._openSubMenu(s, 0)
            }
    }, i._handleMenubarLeave = function() {
        e("body").removeClass("menubar-visible"), materialadmin.App.minBreakpoint("md") && e("body").hasClass("menubar-pin") || (e("#menubar").data("expanded", !1), materialadmin.App.isBreakpoint("xs") === !1 && this._closeSubMenu(e("#main-menu")))
    }, i._handleMenuLinkClick = function(n) {
        this.getMenuState() !== a.MENU_MAXIMIZED && n.preventDefault()
    }, i._closeSubMenu = function(n) {
		//console.log("close")
        var a = this;
        n.find("> li > ul").stop().slideUp(170, function() {
			
            e(this).closest("li").removeClass("expanded"), a._evalMenuScrollbar()
        })
    }, i._openSubMenu = function(n, a) {
        var i = this;
        "undefined" == typeof a && (a = 170), this._lastOpened = n, n.addClass("expanding"), n.find("> ul").stop().slideDown(a, function() {
            n.addClass("expanded"), n.removeClass("expanding"), i._evalMenuScrollbar(), e("#main-menu ul").removeAttr("style")
        })
    }, i._invalidateMenu = function() {
        var n = e("#main-menu a.active");
        n.parentsUntil(e("#main-menu")).each(function() {
            e(this).is("li") && (e(this).addClass("active"), e(this).addClass("expanded"))
        }), this.getMenuState() === a.MENU_COLLAPSED && e("#main-menu").find("> li").removeClass("expanded"), e("body").hasClass("menubar-visible") && this._handleMenubarEnter(), e("#main-menu").triggerHandler("ready"), e("#menubar").addClass("animate")
    }, i.getMenuState = function() {
        var n = e("#menubar").css("transform"),
            i = n ? n.match(/-?[\d\.]+/g) : null,
            t = a.MENU_MAXIMIZED;
        return t = null === i ? e("#menubar").width() <= 100 ? a.MENU_COLLAPSED : a.MENU_MAXIMIZED : "0" === i[4] ? a.MENU_MAXIMIZED : a.MENU_HIDDEN
    }, i._evalMenuScrollbar = function() {
        if (e.isFunction(e.fn.nanoScroller)) {
            var n = e("#menubar .menubar-foot-panel").outerHeight();
            n = Math.max(n, 1), e(".menubar-scroll-panel").css({
                "padding-bottom": n
            });
            var a = e("#menubar");
            if (0 !== a.length) {
                var i = e(".menubar-scroll-panel"),
                    t = i.parent();
                t.hasClass("nano-content") === !1 && i.wrap('<div class="nano"><div class="nano-content"></div></div>');
                var l = e(window).height() - a.position().top - a.find(".nano").position().top,
                    s = i.closest(".nano");
                s.css({
                    height: l
                }), s.nanoScroller({
                    preventPageScrolling: !0,
                    iOSNativeScrolling: !0
                })
            }
        }
    }, window.materialadmin.AppNavigation = new a
})(this.materialadmin, jQuery);