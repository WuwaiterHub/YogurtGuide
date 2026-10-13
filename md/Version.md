# Version History

## v0.9.16 — 2026-10-11

### Changes
- 批次 b022（2026/10/08）加上兩張照片：優比特500 菌粉包裝、成品凝乳。

## v0.9.15 — 2026-10-11

### Changes
- `AGENTS.md` 只留代理規則：回覆格式、版本紀錄、正式網址、Markdown 為批次來源、共用 skill 不可寫入專案專名。回覆格式縮成 3 條，全文改讀 i-have-adhd skill。
- `README.md` 改寫給人看的說明，並修正正式網址、雙邊部署與 SQLite 副本的描述。

## v0.9.14 — 2026-10-11

### Changes
- 移除「新增批次」匯入工具：`新增批次.bat`、`scripts/import-batch.mjs`、`tests/import-batch.test.mjs` 與 `npm run batch:import`。
- 批次仍直接維護 `src/content/batches/*.md`。SQLite 副本仍用 `npm run batch:sqlite` 從 Markdown 重建。

## v0.9.13 — 2026-10-01

### Changes
- 正式網址定為 `https://yogurtguide.wuwaiter.com/`。Cloudflare 建置產出 sitemap；每頁 canonical 與 Open Graph 都指到這個網址。
- Cloudflare 靜態資源加上 nosniff、Referrer-Policy、禁止被 iframe。
- 字型改放 `public/fonts/`，不再向 Google Fonts 請求。
- GitHub Actions 改釘 commit SHA。

## v0.9.12 — 2026-09-30

### Changes
- 18 筆批次 Markdown 轉入 SQLite，一表一檔：`data/batches.sqlite`、`data/batch_ingredients.sqlite`、`data/batch_photos.sqlite`。頁面仍讀 Markdown。

## v0.9.11 — 2026-09-30

### Changes
- Gitleaks 改為直接執行 `gitleaks detect`（v8.30.1），不再用會對 PR 留言的 action。Dependabot 的 PR 不會再因留言失敗而中斷。

## v0.9.10 — 2026-09-30

### Changes
- CICD skill 補上：遠端用 `npm ci`、權限只開給部署 job、action 釘 commit SHA、禁止 `pull_request_target` 與把 PR 內容拼進 shell。

## v0.9.9 — 2026-09-30

### Changes
- PR 的 CI 改跑 gitleaks 與 `check:deploy`，與正式部署同一套檢查，仍不部署。過期的 PR 檢查會取消，job 上限 15 分鐘。
- 加入 Dependabot（npm 與 GitHub Actions，每週）。
- `wrangler` 釘在 devDependency，避免 Cloudflare 每次抓最新版。

## v0.9.8 — 2026-09-29

### Changes
- 部署檢查收成 `npm run check:deploy`。GitHub Pages 與 Cloudflare 分開跑這支指令；Cloudflare 不使用 GitHub 上的 API token。
- `wrangler.toml` 改成 Workers 靜態資源（`[assets] directory = "./dist"`），修正 Cloudflare `wrangler deploy` 找不到 entry-point。
- Cloudflare 建置時（`WORKERS_CI=1`）`base` 改為 `/`；GitHub Pages 維持 `/YogurtGuide/`。

## v0.9.7 — 2026-09-29

### Changes
- 刪除 GitHub Actions 的 deploy-cloudflare。Cloudflare Pages 改由 Cloudflare 自己的 Git 連線部署；GitHub Pages 仍等 deploy.yml 的檢查通過才上線。

## v0.9.6 — 2026-09-27

### Changes
- 新增批次 b018（2026/09/27）：優比特50菌粉、義美全脂 400 ml + Synlait 脫脂 40 ml／水 260 ml；42°C 發酵 11 h。凝乳 8、質地 8、酸度 3。容易析出較多乳清。

## v0.9.5 — 2026-09-28

### Changes
- GitCommit 收進 commit 前驗證（`test:ci`，改了內容再 `build`），並刪除 PreCommitCheck。

## v0.9.4 — 2026-09-23

### Changes
- 新增批次 b017（2026/09/23）：Long Skyr 傳代第 1 次 60 ml、義美全脂 350 ml、室溫 28°C 發酵 12 h；冷藏至隔天 20:00。凝乳 8、質地 7、酸度 3。

## v0.9.3 — 2026-09-22

### Changes
- 新增批次 b016（2026/09/22）：川秀60菌傳代第 1 次 60 ml、義美全脂 400 ml + Synlait 脫脂 40 ml／水 260 ml；與 b015 分數相同（凝乳／質地 8、酸度 4）。

## v0.9.2 — 2026-09-20

### Changes
- 新增批次 b015（2026/09/20）：川秀60菌粉、義美全脂 350 ml + Synlait 脫脂 40 ml／水 260 ml；8 h 仍水狀，12.5 h 凝乳 8/10。

## v0.9.1 — 2026-09-12

### Changes
- 新增批次 b013（2026/09/09）：川秀7菌老酸奶菌粉、義美全脂 350 ml + 豐力富 45 ml；發酵過頭後加鹽濾成希臘酸奶。
- 新增批次 b014（2026/09/10）：川秀7菌老酸奶傳代第 1 次 60 ml、義美全脂 200 ml + 豐力富 80 ml。

## v0.9.0 — 2026-09-11

### Changes
- 新增 CI/CD：commit 必跑單元測試、push 檢查 gitignore 與安全性，main 部署 GitHub Pages 與 Cloudflare Pages。

## v0.8.41 — 2026-09-07

### Changes
- 編號菌株說明補上川秀、比優特有標示的 BB-12、LGG、Bi-07。

## v0.8.40 — 2026-09-07

### Changes
- 編號菌株「說明」改為直接寫產品；無產品則留空，不再寫台灣未見／無常態販售。

## v0.8.39 — 2026-09-07

### Changes
- 常見編號菌株表去掉「使用型態」；「乳製品用途」改為「說明」，改列台灣可見產品。

## v0.8.38 — 2026-09-07

### Changes
- 批次 b012（2026/09/05）加上成品照片。

## v0.8.37 — 2026-09-07

### Changes
- 批次 field note 左側「field note」改貼左緣 gutter，不再蓋住 set／acidity／temperature。

## v0.8.36 — 2026-09-07

### Changes
- 新增批次 b012（2026/09/05）：比優特 300億菌粉、義美全脂 350 ml + 豐力富 45 ml。

## v0.8.35 — 2026-09-07

### Changes
- 燕麥種類表：傳統厚片燕麥說明中「優格碗最常見」加粗。

## v0.8.34 — 2026-09-07

### Changes
- 燕麥「挑選與吃法四點」對齊種類表：快熟不當首選、優格拌料算澱粉、拌優格≠熱煮溶出。

## v0.8.33 — 2026-09-07

### Changes
- 燕麥詳情：常見種類與比較表合併為「燕麥種類」（中英分欄）；表中移除燕麥奶；GI 說明改放表後；刪除禾凌診所出處句。

## v0.8.32 — 2026-09-07

### Changes
- 燕麥詳情頁先列常見種類（含燕麥米、燕麥麩皮、黑麥麩皮），並加比較表：GI 範圍與是否可加入優格。

## v0.8.31 — 2026-09-06

### Changes
- 原型食材「燕麥」改為列表 2–3 句簡介，詳情另頁；補鋼切/厚片排序、取代主食、60–80 g 與 3 g β-葡聚醣、熱煮、燕麥奶、Granola 添加物與優格吃法。

## v0.8.30 — 2026-09-06

### Changes
- 原型食材新增洋車前子殼（psyllium husk）。

## v0.8.29 — 2026-09-06

### Changes
- 益生元 8 筆改回單一列表，不再分「證據較完整／候選纖維」。

## v0.8.28 — 2026-09-06

### Changes
- 益生元列表分成「證據較完整」（菊粉、GOS、FOS、乳酮糖）與「候選纖維」（XOS、PHGG、聚葡萄糖、難消化性麥芽糊精）；8 筆均為難消化醣類，後段不當成與菊粉同等確立。

## v0.8.27 — 2026-09-06

### Changes
- 搭配頁導言只保留「整理自公開搭配文與食譜」。

## v0.8.26 — 2026-09-06

### Changes
- 搭配頁「可添加的單品」更名為「原型食材」；條目「燕麥/Granola」更名為「燕麥」（內文仍說明 Granola）。

## v0.8.25 — 2026-09-06

### Changes
- 搭配頁區塊改為：1 可添加的單品、2 益生元（原添加物）、3 搭配組合。

## v0.8.24 — 2026-09-06

### Changes
- 搭配頁排序：添加物改為菊苣纖維、半乳寡糖，其後仍為果寡糖、木寡糖、PHGG、乳酮糖、聚葡萄糖、難消化性麥芽糊精。
- 可添加的單品只留燕麥/Granola、奇亞籽、亞麻籽粉。
- 搭配組合刪除「水果」分組。

## v0.8.23 — 2026-09-05

### Changes
- 添加物新增聚葡萄糖、難消化性麥芽糊精（抗性糊精；註明 ≠ 普通麥芽糊精）。

## v0.8.22 — 2026-09-05

### Changes
- 添加物新增果寡糖（FOS）、半乳寡糖（GOS）、木寡糖（XOS）；並補水解瓜爾膠（PHGG）、乳酮糖。
- 更新菊苣纖維說明：定位為長鏈菊粉，短鏈改指向果寡糖頁；發酵前後、家用 1% 與文獻劑量上限仍保留。

## v0.8.21 — 2026-09-05

### Changes
- 搭配頁將「燕麥片」與「穀物麥片/Granola」合併為一項，依全穀燕麥（鋼切/厚片）、份量替換、熱煮、燕麥奶≠全穀、Granola 隱性糖油等說明更新。

## v0.8.20 — 2026-09-04

### Changes
- 首頁 hero 拿掉 `field notes`；恢復手寫 Yogurt 為主標；「優格製程筆記」與 `yogurt process notes` 同為等寬小標、排在手寫字下方。

## v0.8.19 — 2026-09-03

### Changes
- 依 mono-color-skill 調整全站視覺：內文底改 Neutral White `#FAFAF7`（移除整頁藍漸層洗底），Powder Blue 只留 hero 色帶與規則線。
- 新增第二墨 Signal Red `#C83232`，僅用於現行導覽底線、市售星標、field note 備註標籤、列表 hover 左規則。
- 首頁 hero 主標改 serif「優格製程筆記」，mono 支援行 `yogurt process notes`，手寫字降為次要註記 `field notes`。
- 去裝飾：header 取消 blur/陰影改實色紙底＋細線；QR 去圓角陰影；`record-chips` 改 rule + mono；`record-block` 去淡藍底。
- 內頁 masthead 由全寬藍漸層改為大標題＋左側 Powder Blue 色條＋細規則線。
- 社群圖示由黑色圓鈕改為炭色線框方形。

## v0.8.18 — 2026-09-03

### Changes
- Skill 資料夾改名：`.agents/skills/mono-color/` → `.agents/skills/mono-color-skill/`（frontmatter `name` 同步）。

## v0.8.17 — 2026-09-03

### Changes
- 全站內容將全形「／」統一改為半形「/」（src 內 43 個檔）。

## v0.8.16 — 2026-09-03

### Changes
- 將 [mono-color-skill](https://github.com/yanliudesign/mono-color-skill) 安裝為專案 Skill：`.agents/skills/mono-color-skill/`（含 design-system／swatches／examples）。

## v0.8.15 — 2026-09-03

### Changes
- 新增批次實驗 2026/09/02：義美全脂＋豐力富、莫凡彼希臘式優格 50ml 作 starter、42°C×13h；凝乳 7／質地 8／酸度 5，觀察明顯 EPS 與偏明顯酸味。

## v0.8.14 — 2026-09-03

### Changes
- 統一三款市售優格標示格式：莫凡彼／科克蘭／心樸的成分標示與乳源用語。

## v0.8.13 — 2026-09-03

### Changes
- Footer Instagram QR 中央圖示改為官方風格漸層圓底＋白相機；Threads 仍為黑圓白圖示。

## v0.8.12 — 2026-09-03

### Changes
- 市售優格新增「莫凡彼 希臘式優格（無加糖／原味）」：成分牛奶＋四活菌，列 ★★；註明有糖口味不符推薦條件。

## v0.8.11 — 2026-09-03

### Changes
- 首頁 hero 上方留白縮為約原本 2/3（min-height 78vh→52vh）。

## v0.8.10 — 2026-09-03

### Changes
- 首頁 hero 社群改回黑圓圖示；footer 維持 QR。
- Footer 文案改為「中文記述…」在上、「YogurtGuide — …」在下；QR 靠右。

## v0.8.9 — 2026-09-03

### Changes
- Instagram／Threads 改為黑色系可掃描 QR（中央白圖示圓標），點擊仍開啟對應連結。

## v0.8.8 — 2026-09-03

### Changes
- Instagram／Threads 圖示恢復為黑圓白圖示（撤銷漸層版）。

## v0.8.7 — 2026-09-03

### Changes
- Instagram／Threads 圓形圖示改為 Instagram 風格漸層（黃橙→洋紅→紫）＋白圖示。

## v0.8.6 — 2026-09-03

### Changes
- 首頁「Yogurt」改 Rock Salt；「優格製程筆記」放大一級。
- Instagram／Threads 改為圓形黑底白圖示連結（首頁 hero 與全站 footer）。

## v0.8.5 — 2026-09-03

### Changes
- 首頁 hero：「Yogurt」改手寫字體（Caveat），與「優格製程筆記」之間加一行間距。

## v0.8.4 — 2026-09-03

### Changes
- 批次 field note 移除溫度圓框；右側改固定手繪風格優格圖，不再使用下方批次照片。

## v0.8.3 — 2026-09-03

### Changes
- 批次詳情頁移除「完整紀錄」摺疊，field note 下方直接顯示完整欄位與照片。

## v0.8.2 — 2026-09-03

### Changes
- 首頁 hero 改為純文字 wordmark，移除帶色塊底的 logo 圖，避免與背景疊出矩形。
- 批次詳情頁改為 field note 雙欄版面（大日期、等寬參數、右側網點照片）；完整紀錄收進可展開區塊。

## v0.8.1 — 2026-09-03

### Changes
- 全站內頁補強 Powder Blue：標題全寬色塊、紙面底色加深、導覽底線、列表左側強調與區塊淡藍底。

## v0.8.0 — 2026-09-03

### Changes
- 網站視覺改為 Powder Blue 編輯印刷風（中性白／冷灰底＋`#9EB8D3` 主色＋炭灰字）。
- 導覽改用白底 logo、首頁 hero 改用色塊底 logo；favicon 同步更新。
- 改版前綠系主題備份於本機 `.backup/theme-green-20260903/`（已 gitignore）。

## v0.7.5 — 2026-09-01

### Changes
- 保留 2026/08/31 的 b010 批次，移除內容完全相同的重複批次 b011。

## v0.6.20 — 2026-08-29

### Changes
- 新增批次實驗 2026/08/28：戀職人全脂鮮奶＋豐力富奶粉、川秀60菌傳代第 1 次、保溫小冰箱 42°C×9h。

## v0.6.19 — 2026-08-29

### Changes
- 批次菌種顯示：缺少容量時不再標「容量未記」，改為直接省略容量。

## v0.6.18 — 2026-08-28

### Changes
- 統一全部批次的菌種格式為「來源（內容）」：市售優格顯示名稱與容量、菌粉顯示品牌與種類、傳代顯示菌種、次數與容量。
- 歷史批次缺少傳代容量時明確標示「容量未記」。

## v0.6.17 — 2026-08-27

### Changes
- 更正 2026/08/26 批次的川秀60菌為新開封菌粉，不是留存母種。

## v0.6.16 — 2026-08-27

### Changes
- 修正 2026/08/26 批次菌種為川秀60菌留存母種。

## v0.6.15 — 2026-08-27

### Changes
- 新增 2026/08/26 批次紀錄，並自本批次起註明酸度分數越高代表越酸。

## v0.6.14 — 2026-08-27

### Changes
- 移除優格種類、菌種與菌株及優格單項頁的頁籤切換列。

## v0.6.13 — 2026-08-26

### Changes
- 優格種類頁移除「溫度 × 型態矩陣」及其補充說明。

## v0.6.12 — 2026-08-26

### Changes
- 全專案資料一致性稽核：補正 README 的實際資料位置、本機背景伺服器指令與 base path。
- 修正「傳代」「巴氏殺菌」「乳酸菌」「希臘式」詞彙中過度固定或定義混用的敘述。
- Milk Kefir 與 Water Kefir 統一以「概述（Overview）」作為第一個內容章節。
- Water Kefir 的 *Lactobacillus nagelii* 更新為 2020 年後現行學名 *Liquorilactobacillus nagelii*，並保留舊名對照。
- 校正版本歷史的編號菌株筆數：實際資料為 62 筆，不是 63 筆。
- 將「高溫巴氏後接種法」更名為「高溫預熱後接種法」，避免混淆巴氏殺菌與優格凝膠用高溫預處理。
- 標準優格的傳代提示改依供應商說明與實際表現判斷，不再宣稱活性必然逐代下降。

## v0.6.11 — 2026-08-25

### Changes
- 添加物清單加入與可添加單品相同的群組縮排，使菊苣纖維與 Za’atar 左側對齊。

## v0.6.10 — 2026-08-25

### Changes
- 添加物卡片改用與可添加單品一致的標題、英文副標與內文格式，並保留詳細頁連結。

## v0.6.9 — 2026-08-25

### Changes
- 搭配頁的可添加單品改為每種食材獨立顯示，不再以斜線或加號合併多個項目。
- 從可添加單品移除水果分類；水果搭配組合維持不變。

## v0.6.8 — 2026-08-25

### Changes
- 修正優格與替代菌種優格的 Codex 定義，補充食品名稱、物種與菌株的層級關係。
- 修正 Ayran 的標準兩菌與製程定位，補齊 Piimä、希臘優格菌粉的菌相說明。
- 移除固定「3–5 代」通則，改以供應商說明與實際發酵表現判斷傳代。
- 為 DIY／商品型名稱增加分類註記，並在編號菌株表標示活菌與熱處理菌體使用限制。

## v0.6.7 — 2026-08-25

### Changes
- 新增專案專用 ELI5 Skill，支援繁體中文零基礎解釋與按需圖解。
- 將 ELI5 Skill 改為通用回答方式，移除 YogurtGuide、Astro 與 Markdown Content Collections 專案限定。
- ELI5 只調整解釋深度與表達形式，不改變任務範圍、工具、權限或領域規則。

## v0.6.6 — 2026-08-25

### Changes
- 批次 2026/08/24：發酵設備改為「保溫小冰箱 固定 42度」。

## v0.6.5 — 2026-08-25

### Changes
- 批次 2026/08/21：發酵設備改為「保溫小冰箱, 固定42度」；牛奶改為「鮮奶 700ml(義美全脂), 鮮奶先煮約 7–8 分鐘」。

## v0.6.4 — 2026-08-25

### Changes
- 批次牛奶顯示：奶粉＋水改為「奶粉 總量 (品牌奶粉 x + 水 y)」，例如「奶粉 700ml (豐力富全脂奶粉 100ml + 水 600ml)」。

## v0.6.3 — 2026-08-25

### Changes
- 批次實驗 2026/08/24 加上成品照片。

## v0.6.2 — 2026-08-25

### Changes
- 新增批次實驗 2026/08/24：豐力富全脂奶粉＋水、心樸優格 120 ml 當 starter、保溫小冰箱 42°C×10h。

## v0.6.1 — 2026-08-25

### Changes
- 常見編號菌株由 10 組擴充為 62 個可追溯菌株，補上現行學名、舊名、乳品用途、核心／附加菌定位與逐筆來源。
- 編號菌株改由獨立 TypeScript 資料檔管理，頁面自動顯示筆數。
- 「資料來源」改為依菌株資料自動去重彙整，含新補入的統一 LP33、森永 B-3、FDA GRAS 等連結。
- 補充附加菌物種對照，並讓大型菌株表格可在窄螢幕水平捲動。

## v0.6.0 — 2026-08-25

### Changes
- 主導覽將原「菌種」拆成「優格種類」與「菌種」兩個分頁。
- 優格種類頁整合適溫、產品風格、反復接種與原接種型態內容。
- 菌種頁整合核心種、附加菌、常溫菌、酵母／真菌分類，並新增 10 組可核實的編號菌株與來源。

## v0.5.2 — 2026-08-24

### Changes
- 批次實驗 2026/08/21 加上成品照片。

## v0.5.1 — 2026-08-24

### Changes
- 新增批次實驗 2026/08/21：義美全脂鮮奶 700 ml、川秀 100 菌傳代第 1 次、保溫小冰箱 42°C。

## v0.5.0 — 2026-08-24

### Changes
- 搭配頁新增「3. 添加物」，第一項為菊苣纖維（菊粉／FOS）；列表只顯示一句用法，細節在獨立頁並對照公開論文。

## v0.4.3 — 2026-08-23

### Changes
- 搭配頁新增「水果」組：莓果蜂蜜碗、香蕉肉桂、芒果奇亞、奇異果清爽、蘋果肉桂堅果，以及對應單品。

## v0.4.2 — 2026-08-10

### Changes
- 移除首頁 Hero 的「查看批次實驗」與「方法論」按鈕。
- 首頁 Hero 副標題在桌面版維持單行，窄螢幕保留自動換行以避免溢出。

## v0.4.1 — 2026-08-09

### Changes
- 統一市售優格「其他常見款」與推薦商品的資訊分類順序及欄位名稱。
- 其他常見款改為顯示成分標示、菌種、加糖、其它添加物與備註。

## v0.4.0 — 2026-08-09

### Changes
- 市售優格推薦改為 0–2 星，科克蘭零脂希臘式優格、心樸 100%鮮乳優格及福樂頂級鮮奶優酪標為二星最推薦。
- 成分標示統一以「乳酸菌」呈現，具體菌種名稱僅保留於菌種欄位。

## v0.3.2 — 2026-08-09

### Changes
- 調整物種對照頁順序，將附加／機能菌移至優格核心種後方。

## v0.3.1 — 2026-08-09

### Changes
- 新增 Milk Kefir 每批完成、暫停 1–3 天、1–2 週及 2 週以上的分級保存方式。
- 補充冷藏換奶、冷凍、復甦流程與污染丟棄判斷。

## v0.3.0 — 2026-08-09

### Changes
- 將 Milk Kefir 與 Water Kefir 拆分為兩筆獨立菌種資料與頁面。
- 以現行市場常見名稱、販售形式與購買辨識為主，補充雪蓮菌俗名的混用風險。
- 新增美國、德國、中亞及中東的菌粒、starter 與瓶裝 Kefir 市場例證。

## v0.2.1 — 2026-08-09

### Changes
- 擴充 Kefir 的北高加索、中國西藏與新疆歷史、菌相及製程差異。
- 補充新疆小河古 Kefir 奶酪的東亞傳播證據，並區分天山 tibicos 水克菲爾。

## v0.2.0 — 2026-08-09

### Changes
- 新增 Kefir（克菲爾／牛奶克菲爾）菌種介紹、菌相、製作條件與傳代說明。
- 菌種詳情頁新增 kefir grains 型態標籤。

## v0.1.2 — 2026-08-08

### Changes
- 移除空目錄、建置產物，以及與本專案無關或不再使用的開發工具設定。
- 更新 i-have-adhd Skill，將舊 SQLite Seed 流程改為 Markdown Content Collections 建置流程。

## v0.1.1 — 2026-08-08

### Changes
- 移除未參與網站建置的知識庫研究筆記與舊 SQLite 占位目錄。
- 清理 Astro 與 pnpm 的本機快取，不影響網站內容與路由。

## v0.1.0 — 2026-08-08

### Changes
- 將 64 筆菌種、製法、批次、詞彙與市售優格資料遷移為獨立 Markdown Content Collections。
- 以 Astro Zod schema 驗證欄位、enum、評分範圍與跨集合 reference。
- 頁面改用 `astro:content` 查詢與原生 Markdown 渲染，維持既有 35 條靜態路由。
- 移除 SQLite、Seed、資料庫初始化流程與 `marked` 相依套件。
