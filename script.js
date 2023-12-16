(function () {
  function setStyles(node, list) {
    for (const stl in list) {
      node.style[stl] = list[stl];
    }
  }

  function createEmptyTranslationsField() {
    const CHROME_CAPTION_ITEM_CLASS = "TBMuR bj4p3b";

    const $translationArea = document.createElement("div");
    $translationArea.className = "trslt-area";

    const translationAreaStyles = {
      position: "absolute",
      width: "500px",
      height: "500px",
      background: "red",
      opacity: "0.4",
      left: 0,
      "z-index": 10,
    };

    setStyles($translationArea, translationAreaStyles);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(async (node, index) => {

          if (node.className !== CHROME_CAPTION_ITEM_CLASS) {
            return;
          }

          const $textContent = node.children[2];
          const uniqIdItem = Math.random() + "";

          // Create translation area item
          const newItemDiv = document.createElement("div");
          newItemDiv.id = uniqIdItem;
          setStyles(newItemDiv, {
            padding: "10px",
            background: "#f6eeee",
            border: "2px solid #333",
            "font-size": "1.3rem",
            "margin-bottom": "10px",
          });

          // Put translation area item in trslt-area container
          const trsltArea = document.querySelector(".trslt-area");
          trsltArea.append(newItemDiv);

          // Create observer for text-content updating check (Only google meet feature)
          var observerS = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              const trsltItem = document.getElementById(uniqIdItem);
              // Update needed item
              if (
                mutation.target.innerText.length > trsltItem.innerText.length
              ) {
                trsltItem.innerText = mutation.target.innerText;
              }
            });
          });
          observerS.observe($textContent, { childList: true, subtree: true });
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.body.append($translationArea);
  }

  createEmptyTranslationsField();
})();
