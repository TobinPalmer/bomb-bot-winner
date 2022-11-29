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

const getLongestWord = async () => {
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
          input.value = longestWord;
          usedWords.push(longestWord);

          const word = input.value.trim();
          if (word.length > 0) socket.emit('setWord', word, true);
          setTimeout(() => {
            if (
              !inputWrapper.hasAttribute('hidden') &&
              input.value.trim() === ''
            ) {
              input.value = getLongestWord();
            }
          }, 100);
        }
      }
    })
    .catch(err => console.log(err));
};

const observerConfig = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
};

const promptWrapper = nodeRoot.querySelector('.round');
const promptObserver = new MutationObserver(() => {
  getLongestWord();
});

const inputObserver = new MutationObserver(() => {
  return inputWrapper.hasAttribute('hidden') ? '' : getLongestWord();
});

if (promptWrapper && prompt) {
  inputObserver.observe(inputWrapper, observerConfig);
  promptObserver.observe(promptWrapper, observerConfig);
}
