var path  = require('path');
var spawn = require('child_process').spawn;

var args = [
  '--type',
  'npm',
  '--tag',
  'v3.3.12'
];

var child = spawn('.' + path.sep + 'meshblu-connector-dependency-manager.exe', args, {
  cwd: path.join(process.env.LOCALAPPDATA, "MeshbluConnectors", "bin")
});

child.stdout.on('data', function(data){
  console.log('stdout', data.toString());
});

child.stderr.on('data', function(data){
  console.log('stderr', data.toString());
});

child.on('close', function(code){
  console.log('exited', code);
});

child.on('error', function(error){
  console.log('exited with error', error.message);
});
