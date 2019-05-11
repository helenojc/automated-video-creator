var config = require('../config.json');

var algorithmia = require('algorithmia');
var algorithmia_key = config['algorithmia'].key;

var sbd = require('sbd'); // sentenceBoundaryDetection (Detecção de limite (fronteira) de sentença) 

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js'); // Entendimento em Linguagem Natural
var ibm_cloud_apikey = config['ibm-cloud'].apikey;

var nlu = new NaturalLanguageUnderstandingV1({ 
	iam_apikey: ibm_cloud_apikey,
	version: '2018-04-05',
	url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

async function robot(content) { 

	await get_content_from_wiki(content);
	sanitize_content_from_wiki(content);
	break_content_from_wiki(content); 
	limitMaximumSentences(content);
	await fetchKeywordsOfAllSentences(content);

	async function get_content_from_wiki(content) {
		var algorithmia_authenticated = algorithmia(algorithmia_key);
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
	function limitMaximumSentences(content) {
		content.sentences = content.sentences.slice(0, content.maximumSentences); 
	};
	async function fetchKeywordsOfAllSentences(content) {
		console.log('> [text-robot] Starting to fetch keywords from Watson')

		for (const sentence of content.sentences) {
			console.log(`> [text-robot] Sentence: "${sentence.text}"`)

			sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)

			console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`)
		}
	};
	async function fetchWatsonAndReturnKeywords(sentence) {
		return new Promise((resolve, reject) => {
			nlu.analyze({
				text: sentence,
				features: {
					keywords: {}
				}
			}, (error, response) => {
				if (error) {
					reject(error)
					return
				}

				const keywords = response.keywords.map((keyword) => {
					return keyword.text
				})

				resolve(keywords)
			})
		})
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