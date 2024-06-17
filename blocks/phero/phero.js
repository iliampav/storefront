export default function decorate(block) {
  // Function to add classes to elements
  function addClasses(element, className) {
    element.classList.add(className);
  }

  // Add classes to the first-level children divs
  const firstLevelDivs = block.querySelectorAll(':scope > div');
  firstLevelDivs.forEach((div, index) => {
    const sectionsblocks = ['title', 'bg-image', 'menu'];
    addClasses(div, `phero-container-${sectionsblocks[index]}`);
  });

  // Combine all h1 elements into one and separate them by <br>
  const titleContainer = block.querySelector('.phero-container-title > div');
  if (titleContainer) {
    const h1Elements = titleContainer.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      const combinedText = Array.from(h1Elements).map((h1) => h1.textContent).join('<br>');
      const newH1 = document.createElement('h1');
      newH1.innerHTML = combinedText;
      h1Elements.forEach((h1) => h1.remove());
      titleContainer.insertBefore(newH1, titleContainer.firstChild);
    }
  }

  const ulElement = block.querySelectorAll('ul')[0];
  const newLi = document.createElement('li');
  addClasses(ulElement, 'phero-menu-list');
  newLi.classList.add('phero-white-background');
  ulElement.appendChild(newLi);

  return block;
}
