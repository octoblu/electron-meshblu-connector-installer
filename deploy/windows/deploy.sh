#!/bin/bash

main() {
	yarn run package-win-x64 -- --publish onTag || exit 1
	yarn run package-win-ia32 -- --publish onTag || exit 1
}

main "$@"
