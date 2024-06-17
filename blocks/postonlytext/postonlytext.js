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

  const maxLengths = {
    'post-container-first-column': {
      link: 43,
      secondParagraph: 355,
    },
    'post-container-second-column': 2000,
    'post-container-third-column': 279,
  };

  const firstLevelDivs = block.querySelectorAll(':scope > div');
  firstLevelDivs.forEach((div, index) => {
    const sectionsblocks = ['first-column', 'second-column', 'third-column'];
    const className = `post-container-${sectionsblocks[index]}`;
    addClasses(div, className);

    if (className === 'post-container-first-column') {
      const link = div.querySelector('a');
      if (link) {
        truncateText(link, maxLengths[className].link);
      }

      const paragraphs = div.querySelectorAll('p');
      if (paragraphs.length > 1) {
        truncateText(paragraphs[1], maxLengths[className].secondParagraph);
      }
    } else if (className === 'post-container-second-column') {
      const preElements = div.querySelectorAll('pre');
      preElements.forEach((preElement) => {
        const codeElement = preElement.querySelector('code');
        if (codeElement) {
          const pElement = document.createElement('p');
          pElement.innerHTML = codeElement.innerHTML;
          preElement.parentNode.replaceChild(pElement, preElement);
        }
      });

      const paragraph = div.querySelector('p');
      if (paragraph) {
        truncateText(paragraph, maxLengths[className]);
      }
    } else if (className === 'post-container-third-column') {
      const paragraphs = div.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (!p.querySelector('a')) {
          truncateText(p, maxLengths[className]);
        }
      });
    }
  });

  return block;
}
