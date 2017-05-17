#!/bin/bash

main() {
	yarn run package-win-x64 -- --publish onTagOrDraft || exit 1
	yarn run package-win-ia32 -- --publish onTagOrDraft || exit 1
}

main "$@"
