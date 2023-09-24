# Lightbery
> Lightbery (Library 的諧音，~~我喜歡給我每個專案都加上一個 Light~~) 是一個基於 Pixiv 的圖庫系統，它擁有內建的 CLI 介面來管理圖庫，也有內建的網頁 APP 來瀏覽圖庫。

## 範例
```js
const { Lightbery, Plugins } = require('./Lightbery/API')    //導入 Lightbery 與 Plugins

let myLightbery = new Lightbery(`${__dirname}/My Lightbery`) //加載一個 Lightbery
myLightbery.addPlugin(Plugins.CLI)                           //添加插件 CLI (命令行介面)
```

# 目錄
* [Lightbery](#lightbery)
  * [size](#size)
  * [addPlugin()](#addplugin)
  * [getImageInfo()](#getimageinfo)
  * [getImageData()](#getimagedata)
  * [search()](#search)
  * [add()](#add)
* [內建插件](#內建插件)
* [插件 API]()

# Lightbery
```js
new Lightbery(path, options) //加載一個 Lightbery
```
* `path <string>`｜Lightbery 所在的路徑
* `options <object>`｜Lightbery 的選項
  * `networkThread <number>`｜網路的線程數 `預設為: 5`
  * `workerThread <number>`｜Worker的線程數 `預設為: 該設備的線程數`
  
> [!NOTE]
> 如果你要創建一個新的 Lightbery，只需要創建一個新的資料夾，然後將 path 設為該資料夾的路徑即可，Lightbery 會自動幫你生成所有的檔案

## size
```js
.size //取得圖庫的大小 (圖片數)
```

## addPlugin()
```js
.addPlugin(Plugin, options) //添加插件        
```
* `Plugin <class>`｜一個插件的 <class>
* `options <any>`｜插件的選項

## getImageInfo()
```js
.getImageInfo(imageID) //取得圖片的資訊
```
* `imageID <string>` //圖片的 ID

 

## getImageInfo

# 內建插件

# Plugin API
