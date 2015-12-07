function injectScript(source) {
    var elem = document.createElement("script"); //Create a new script element
    elem.type = "text/javascript"; //It's javascript
    elem.innerHTML = source; //Assign the source
    document.documentElement.appendChild(elem); //Inject it into the DOM
}
injectScript("(" + (function () {
    var domain = function () {
        return /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/;
    };
    var log = function () {
        var allLinks = Array.apply(null, document.links);
        for (var _i = 0; _i < allLinks.length; _i++) {
            var link = allLinks[_i];
            console.debug(link.innerHTML);
        }
    };
    var highlight = function () {
        var selectors = 'div[class="largetitle"] h3 a, a[class="ListingCard___cardTitle"], .SearchResults-propertyIdentifierLink:not(.awesome)';
        var allLinks = Array.apply(null, document.querySelectorAll(selectors));
        console.log("FOUND LINKS", allLinks.length);
        for (var _i = 0; _i < allLinks.length; _i++) {
            var link = allLinks[_i];
            console.log(domain().test(link.innerText.toLowerCase()), link.innerText.toLowerCase());
            if (domain().test(link.innerText.toLowerCase())) {
                var thelink = document.createElement('a');
                thelink.innerHTML = "<i class='ListingHero-propertyIdentifierLinkIcon'></i>";
                thelink.href = 'http://' + link.innerText.toLowerCase().trim();
                console.log("ADD LINK TO", link.parentNode);
                link.className += ' awesome';
                link.appendChild(thelink);
            }
        }
    };
    if (document.location.pathname.indexOf('websites') > 0) {
        highlight();
    }
    function bindResponse(request, response) {
        request.__defineGetter__("responseText", function () {
            console.warn('Something tried to get the responseText');
            console.debug(response);
            return response;
        });
    }
    function processResponse(request, caller, method, path) {
        bindResponse(request, request.responseText);
    }
    var proxied = window['XMLHttpRequest'].prototype.open;
    window['XMLHttpRequest'].prototype.open = function (method, path, async) {
        var caller = arguments.callee.caller;
        this.addEventListener('readystatechange', function () {
            console.log('Ready State chnged', this.readyState, path);
            if (this.readyState === 4) {
                if (path.indexOf('listings?access_token') > 0) {
                    console.log('HAHAHA', path);
                    //log();
                    setTimeout(function () {
                        highlight();
                    }, 1000);
                }
            }
            console.log('FINISHED', path);
            processResponse(this, caller, method, path);
        }, true);
        return proxied.apply(this, [].slice.call(arguments));
    };
}).toString() + ")()");
