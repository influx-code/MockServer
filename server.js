const http = require("http");
const path = require("path");
const fs = require("fs");

const Mock = require("mockjs");

let server = {
    init() {
        const self = this;
        let app = http.createServer((request, response) => {
            let url = request.url;
            let router = self.getRouter();
            if (!router[url]) {
                // 404
                self.handler404Code(response);
            } else {
                self.getAPIData(request.url)
                    .then(data => {
                        self.handler200Code(response, data);
                    })
                    .catch(error => {
                        console.error(error);
                        self.handler500Code(response);
                    });
            }
        });

        app.listen(3000);
        console.info("mock server start");
    },
    /**
     * 获取接口数据
     * @param {*} url 接口url
     */
    getAPIData(url) {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                let router = self.getRouter();
                let filepath = router[url];
                let data = JSON.parse(
                    fs.readFileSync(path.resolve(__dirname, filepath), "utf-8")
                );
                resolve(Mock.mock(data));
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * 404
     */
    handler404Code(response) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
    },
    /**
     * 500
     */
    handler500Code(response) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Internal Server Error");
    },
    /**
     * 200
     * @param {*} data
     */
    handler200Code(response, data) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(JSON.stringify(data));
    },
    /**
     * 获取路由对象
     */
    getRouter() {
        return JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, "./router.conf.json"),
                "utf-8"
            )
        );
    }
};

server.init();
