cordova-develop-watcher
===
>开发目的是在开发 `cordova` 混合应用时，监视本地文件，当本地文件改变时，刷新 `cordova` 的页面

### 用法

1. 克隆 `git clone https://git.oschina.net/syjefbz/cordova-develop-watcher.git`
2. 安装 `cd cordova-develop-watcher && node link .`
3. 运行 `cordova-watcher -d ./hello`
4. 在 `cordova` 的 `index.html` 中添加 `<script src="http://localhost:3000/client.js"></script>`
