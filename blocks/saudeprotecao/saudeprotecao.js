export default function decorate(block) {
  function addClasses(element, className) {
    element.classList.add(className);
  }

  function truncateText(element, maxLength) {
    const codeElements = element.querySelectorAll('code');
    codeElements.forEach((codeElement) => {
      codeElement.outerHTML = codeElement.innerHTML;
    });

    // eslint-disable-next-line prefer-destructuring
    const textContent = element.textContent;

    if (textContent.length > maxLength) {
      let truncatedText = '';
      let currentLength = 0;

      Array.from(element.childNodes).forEach((node) => {
        if (currentLength >= maxLength) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const remainingLength = maxLength - currentLength;
          if (node.textContent.length > remainingLength) {
            truncatedText += `${node.textContent.substring(0, remainingLength)}...`;
            currentLength = maxLength;
          } else {
            truncatedText += node.textContent;
            currentLength += node.textContent.length;
          }
        } else {
          truncatedText += node.outerHTML;
          currentLength += node.textContent.length;
        }
      });

      element.innerHTML = truncatedText;
    }
  }

  function replacePreWithParagraph(preElement) {
    const codeElement = preElement.querySelector('code');
    if (codeElement) {
      const pElement = document.createElement('p');
      pElement.innerHTML = codeElement.innerHTML.replace(/\n/g, '<br>');
      preElement.parentNode.replaceChild(pElement, preElement);
    }
  }

  const maxLengthsObject = {
    'saudeprotecao-container-first': {
      link: 43,
      paragraph: 291,
    },
    'saudeprotecao-container-second': {},
  };

  function processChildDivs(parent) {
    const children = parent.querySelectorAll(':scope > div');
    children.forEach((child) => {
      const pElements = child.querySelectorAll('p');
      pElements.forEach((pElement) => {
        if (pElement.querySelector('picture')) {
          const picture = pElement.querySelector('picture');
          const newDiv = document.createElement('div');
          newDiv.appendChild(picture);
          pElement.replaceWith(newDiv);
        } else if (pElement.querySelector('code')) {
          const codeElement = pElement.querySelector('code');
          pElement.innerHTML = codeElement.innerHTML;
        }
      });

      const preElements = child.querySelectorAll('pre');
      preElements.forEach((preElement) => {
        replacePreWithParagraph(preElement);
      });

      const aElements = child.querySelectorAll('a');
      aElements.forEach((aElement) => {
        aElement.classList.add('button');
      });
    });
  }

  function truncateTextInContainer(container, maxLength) {
    const firstDiv = container.querySelector(':scope > div:nth-child(1)');
    const secondDiv = container.querySelector(':scope > div:nth-child(2)');

    function changeElementsSize(element) {
      const aElement = element.querySelector('a');
      const pElements = element.querySelectorAll('p');
      if (aElement) truncateText(aElement, maxLength.link);
      pElements.forEach((pElement) => {
        if (!pElement.classList.contains('button-container')) {
          truncateText(pElement, maxLength.paragraph);
        }
      });
    }

    if (firstDiv) {
      changeElementsSize(firstDiv);
    }

    if (secondDiv) {
      changeElementsSize(secondDiv);
    }
  }

  const firstLevelDivs = block.querySelectorAll(':scope > div');
  firstLevelDivs.forEach((div, index) => {
    const sectionsblocks = ['title', 'first', 'second'];
    const className = `saudeprotecao-container-${sectionsblocks[index]}`;
    addClasses(div, className);

    if (className === 'saudeprotecao-container-title'
      || className === 'saudeprotecao-container-first'
      || className === 'saudeprotecao-container-second') {
      processChildDivs(div);
    }

    if (className === 'saudeprotecao-container-first') {
      truncateTextInContainer(div, maxLengthsObject[className]);
    }
  });

  return block;
}
