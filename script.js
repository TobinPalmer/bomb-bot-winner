const speedVal = 0;
const nodeRoot = document
  .querySelector('div')
  .nextElementSibling.querySelector('iframe').contentWindow.document;
const prompt = nodeRoot.querySelector('.syllable');
const input = nodeRoot.querySelector('input.styled');
const inputWrapper = nodeRoot.querySelector('.selfTurn');

const usedWords = [];

const getWords = async () => {
  return await fetch(
    'https://raw.githubusercontent.com/lorenbrichter/Words/master/Words/en.txt'
  );
};

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

async function getLongestWord() {
  console.log('getting longest word');

  return await wordArray
    .then(words => {
      let longestWord = '';
      const wordPrompt = getPromptText();
      words.forEach(word => {
        if (word.includes(wordPrompt)) {
          if (word.length > longestWord.length && !usedWords.includes(word))
            longestWord = word;
        }
      });
      if (longestWord.length) {
        console.log('longest word', longestWord);

        if (!inputWrapper.hasAttribute('hidden')) {
          /* typeWord(longestWord) */
          input.value = longestWord;
          usedWords.push(longestWord);
          /* nodeRoot.querySelector('.selfTurn form').submit(); */

          const word = input.value.trim();
          if (word.length > 0) socket.emit('setWord', word, true);

          /*
          // input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          // input.dispatchEvent(
          //   new SubmitEvent('submit', { submitter: formTrigger })
          // );

          */

          setTimeout(() => {
            if (
              !inputWrapper.hasAttribute('hidden') &&
              input.value.trim() === ''
            ) {
              console.log('Input is not valid imo, getting a new word');
              input.value = getLongestWord();
            }
          }, 100);
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
