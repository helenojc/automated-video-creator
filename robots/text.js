
var algorithmia = require('algorithmia');
var sbd = require('sbd');

async function robot(content) { 

	await get_content_from_wiki(content);
	sanitize_content_from_wiki(content);
	break_content_from_wiki(content); 

	async function get_content_from_wiki(content) {
		var algorithmia_authenticated = algorithmia('simYjstkWqzdsE1PnMyaFCWCewd1');
		var algorithmia_wiki = algorithmia_authenticated.algo('web/wikipediaParser/0.1.2');
		var wiki_response = await algorithmia_wiki.pipe(content.search);
		var wiki_content = wiki_response.get();

		content.sourceContentOriginal = wiki_content.content; 
	};
	function sanitize_content_from_wiki(content) {
		
		var aaa = remove_blank_lines(content.sourceContentOriginal);
		aaa = remove_markdown(aaa);
		aaa = remove_quotes(aaa); 
		content.sourceContentSanitized = aaa; 
	};
	function break_content_from_wiki() { // breakContentIntoSentences
		content.sentences = [];

	    const sentences = sbd.sentences(content.sourceContentSanitized);
	    sentences.forEach((sentence) => {
	        content.sentences.push({
	            text: sentence,
	            keywords: [],
	            images: []
	        });
	    });
	};
};
function remove_blank_lines(text) {
	var lines = text.split('\n');
	var result = lines.filter((line) => {
		if (line.trim().length === 0) {
			return false;
		};
		return true;
	});
	return result;
};
function remove_markdown(lines) {
	var result = lines.filter((line) => {
		if (line.trim().startsWith('=')) {
			return false;
		};
		return true;
	});
	return result.join(' ');
};
function remove_quotes(text) { 
	return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
};
module.exports = robot;