module.exports = function (text) {
	return text ? splitText(text, allRanges(text, ['*', '`', '\\', '^'])) : [];
};

function splitText(text, ranges) {
	return ranges.map(range => {
		if (range[2] !== undefined) {
			return [text.substring(range[0] + 1, range[1] - 1), range[2]];
		}
		return [text.substring(range[0], range[1]), range[2]];
	});
}

function allRanges(text, chars) {
	const ranges = [];
	let range = findNextRange(text, 0, chars);
	while (range) {
		ranges.push(range);
		range = findNextRange(text, range[1], chars);
	}
	return expandRanges(text, ranges);
}

function findNextRange(text, offset, chars) {
	return minRange(chars.map(char => findRange(text, offset, char)));
}

function findRange(text, offset, char) {
	let from = text.indexOf(char, offset);
	if (from > -1) {
		let to = text.indexOf(char, from + 1);
		if (to > -1) {
			return [from, to + 1, char];
		}
		return undefined;
	}
	return undefined;
}

function minRange(ranges) {
	const sorted = ranges
		.filter(range => Boolean(range))
		.sort((r1, r2) => r1[0] - r2[0]);
	return sorted.length > 0 ? sorted[0] : undefined;
}

function expandRanges(text, ranges) {
	if (ranges.length > 0) {
		const result = [];
		// Add range for leading text
		if (ranges[0][0] > 0) {
			result.push([0, ranges[0][0]]);
		}
		for (let i = 0, n = ranges.length; i < n; i++) {
			result.push(ranges[i]);
			// Add range for inner text
			if ((i + 1) < n && (ranges[i][1] + 1 < ranges[i + 1][0])) {
				result.push([ranges[i][1], ranges[i + 1][0]]);
			}
		}
		// Add range for trailing text
		if (ranges[ranges.length - 1][1] < text.length) {
			result.push([ranges[ranges.length - 1][1], text.length]);
		}
		return result;
	}
	return [[0, text.length]];
}
