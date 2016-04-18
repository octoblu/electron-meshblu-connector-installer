function Get-ScriptDirectory
{
    $Invocation = (Get-Variable MyInvocation -Scope 1).Value;
    if($Invocation.PSScriptRoot)
    {
        $Invocation.PSScriptRoot;
    }
    Elseif($Invocation.MyCommand.Path)
    {
        Split-Path $Invocation.MyCommand.Path
    }
    else
    {
        $Invocation.InvocationName.Substring(0,$Invocation.InvocationName.LastIndexOf("\"));
    }
}

echo "### building..."
$script_dir = Get-ScriptDirectory
$node_arch=$env:PLATFORM
if ($node_arch -eq  "ia32") {
  $go_arch="386"
} else {
  $go_arch="x64"
}
$build_dir="$script_dir\release\MeshbluConnectorInstaller-win32-$arch"

echo "### zipping..."
$zip_name="MeshbluConnectorInstaller-windows-$go_arch.zip"
pushd "$build_dir"
  7za -tzip "$zip_name" *
popd

echo "### packaging..."
mkdir "$script_dir\dpl_s3\$env:TAG_NAME" | Out-Null
mkdir "$script_dir\dpl_s3\latest" | Out-Null

Copy-Item "$build_dir\$zip_name" "$script_dir\dpl_s3\$env:TAG_NAME\$zip_name"
Copy-Item "$build_dir\$zip_name" "$script_dir\dpl_s3\latest\$zip_name"

echo "### done"
