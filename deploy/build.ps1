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
$project_dir = "$script_dir\.."

$node_arch=$env:PLATFORM
if ($node_arch -eq "x86") {
  $node_arch="ia32"
}
if ($node_arch -eq  "ia32") {
  $go_arch="386"
} else {
  $go_arch="x64"
}
$build_dir="$project_dir\release\MeshbluConnectorInstaller-win32-$node_arch"

echo "### zipping..."
$zip_name="MeshbluConnectorInstaller-windows-$go_arch.zip"
pushd "$build_dir"
  7z a "$zip_name" * -r
popd

echo "### packaging..."
mkdir "$project_dir\dpl_s3\$env:TAG_NAME" | Out-Null
mkdir "$project_dir\dpl_s3\latest" | Out-Null

Copy-Item "$build_dir\$zip_name" "$project_dir\dpl_s3\$env:TAG_NAME\$zip_name"
Copy-Item "$build_dir\$zip_name" "$project_dir\dpl_s3\latest\$zip_name"

echo "### done"
