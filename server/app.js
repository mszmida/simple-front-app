"use strict"

const koa = require("koa"),
    route = require("koa-route"),
    send = require("koa-send");


const app = koa(),
    port = 3000;


// simple request logger
app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// application error handler
app.on('error', function(err, ctx){
    console.log('server error', err, ctx);
});

// serving index.html file for '/' path
app.use(route.get("/", function *() {
    this.set("Content-Security-Policy", "default-src 'self';");

    yield send(this, "index.html", { root: "src/app" });
}));

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});
