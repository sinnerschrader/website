#!/bin/bash
for file in $1

do
	SOURCE=$file
	BASE=${file%.**}
	TARGET=${BASE}.$2
	echo "$BASE > $TARGET"
	convert -strip -interlace Plane $SOURCE $TARGET
done
