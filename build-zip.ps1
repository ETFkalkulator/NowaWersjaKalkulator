# build-zip.ps1 — ETFkalkulator.pl
# Tworzy archiwum ZIP gotowe do wdrożenia przez webFTP.
# Uruchom: kliknij prawym -> "Uruchom w PowerShell"
#          lub w terminalu: .\build-zip.ps1

$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$output = Join-Path (Split-Path -Parent $source) "etfkalkulator-deploy.zip"

# Pliki i foldery do WYKLUCZENIA z wdrożenia
$exclude = @(
    "build-zip.ps1",
    "migrate_nav.py",
    "update_blog.py",
    "optimize_html.py",
    "optimize_images.py",
    "fix-css-order.js",
    "clean-css-links.py",
    "CLAUDE.md",
    "thumbnail-style-guide.md",
    ".claude",
    "node_modules",
    "package.json",
    "package-lock.json",
    "tailwind.config.js",
    "tailwind-input.css",
    "css\main.css",
    "css\reset.css",
    "css\variables.css",
    "css\tailwind-debug.css",
    "css\tailwind-debug2.css",
    "css\tailwind-test.css",
    "blog\_article-template.html",
    "blog\STANDARD-ARTYKULU.md",
    "__pycache__",
    "*.pyc",
    ".git",
    ".gitignore",
    "test.html"
)

if (Test-Path $output) { Remove-Item $output }

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($output, 'Create')

Get-ChildItem -Path $source -Recurse -File | ForEach-Object {
    $file = $_
    $relative = $file.FullName.Substring($source.Length + 1)

    # Sprawdź czy plik jest na liście wykluczeń
    $skip = $false
    foreach ($ex in $exclude) {
        if ($ex.StartsWith("*")) {
            # wildcard (np. *.pyc)
            $ext = $ex.Substring(1)
            if ($file.Name.EndsWith($ext)) { $skip = $true; break }
        } elseif ($relative -eq $ex -or $relative.StartsWith($ex + "\") -or $file.Name -eq $ex) {
            $skip = $true; break
        }
    }

    if (-not $skip) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relative) | Out-Null
    }
}

$zip.Dispose()

$sizeMB = [math]::Round((Get-Item $output).Length / 1MB, 2)
Write-Host ""
Write-Host "OK Gotowe: etfkalkulator-deploy.zip ($sizeMB MB)" -ForegroundColor Green
Write-Host "  Lokalizacja: $output" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wykluczone pliki dev:" -ForegroundColor Yellow
$exclude | ForEach-Object { Write-Host "  - $_" }
Write-Host ""
Read-Host "Nacisnij Enter aby zamknac"
