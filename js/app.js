var vueApp = new Vue({
    el: '#vue-app',
    data: {
        urls: "",
        endpoints: "",
        json: "",
        headers: ""
    },
    methods: {
        addEndpoint: function(event) {
            var endpoints = this.endpoints.split("\n").filter(function(el) {
                return el !== '';
            });
            endpoints.push(event.path[0].outerText);
            this.endpoints = endpoints.join("\n");
        },
        addUrl: function(event) {
            var urls = this.urls.split("\n").filter(function(el) {
                return el !== '';
            });
            urls.push(event.path[0].outerText);
            this.urls = urls.join("\n");
        },
        addHeader: function(event) {
            var headers = this.headers.split("\n").filter(function(el) {
                return el !== '';
            });
            headers.push(event.path[0].outerText);
            this.headers = headers.join("\n");
        },
        copy: function(event) {
            navigator.clipboard.writeText(event.path[0].outerText);
        },
        update: function() {
            let parts = this.input.split(/[ ]+/).map(function(item) {
                return item.trim();
            })
            this.namespace = parts[0];
            this.podId = parts[1];
        }
    },
    beforeMount() {

    },
    computed: {
        commands: function() {
            var t = this;
            var commands = [];
            this.urls.split("\n").map(function(url) {
                t.endpoints.split("\n").map(function(endpoint) {
                    var parts = ['curl '];
                    var headrs = t.headers.split("\n").map(function(header) {
                        if (header) {
                            var headerParts = header.split(':');
                            if (headerParts.length === 2) {
                                return " -H '" + headerParts[0] + ": " + headerParts[1] + "'";
                            }
                        }
                        return ''
                    });
                    var endpointParts = endpoint.replace(/\s+/g, ' ').trim().split(" ");
                    if (endpointParts.length === 2) {
                        var method = endpointParts[0].toUpperCase();
                        parts.push(' -X ' + method + ' ')
                        parts.push('"' + url.trim() + endpointParts[1].trim() + '"'.trim());
                        if (t.json && ['POST', 'PUT', 'DELETE'].includes(method)) {
                            headrs.push(' -H \'Content-type: application/json\'')
                            parts.push(' -d\'' + JSON.stringify(JSON.parse(t.json)) + '\'')
                        }
                    } else {
                        parts.push('"' + url.trim() + endpoint.trim() + '"'.trim());
                    }
                    parts.push(headrs.join(' '))
                    commands.push(parts.join(''));
                })
            })

            return commands;
        },
    }
});