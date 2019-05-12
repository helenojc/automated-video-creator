

    /*var content = {
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
    console.log(content); */

const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
    
    var content = {
        maximumSentences:1,
    };
    content.search = askAndReturnSearchTerm(); 
    content.prefix = pergunte_e_retorne_o_prefixo();
    state.save(content);

    function askAndReturnSearchTerm() {
        return readline.question('Type a wikipedia search term: ');
    };
    function pergunte_e_retorne_o_prefixo() {
        var prefixes = ['Who is','What is','The history of'];
        var indice = readline.keyInSelect(prefixes,'Choose one option: ');
        var text = prefixes[indice];
        return text;
    };
}

module.exports = robot


/*const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }

}

module.exports = robot*/