# fix-param-errors.ps1
# Run AFTER find-param-errors.ps1 to auto-fix issues.
# Run from your project root:
# .\fix-param-errors.ps1

Write-Host "`n🔧 Auto-fixing Next.js App Router param errors...`n" -ForegroundColor Cyan

$targetDir = "./src/app/api"
$files = Get-ChildItem -Path $targetDir -Recurse -Filter "*.ts" | Where-Object { $_.Name -eq "route.ts" }

$fixedFiles  = 0
$fixedIssues = 0

foreach ($file in $files) {

    # ── Compatibility fix: read all lines and join with newline (works on PS 2+)
    $lines   = Get-Content $file.FullName
    $content = $lines -join "`n"
    $original = $content

    $isDynamic = $file.FullName -match '\[([^\]]+)\]'

    # Extract the param name from the folder path e.g. [id] -> id
    $paramName = "id"
    if ($isDynamic) {
        $paramMatch = [regex]::Match($file.FullName, '\[([^\]]+)\]')
        if ($paramMatch.Success) { $paramName = $paramMatch.Groups[1].Value }
    }

    # Fix 1: Add missing { params } to dynamic route handler signatures
    # Matches: export async function GET(req: NextRequest)  — missing second arg
    if ($isDynamic) {
        $pattern     = '(export async function (?:GET|POST|PUT|DELETE|PATCH)\s*\(\s*req\s*:\s*NextRequest\s*)\)'
        $replacement = "`$1, { params }: { params: { $paramName`: string } })"
        $newContent  = [regex]::Replace($content, $pattern, $replacement)
        if ($newContent -ne $content) {
            $content = $newContent
            $fixedIssues++
            Write-Host "  ✅ Fixed handler signature in: $($file.FullName -replace [regex]::Escape((Get-Location).Path), '.')" -ForegroundColor Green
        }
    }

    # Fix 2: Replace `const { params } = req` with nothing (params now comes from second arg)
    $pattern    = "const\s*\{\s*params\s*\}\s*=\s*req\s*;?\s*`n?"
    $newContent = [regex]::Replace($content, $pattern, "")
    if ($newContent -ne $content) {
        $content = $newContent
        $fixedIssues++
        Write-Host "  ✅ Removed 'const { params } = req' in: $($file.FullName -replace [regex]::Escape((Get-Location).Path), '.')" -ForegroundColor Green
    }

    # Fix 3: Flag req.query usage (too risky to auto-replace)
    if ($content -match 'req\.query') {
        Write-Host "  ⚠️  Manual fix needed — req.query found in: $($file.FullName -replace [regex]::Escape((Get-Location).Path), '.')" -ForegroundColor Yellow
        Write-Host "     Replace with: const { searchParams } = new URL(req.url); const value = searchParams.get('key');" -ForegroundColor DarkYellow
    }

    # Write file only if changed
    # ── Compatibility fix: use [System.IO.File]::WriteAllText instead of Set-Content -NoNewline
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        $fixedFiles++
    }
}

Write-Host "`n─────────────────────────────────────────" -ForegroundColor DarkGray

if ($fixedFiles -eq 0) {
    Write-Host "✅ Nothing to fix — all files look good!" -ForegroundColor Green
} else {
    Write-Host "🎉 Fixed $fixedIssues issue(s) across $fixedFiles file(s)." -ForegroundColor Green
    Write-Host "Run 'npx tsc --noEmit' to verify no remaining type errors.`n" -ForegroundColor Cyan
}