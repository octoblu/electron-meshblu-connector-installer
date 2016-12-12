#!/bin/bash

SCRIPT_NAME='deploy'

matches_debug() {
  if [ -z "$DEBUG" ]; then
    return 1
  fi
  if [[ $SCRIPT_NAME == $DEBUG ]]; then
    return 0
  fi
  return 1
}

debug() {
  local cyan='\033[0;36m'
  local no_color='\033[0;0m'
  local message="$@"
  matches_debug || return 0
  (>&2 echo -e "[${cyan}${SCRIPT_NAME}${no_color}]: $message")
}

script_directory(){
  local source="${BASH_SOURCE[0]}"
  local dir=""

  while [ -h "$source" ]; do # resolve $source until the file is no longer a symlink
    dir="$( cd -P "$( dirname "$source" )" && pwd )"
    source="$(readlink "$source")"
    [[ $source != /* ]] && source="$dir/$source" # if $source was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  done

  dir="$( cd -P "$( dirname "$source" )" && pwd )"

  echo "$dir"
}

fatal() {
	echo "ERROR: $@"
	exit 1
}

usage(){
  echo "USAGE: ${SCRIPT_NAME}"
  echo ''
  echo 'Description: ...'
  echo ''
  echo 'Arguments:'
  echo '  -h, --help       print this help text'
  echo '  -v, --version    print the version'
	echo '  --message        commit message'
	echo '  --major          major bump'
	echo '  --minor          minor bump'
	echo '  --patch          patch bump'
  echo ''
  echo 'Environment:'
  echo '  DEBUG            print debug output'
  echo ''
}

version(){
  local directory="$(script_directory)"

  if [ -f "$directory/VERSION" ]; then
    cat "$directory/VERSION"
  else
    echo "unknown-version"
  fi
}

assert_required_params() {
	local message="$1"
	local bump_arg="$2"
	if [ -n "$message" -a -n "$bump_arg" ]; then
		return 0
	fi
	usage
	if [ -z "$message" ]; then
		echo "Missing message"
	fi
	if [ -z "$bump_arg" ]; then
		echo "Must provide either (--patch,--minor,--major)"
	fi
	exit 1
}

install_deps() {
  brew install wine --without-x11
  brew install mono
  brew install gnu-tar graphicsmagick xz
	brew install gump || brew upgrade gump
}

main() {
	local message
	local bump_arg
  while [ "$1" != "" ]; do
    local param="$1"
    local value="$2"
    case "$param" in
      -h | --help)
        usage
        exit 0
        ;;
      -v | --version)
        version
        exit 0
        ;;
			--message)
				message="$value"
				shift
        ;;
			--major)
				bump_arg='--major'
        ;;
			--minor)
				bump_arg='--minor'
        ;;
			--patch)
				bump_arg='--patch'
        ;;
      *)
        if [ "${param::1}" == '-' ]; then
          echo "ERROR: unknown parameter \"$param\""
          usage
          exit 1
        fi
        ;;
    esac
    shift
  done

	assert_required_params "$message" "$bump_arg"

  install_deps || fatal 'unable to install dependencies'
	env SKIP_CREATE_RELEASE='true' gump "$message" $bump_arg
	local version="$(cat package.json | jq --raw-output '.version')"
	hub release create -d -m "v${version} $message" "v${version}"
  yarn install || fatal 'unable to yarn install'
  yarn run build || fatal 'unable to yarn build'
  yarn run package-all || fatal 'unable to package all'
	echo "IMPORTANT: only a draft was created. You'll need to mark it as a release"
}

main "$@"
