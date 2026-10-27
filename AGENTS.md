## Output Style（always applied）

每次回覆前先讀 `.agents/skills/i-have-adhd/SKILL.md` 並照做。

## 版本管理

功能變更、規則變更、架構調整後，commit 前更新 `md/Version.md`。最新一筆放在 `# Version History` 下面的最上方。

```markdown
## vX.Y.Z — YYYY-MM-DD

### Changes
- 做了什麼、為什麼。
```

Patch 用於文件與小修正。Minor 用於新功能或結構調整。Major 用於破壞性變更。

## 網站

正式網址在 Cloudflare : `https://yogurtguide.wuwaiter.com/`。
本機與 GitHub Pages 的 `base` 是 `/YogurtGuide/`。
Cloudflare 建置設了 `WORKERS_CI=1` 時，`base` 是 `/`。
本機預覽是 `http://localhost:4321/YogurtGuide/`。

不要把 Cloudflare API token 放進 GitHub secrets。

## 內容 

頁面讀 `src/content/**/*.md`。改這些檔之後執行 `npm run build`。

批次來源是 `src/content/batches/*.md`。`npm run batch:sqlite` 只從 Markdown 重建 `data/*.sqlite`。頁面不讀 SQLite。

菌粉頁不放店名與連結。沒有評價寫「沒有評價資訊」，沒有菌種寫「沒有菌種資訊」。價格只留金額、幣別、單位、日期。

隔夜燕麥的份量不明時 `amount`、`unit` 都不寫；寫了 `amount` 就要有 `unit`，範圍用 `amountMax`。單位只能是 `g`、`ml`、`顆`、`湯匙`。寫錯 `npm run build` 會失敗。

App 第 2 階段要讀的清單資料是建置產出的 `app-content/v1/*.json`（尚未實作，規格見 `md/AppPlan.md`）。改內容仍改 Markdown，不要手改 `dist/`。

這一期是網站與 Android。Android 用 Capacitor 包網站：`npm run app:sync` 建置 App 版並同步到 `android/`，`npm run app:debug` 出 debug APK，`npm run app:bundle` 出上架用 AAB。建置需要 JDK 21（本機在 `C:\Users\wuwai\jdk-21`，執行前設 `JAVA_HOME`）。`android/local.properties` 的 `sdk.dir` 用正斜線。
App 版建置設 `CAP_BUILD=1`，`base` 是 `/`，輸出到 `dist-app/`，站內連結改寫成 `.../index.html`。
內容更新靠 Live Update，不必重新上架：`check:deploy` 最後跑 `npm run app:publish`，把 App 版壓成 `dist/app-bundle/<commit>.zip` 並寫 `latest.json`；App 啟動時比對，有新版就下載，下次開 App 生效。
新增 Capacitor 外掛、改權限或圖示這類原生改動，要把 `src/config/platforms.ts` 的 `nativeBuild` 與 `android/app/build.gradle` 的 `versionCode` 一起加 1 並重新上架。
keystore（`*.jks`、`*.keystore`）與 `android/key.properties` 不進版控。iOS 不要執行 `cap add ios`。

