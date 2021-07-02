//2021.06.04
import Vue from 'vue';

var vueRouter = function () {
    var clearCache = function (vueComponent) {
        if (vueComponent.$vnode && vueComponent.$vnode.data.keepAlive) {
            if (vueComponent.$vnode.parent && vueComponent.$vnode.parent.componentInstance && vueComponent.$vnode.parent.componentInstance.cache) {
                if (vueComponent.$vnode.componentOptions) {
                    var key = vueComponent.$vnode.key == null ?
                        vueComponent.$vnode.componentOptions.Ctor.cid + (vueComponent.$vnode.componentOptions.tag ? `::${vueComponent.$vnode.componentOptions.tag}` : '') :
                        vueComponent.$vnode.key;
                    var cache = vueComponent.$vnode.parent.componentInstance.cache;
                    var keys = vueComponent.$vnode.parent.componentInstance.keys;
                    if (cache[key]) {
                        if (keys.length) {
                            var index = keys.indexOf(key);
                            if (index > -1) {
                                keys.splice(index, 1);
                            }
                        }
                        delete cache[key];
                    }
                }
            }
        }
        vueComponent.$destroy();
    }

    Vue.mixin({
        beforeRouteEnter(to, from, next) {
            next($vm => {
                //记录路由链
                if (to.params.direction === "go") {
                    $vm.from = to.params.from;
                }
                $vm.route = to;
                vueRouter.currentVM = $vm;
            })
        },
        beforeRouteLeave: function (to, from, next) {
            to.params.animation = to.params.animation || "slideout";
            to.params.direction = to.params.direction || "back";
            if (from && to.params.direction == "go") {
                to.params.from = this;
            } else if (from && to.params.direction == "back") {
                //清除路由链上的全部缓存
                var current = this;
                while (current && current.route.name != to.name) {
                    clearCache(current)
                    current = current.from
                }
            }
            if (from && from.meta.keepAlive === false) {
                clearCache(this)
            }
            next();
        },
        computed: {
            query() {
                var q = {};
                for (var propertyName in this.$route.query) {
                    q[propertyName] = JSON.parse(unescape(this.$route.query[propertyName]));
                }
                return q;
            },
            params() {
                return this.$route.params;
            }
        },
        methods: {
            go(routeName, query, params) {
                var defaultParams = {
                    animation: "slidein",
                    direction: "go"
                }
                defaultParams = { ...defaultParams, ...params };
                var q = {};
                if (typeof query == "object") {
                    for (var propertyName in query) {
                        q[propertyName] = escape(JSON.stringify(query[propertyName]));
                    }
                }
                this.$router.push({
                    name: routeName,
                    query: q,
                    params: defaultParams,
                });
            },
            back(routeName) {
                var that = this;
                if (routeName) {
                    var current = that;
                    while (!current.route) {
                        current = current.$parent;
                    }
                    var backCount = 0;
                    var finded = false;
                    while (current && !(finded = (current.route.name == routeName))) {
                        backCount++;
                        current = current.from;
                    }
                    if (finded) {
                        this.$router.go(-backCount);
                    } else {
                        throw new Error("未在路由上找到此页面");
                    }
                } else {
                    this.$router.back();
                }
            }
        }
    });
}

export default vueRouter