<#
.SYNOPSIS
  Generates public/og.png — the 1200x630 Open Graph / social share card for sqlclr.com.
.NOTES
  Uses System.Drawing (Windows). Run after changing the tagline or brand colors:
    pwsh tools/make-og.ps1
#>

Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot '..\public\og.png' | ForEach-Object { [System.IO.Path]::GetFullPath($_) }

$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'

# background
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $w, $h)),
    [System.Drawing.Color]::FromArgb(255, 7, 9, 13),
    [System.Drawing.Color]::FromArgb(255, 13, 18, 28),
    60.0)
$g.FillRectangle($bgBrush, 0, 0, $w, $h)

# subtle grid
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(18, 148, 163, 184), 1)
for ($x = 0; $x -le $w; $x += 72) { $g.DrawLine($gridPen, $x, 0, $x, $h) }
for ($y = 0; $y -le $h; $y += 72) { $g.DrawLine($gridPen, 0, $y, $w, $y) }

# accent glow (approximated with translucent ellipses)
for ($i = 26; $i -ge 1; $i--) {
    $alpha = [int](2.2 * (27 - $i))
    $glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 31, 111, 235))
    $rw = 34 * $i; $rh = 20 * $i
    $g.FillEllipse($glow, 980 - $rw / 2, 60 - $rh / 2, $rw, $rh)
    $glow.Dispose()
}

# accent bar
$barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(90, 236, 56, 6)),
    [System.Drawing.Color]::FromArgb(255, 88, 166, 255),
    [System.Drawing.Color]::FromArgb(0, 88, 166, 255), 0.0)
$g.FillRectangle($barBrush, 90, 236, 56, 6)

$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 231, 236, 243))
$dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 154, 167, 184))
$accent = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 142, 198, 255))

$fMono = New-Object System.Drawing.Font('Consolas', 22, [System.Drawing.FontStyle]::Regular)
$fBig = New-Object System.Drawing.Font('Segoe UI', 56, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font('Segoe UI', 24, [System.Drawing.FontStyle]::Regular)

$g.DrawString('sqlclr.com', $fMono, $accent, 86, 180)
$g.DrawString('Some engineers work near the', $fBig, $white, 80, 268)
$g.DrawString('database. I work inside it.', $fBig, $white, 80, 348)
$g.DrawString('Kurt Kluth · SQL Server Architect · Governed in-engine services', $fSub, $dim, 86, 476)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "saved $out"
