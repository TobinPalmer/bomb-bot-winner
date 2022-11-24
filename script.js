const speedVal = 0;
const nodeRoot = document
  .querySelector('div')
  .nextElementSibling.querySelector('iframe').contentWindow.document;
const prompt = nodeRoot.querySelector('.syllable');
const input = nodeRoot.querySelector('input.styled');
const inputWrapper = nodeRoot.querySelector('.selfTurn');

const usedWords = [];
const blacklistWords = [
  'ethylenediaminetetraacetates',
  'ethylenediaminetetraacetate',
  'ethylenediaminetetraacetate',
  'electroencephalographer',
  'electroencephalographic',
  'electroencephalography',
  'electroencephalograph',
  'electroencephalograms',
  'electroencephalogram',
  'electroencephalograph',
  'electroencephalographically',
  'deinstitutionalizations',
  'countercountermeasures',
  'countercountermeasure',
  'immunoelectrophoretically',
  'intersubstitutabilities',
  'intersubstitutability',
  'deinstitutionalization',
  'chlorofluoromethanes',
  'overintellectualizations',
  'xiphihumeralis',
  'zoocytium',
  'xiphiplastrals',
  'stilpnosiderite',
  'stilpnosiderites',
  'worcesterberry',
  'worcesterberries',
  'ycleepes',
  'wyliecoat',
  'yfere',
  'zamzawed',
  'xenophobically ',
];

async function getWords() {
  return await fetch(
    'https://raw.githubusercontent.com/lorenbrichter/Words/master/Words/en.txt'
  );
}

const wordArray = getWords().then(async response => {
  const text = await response.text();
  return text.split('\n');
});

const initPrompt = () => {
  console.log('looking for prompt');
  if (!prompt) return;

  getLongestWord();
  return prompt.textContent;
};

initPrompt();

const getPromptText = () => {
  return prompt.textContent;
};

let index = 0;
const typeWord = word => {
  input.value = '';
  console.log('typing word', word);

  window.next_letter = () => {
    if (index <= word.length && !inputWrapper.hasAttribute('hidden')) {
      input.value = word.substring(-1, index++);
      setTimeout('next_letter()', Math.random() * speedVal);
    }

    // if (index > word.length) {
    //   console.log(usedWords);
    // }
  };

  if (!inputWrapper.hasAttribute('hidden')) {
    console.log('NEXT LETTER');

    setTimeout(() => {
      next_letter();
    }, 0);
  } else {
    console.log('input is hidden');
    input.value = '';
  }
};

async function getLongestWord() {
  console.log('getting longest word');

  return await wordArray
    .then(words => {
      let longestWord = '';
      const wordPrompt = getPromptText();
      words.forEach(word => {
        if (word.includes(wordPrompt)) {
          if (
            /*word.length > longestWord.length */
            !usedWords.includes(word) &&
            !blacklistWords.includes(word)
          )
            longestWord = word;
        }
      });
      if (longestWord.length) {
        console.log('longest word', longestWord);

        if (!inputWrapper.hasAttribute('hidden')) {
          input.value = longestWord;
          const keyboardEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true,
          });
          inputWrapper.querySelector('form').dispatchEvent(keyboardEvent);
          /* typeWord(longestWord) */ usedWords.push(longestWord);
        }
      }
    })
    .catch(err => console.log(err));
}

const observerConfig = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
};

const promptWrapper = nodeRoot.querySelector('.round');
const promptObserver = new MutationObserver(() => {
  getLongestWord();
  console.log(getPromptText(), 'PROMPT TEXT');
});

const inputObserver = new MutationObserver(() => {
  return inputWrapper.hasAttribute('hidden')
    ? console.log('input is hidden')
    : (console.log('input is visible getting longest word'), getLongestWord());
});

if (promptWrapper && prompt) {
  inputObserver.observe(inputWrapper, observerConfig);
  promptObserver.observe(promptWrapper, observerConfig);
}
