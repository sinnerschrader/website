module.exports = function (text) {
	return /^(.*?)(?:_\$(.*?)\$_(.*?))?$/g
		.exec(text)
		.slice(1)
		.filter(part => Boolean(part));
};
