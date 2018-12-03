function evalXPath(selector, innerDocument = document) {
  const headings = innerDocument.evaluate(
    selector,
    innerDocument,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  const matches = [];

  for (let i = headings.iterateNext(); i; i = headings.iterateNext()) {
    matches.push(i);
  }

  return matches;
}

function isUniqueXPath(selector, innerDocument = document) {
  return evalXPath(selector, innerDocument).length < 2;
}

function getSiblingPosition(element) {
  if (element.parentNode) {
    const { childNodes } = element.parentNode;
    let counter = 0;
    for (let i = 0; i < childNodes.length; i++) {
      let sibling = childNodes[i];
      if (isElement(sibling) && sibling.tagName === element.tagName) {
        counter++;
        if (sibling === element) {
          return counter;
        }
      }
    }
  }
  return null;
}

function isElement(el) {
  let isElem;

  if (typeof HTMLElement === "object") {
    isElem = el instanceof HTMLElement;
  } else {
    isElem =
      !!el &&
      typeof el === "object" &&
      el.nodeType === 1 &&
      typeof el.nodeName === "string";
  }
  return isElem;
}

const allowedDataAttributes = [
  "ui",
  "test",
  "field-name",
  "field-path"
];

function uniqueXPathSelector(el, innerDocument) {
  const results = [];
  let current = el;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const tagName = current.tagName.toLowerCase().replace(/:/g, "\\:");
      const segments = [];

      allowedDataAttributes.filter(attr => current.dataset[attr]).forEach(attr => {
        segments.push(`@data-${attr}="${current.dataset[attr]}"`)
      })

      const siblingPosition = getSiblingPosition(current);
      if (siblingPosition !== null) {
        segments.push(siblingPosition);
      }
      results.push(`${tagName}${segments.map(x => `[${x}]`).join("")}`);
    }

    current = current.parentNode;
  }

  return `/${results.reverse().join("/")}`;
}

export default uniqueXPathSelector;

/*

  /html/body/div[2]/h2[1]

  //[data-ui="ContentSection"]//([data-ui="Heading"])[text()="Half-life"]

  ContentSection Heading["Half-life"]

*/
