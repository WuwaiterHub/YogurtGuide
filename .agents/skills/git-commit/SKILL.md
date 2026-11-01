---
name: git-commit
description: "git commit 工作流：建本地分支、commit 前跑 test:ci、寫結構化 commit 訊息。不自動 push。使用者只說檢查時，跑驗證、不 commit。"
---

# Git Commit

使用者說「commit」「提交」「存版本」「git commit」時走完整流程。
只說「檢查」「verify」「pre-commit」時，只做第 3 步，不建分支、不 commit。

## 流程

1. 看變更：`git status`、`git diff`、`git diff --cached`、`git log --oneline -3`。
2. 分支名：`Wade/<西元年>_<3到6個英文單字>`，單字底線分隔、首字大寫。例：`Wade/2026_Add_Batch_Log`。已在這條分支上就不要再開。
3. 驗證，失敗就停，不要 commit：
   - `npm run test:ci`
   - 改了 `src/content/**` 時再跑 `npm run build`
4. 只 `git add` 這次要交的檔。不要 `git add -A` 或 `git add .`。不要加 `.env`、憑證、金鑰。
5. Commit。第一行就是分支名。

```bash
git commit -m "$(cat <<'EOF'
Wade/<年>_<總結>

<2到4句：做了什麼、為什麼>

Files changed:
- <相對路徑>：<一句話>
EOF
)"
```

6. 回報短 hash、分支名、檔案數。不要 `git push`。

Push 由使用者另說。push 時本機 hook 會跑 `npm run check:gitignore` 與 `npm run check:security`；進 `main` 後由 `.github/workflows/deploy.yml` 建置並部署。

## 不要做

- 不要 push
- 不要 `git commit --amend`
- 不要加 `Co-Authored-By` 或任何 AI 署名
