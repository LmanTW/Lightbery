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
  * [addPlugin(Plugin)](#addplugin)
  * [getImageInfo(imageID)](#getimageinfo)
  * [getImageData(imageID)](#getimagedata)
  * [search(query, type)](#search)
  * [add(imageID)](#add)
  * [checkImagesData(images)](#checkimagesdata)
  * [checkRepeatImages()](#checkrepeatimages)
* [內建插件](#內建插件)
   * [CLI](#cli)
* [資料格式](#資料格式)
  * [圖片資訊](#圖片資訊)
  * [圖片資料](#圖片資料)

# Lightbery
```js
new Lightbery(path, options) //加載一個 Lightbery
```
* `path <string>`｜Lightbery 所在的路徑
* `options <undefined, object>`｜Lightbery 的選項
  * `networkThread <number>`｜網路的線程數 `預設為: 5`
  * `workerThread <number>`｜Worker的線程數 `預設為: 該設備的線程數`
  
> [!NOTE]
> 如果你要創建一個新的 Lightbery，只需要創建一個新的資料夾，然後將 path 設為該資料夾的路徑即可，Lightbery 會自動幫你生成所有的檔案。

## size
```js
.size //取得圖庫的大小 (圖片數)
```

## addPlugin()
```js
.addPlugin(Plugin, options) //添加插件        
```
* `Plugin <class>`｜一個插件的 <class>
* `options <undefined, any>`｜插件的選項

> 返回 Plugin

## getImageInfo()
```js
await .getImageInfo(imageID) //取得圖片的資訊
```
* `imageID <string>` //圖片的 ID

> 返回 [圖片資訊](#圖片資訊)

## getImageData()
```js
await .getImageData(imageID) //取得圖片的資料 (如圖片儲存路徑, 圖片 buffer 等)
```
* `imageID <string>` //圖片的 ID

> 返回 [圖片資料](#圖片資料)

## search()
```js
.search(query, type) //搜尋圖片
```
* `query <array>`｜搜尋的關鍵字 (一個包含關鍵字的陣列)
* `type <undefined, string>`｜搜尋的類型 (title, author, tags)

> 返回一個包含所有搜尋到的圖片的ID的陣列

## add()
```js
await .add(imageID) //添加圖片
```
* `imageID <string>`｜圖片的 ID

> [!NOTE]
> Lightbery 只能儲存單張圖片，如果你讓它下載一個包含多頁的 Pixiv 插畫，他只會下載第一張。

> 當在添加圖片的時候發生錯誤，他會返回 { error: true, content: <string> }，如果沒有發生錯誤則會返回 { error: false }

## checkImagesData()
```js
await .checkImagesData(images) //檢查圖片的資料
```
* `images <array>`｜要檢查的圖片 (一個包含圖片 ID 的陣列)

> 返回 `<undefined>`

## checkRepeatImages()
```js
await .checkRepeatImages() //檢查是否有重複的圖片
```

> 返回 `<undefined>`

> [!NOTE]
> 在第一次進行重複圖片檢查的時後可能會花費較長的時間，因為它需要創建所有圖片的像素資料。

# 內建插件

## CLI
內建的命令行介面，你可以用它來新增, 檢查, 移除圖片
```js
const { Lightbery, Plugins } = require('./Lightbery/API')    //導入 Lightbery 與 Plugins

let myLightbery = new Lightbery(`${__dirname}/My Lightbery`) //加載一個 Lightbery
myLightbery.addPlugin(Plugins.CLI)                           //添加插件 CLI (命令行介面)
```

**依賴**
> * Log (內建)

# 資料格式

## 圖片資訊
```js
{
  id: <string>, //圖片的 ID
  url: <string>, //圖片的下載網址
  width: <number>, //圖片的寬度
  height: <number>, //圖片的高度
  title: <string>, //圖片的標題
  description: <string>, //圖片的描述
  tags: <array>, //圖片的標籤
  author: {
    id: <string>, //作者的 ID
    name: <string> //作者的名稱
  },
  ai: <boolean> //圖片是否為 AI 創作
}
```

## 圖片資料
```js
{
  imagePath: <string>, //圖片的儲存路徑
  width: <number>, //圖片的寬度
  height: <number>, //圖片的高度
  data: <buffer> //圖片的 buffer
}
```
