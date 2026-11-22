# FallenStars-download

FallenStars 的下载网站（GitHub Pages）和安装包（GitHub Releases）。

## 网站
- `index.html` / `style.css` / `main.js`，背景在 `assets/`。
- 文字（含简介 `intro`）都在 `main.js` 的 `TEXT` 里，中英各一份。
- 开启：仓库 Settings → Pages → Source 选 *Deploy from a branch*，分支 `main`，文件夹 `/ (root)`。

## 公告
- 服务器上线后：`main.js` 顶部的 `SERVER_URL` 填服务器地址（https），网站就显示和游戏里一样的公告（后台 /admin/notices.html 发的）。
  服务器要允许网站地址：配置 `Website:Origins`，默认 `https://akane13.github.io`。
- 服务器上线前：公告写在 `notices.json`，例如：

```json
{
  "notices": [
    { "kind": "Notice", "title": "Chapter 2 is here", "titleZh": "第二章开放",
      "body": "", "bodyZh": "新的主线章节已经开放！", "showAtUnix": 1795300000 }
  ]
}
```

`kind` 是 `Notice`（公告）/ `Maintenance`（维护）/ `Update`（更新）；`showAtUnix` 是发布时间（Unix 秒），最新的排最上面。英文空着时显示中文。

## 发新版
1. 游戏里打包：Unity 菜单 FallenStars → Build → Android APK；`python tools/launcher/make_launcher_package.py`。
2. 在这个文件夹运行 `prepare-release.ps1`，两个文件会以固定名字放进 `release-files/`。
3. GitHub → Releases → Draft a new release，填版本号（如 `v1.0.1`），把两个文件拖进去，Publish。
4. 网站的按钮自动指向最新版本，不用改网页。

文件名必须是 `FallenStars-Launcher.zip` 和 `FallenStars.apk`。
