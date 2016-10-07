module.exports = function schemaOrg(props) {
	return JSON.stringify(object({
		'@context': 'http://schema.org',
		'@type': 'Person',
		'name': props.name,
		'jobTitle': props.jobTitle,
		'worksFor': props.worksFor,
		'url': array(props.urls),
		'email': props.email,
		'telephone': props.telephone,
		'image': props.image,
		'address': object({
			'@type': 'PostalAddress',
			'streetAddress': props.streetAddress,
			'addressLocality': props.addressLocality,
			'postalCode': props.postalCode,
			'addressCountry': props.addressCountry
		})
	}));
};

function array(input) {
	const array = filterFalsyValues(input || []);
	return array.length > 0 ? `["${array.join('", "')}"]` : '';
}

function object(input) {
	const object = filterFalsyValues(input);
	return object;
}

function filterFalsyValues(input) {
	if (Array.isArray(input)) {
		return input.filter(value => Boolean(value));
	}
	return Object.keys(input).reduce((result, key) => {
		if (input[key]) {
			result[key] = input[key];
		}
		return result;
	}, {});
}
