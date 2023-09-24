# Lightbery
Lightbery (Library的諧音) 是一個基於 Pixiv 的圖庫系統，它擁有內建的 CLI 介面來管理圖庫，你也可以使用內建的網頁 APP 來瀏覽圖庫。

## 範例
```js
const { Lightbery, Plugins } = require('./Lightbery/API')    //導入 Lightbery 與 Plugins

let myLightbery = new Lightbery(`${__dirname}/My Lightbery`) //加載一個 Lightbery
myLightbery.addPlugin(Plugins.CLI)                           //添加插件 CLI (命令行介面)
```

# 目錄
* [Lightbery()](#lightbery)
* [Plugin API]()

# Lightbery
```js
new Lightbery(path, options) //加載一個 Lightbery
```
* `path <string>`｜Lightbery 所在的路徑
* `options <object>`｜Lightbery 的選項
  * `networkThread <number>`｜網路的線程數 `預設為: 5`
  * `workerThread <number>`｜Worker的線程樹 `預設為: 該設備的線程數`
  
> 如果你要創建一個新的 Lightbery，只需要創建一個新的資料夾，然後將 path 設為該資料夾的路徑即可，Lightbery 會自動幫你生成所有的檔案

# Plugin API
