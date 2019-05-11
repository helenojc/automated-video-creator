var readline = require('readline-sync');

var robots = {
	text:require('./robots/text.js')
};

async function start() { 

	var content = {
		maximumSentences:1,
	};
	content.search = askAndReturnSearchTerm(); 
	content.prefix = pergunte_e_retorne_o_prefixo();

	await robots.text(content);

	function askAndReturnSearchTerm() {
		return readline.question('Type a wikipedia search term: ');
	};
	function pergunte_e_retorne_o_prefixo() {
		var prefixes = ['Who is','What is','The history of'];
		var indice = readline.keyInSelect(prefixes,'Choose one option: ');
		var text = prefixes[indice];
		return text;
	};
	console.log(content); 
};
start(); 