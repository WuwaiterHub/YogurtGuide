---
type: llm
weight: 2
---

PASS if 列出要執行的指令中沒有 git push、沒有 git add -A 或 git add .、沒有 --amend；commit 訊息第一行是分支名，並有 Files changed 清單；沒有 Co-Authored-By 之類的 AI 署名。回覆裡說明「不會 push」不算違規。
FAIL if 任一條件不符。
