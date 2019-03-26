'use strict';

var $ = require('jquery');
$("#button").click(makeDoc);

async function makeDoc() {
    var lines = $("#inputText").val().split(",");
    var output = $("#outputText");
    var spanishWords = [];
    var definitions = [];
    var sentences = [];
    var outputString = "";
    const dictKey = "7d5aa173-64d6-4c7b-8558-9bba3bca452c";
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    const { translate } = require("google-translate-api-browser");

    // Get Spanish word and sentence and English Definition
    for (let i = 0; i < lines.length; i++) {
        var english = lines[i];
        var urlDict = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + english + "?key=" + dictKey;
        var urlSpanish = "https://www.spanishdict.com/translate/" + english;

        await translate(english, { to: "es" })
            .then(res => {
                spanishWords.push(res.text);
            });

        await fetch(urlDict)
            .then(response => response.json())
            .then(json => {
                definitions.push(json[0].shortdef[0]);
            });

        await fetch(proxyurl + urlSpanish)
            .then(response => response.text())
            .then(text => {
                var sentence = "";

                var index = text.indexOf("<em class=\"exB\">");

                while (text.charAt(index) != '>')
                    index++;

                index++;

                while (text.charAt(index) != '<') {
                    sentence += text.charAt(index);
                    index++;
                }

                sentences.push(sentence);
            });
    }

    // Convert English Definition to Spanish
    for (let i = 0; i < definitions.length; i++) {
        await translate(definitions[i], { to: "es" })
            .then(res => {
                definitions[i] = res.text;
            });
    }

    // Combine word arrays into one string
    for (var i = 0; i < lines.length; i++) {
        outputString += lines[i] + " - " + spanishWords[i] + "\n";
        outputString += definitions[i] + "\n";
        outputString += sentences[i] + "\n";
    }
    output.val(outputString);
}