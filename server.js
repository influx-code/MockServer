const http = require("http");
const path = require("path");
const fs = require("fs");

const Mock = require("mockjs");

class MockSever {
    /**
     * 初始化
     */
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
                        self.handler500Code(response, error);
                    });
            }
        });
        app.listen(3000);
        console.info("mock server start");
    }

    /**
     * 获取接口数据
     * @param {String} url 接口url
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
    }

    /**
     * 404
     * @param {Object} response
     */
    handler404Code(response) {
        response.writeHead(404, {
            "Content-Type": "application/json; charset=utf-8"
        });
        response.end("Not Found");
    }

    /**
     *
     * @param {Object} response
     * @param {String} error 错误信息
     */
    handler500Code(response, error) {
        response.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8"
        });
        response.end(`Internal Server Error\n${error}`);
    }

    /**
     * 200
     * @param {Object} response
     * @param {Object} data 返回数据
     */
    handler200Code(response, data) {
        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });
        response.end(JSON.stringify(data));
    }

    /**
     * 动态获取路由配置
     */
    getRouter() {
        return JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, "./router.conf.json"),
                "utf-8"
            )
        );
    }
}

new MockSever().init();
