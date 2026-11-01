---
type: llm
---

PASS if 步驟只有驗證（npm run test:ci，必要時 npm run build），而且沒有建分支（git checkout -b / git switch -c）也沒有 git commit。
FAIL if 步驟裡包含建分支或 commit。
