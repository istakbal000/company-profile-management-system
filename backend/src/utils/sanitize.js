const sanitizeHtml = require('sanitize-html');

const sanitize = (input) =>
	sanitizeHtml(input, {
		allowedTags: [],
		allowedAttributes: {},
		disallowedTagsMode: 'discard',
		allowedSchemes: ['http', 'https', 'mailto', 'tel'],
	}).trim();

module.exports = { sanitize };


