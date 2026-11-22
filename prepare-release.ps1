# Gathers the newest Windows launcher package and Android APK from the game project into .\release-files, with the fixed names the
# website links to (FallenStars-Launcher.zip, FallenStars.apk). Then make a new Release on GitHub and drop both files in it.
# If the GitHub CLI (gh) is installed and signed in, pass -Tag v1.0.1 to create the release with it directly.
#
#   powershell -ExecutionPolicy Bypass -File .\prepare-release.ps1
#   powershell -ExecutionPolicy Bypass -File .\prepare-release.ps1 -Tag v1.0.1 -Notes "Chapter 3"

param(
    [string]$Game = "$PSScriptRoot\..\FallenStars",
    [string]$Tag = "",
    [string]$Notes = ""
)

$ErrorActionPreference = "Stop"
$out = Join-Path $PSScriptRoot "release-files"
New-Item -ItemType Directory -Force $out | Out-Null

$zip = Join-Path $Game "Builds\FallenStars-Launcher.zip"
if (-not (Test-Path $zip)) { throw "No launcher package at $zip (run tools/launcher/make_launcher_package.py first)." }
$apk = Get-ChildItem (Join-Path $Game "Builds\Android") -Filter "FallenStars-*.apk" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $apk) { throw "No APK in $Game\Builds\Android (FallenStars -> Build -> Android APK in Unity first)." }

Copy-Item $zip (Join-Path $out "FallenStars-Launcher.zip") -Force
Copy-Item $apk.FullName (Join-Path $out "FallenStars.apk") -Force
Write-Host "Launcher: $zip ($([math]::Round((Get-Item $zip).Length / 1MB)) MB, $((Get-Item $zip).LastWriteTime))"
Write-Host "APK:      $($apk.Name) ($([math]::Round($apk.Length / 1MB)) MB, $($apk.LastWriteTime))"
Write-Host "Ready in: $out"

if ($Tag) {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "gh is not installed; upload the two files on the GitHub Releases page instead." }
    if (-not $Notes) { $Notes = $Tag }
    gh release create $Tag (Join-Path $out "FallenStars-Launcher.zip") (Join-Path $out "FallenStars.apk") --title $Tag --notes $Notes
} else {
    Write-Host "Next: GitHub -> FallenStars-download -> Releases -> Draft a new release -> tag (e.g. v1.0.1) -> drop both files -> Publish."
}
