# Save this as cleanup.ps1 in your project directory

# Navigate to the script's directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "Step 1: Cleaning up Git repository..." -ForegroundColor Cyan
# Remove the large file from Git's history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch node_modules/.cache/default-development/1.pack" --prune-empty --tag-name-filter cat -- --all

Write-Host "Step 2: Cleaning up Git references..." -ForegroundColor Cyan
# Remove original refs
git for-each-ref --format="delete %(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }

Write-Host "Step 3: Optimizing repository..." -ForegroundColor Cyan
# Clean up and optimize
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Step 4: Updating .gitignore..." -ForegroundColor Cyan
# Update .gitignore
@"
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea
.vscode

# Cache
.cache
.parcel-cache
*.log
"@ | Out-File -FilePath .gitignore -Encoding utf8

Write-Host "Step 5: Committing changes..." -ForegroundColor Cyan
# Add and commit
git add .gitignore
git commit -m "Update .gitignore to exclude node_modules and cache"

Write-Host "Step 6: Force pushing changes to GitHub..." -ForegroundColor Cyan
# Force push
git push origin main --force

Write-Host "`nCleanup complete! Your repository should now be clean." -ForegroundColor Green
Write-Host "If you still see any large files, we can try the alternative approach." -ForegroundColor Yellow