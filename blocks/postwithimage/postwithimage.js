export default function decorate(block) {
  function addClasses(element, className) {
    element.classList.add(className);
  }

  // Function to truncate text to a specified number of characters and add ellipsis
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  }

  // Add classes to the first-level children divs
  const firstLevelDivs = block.querySelectorAll(':scope > div');
  firstLevelDivs.forEach((div, index) => {
    const sectionsblocks = ['title', 'first', 'second'];
    addClasses(div, `post-container-${sectionsblocks[index]}`);
  });

  // Truncate text for the first and second sections
  const firstSection = block.querySelector('.post-container-first p code');
  if (firstSection) {
    firstSection.textContent = truncateText(firstSection.textContent, 151);
  }

  const secondSection = block.querySelector('.post-container-second p code');
  if (secondSection) {
    secondSection.textContent = truncateText(secondSection.textContent, 101);
  }

  // Create a new div inside .post-container-second and move existing children into it
  const secondContainer = block.querySelector('.post-container-second');
  if (secondContainer) {
    const newDiv = document.createElement('div');
    while (secondContainer.firstChild) {
      newDiv.appendChild(secondContainer.firstChild);
    }
    secondContainer.appendChild(newDiv);
  }

  return block;
}
