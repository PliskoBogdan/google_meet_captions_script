(function () {
  /* |START| GLOBAL VARS |START| */
  const CHROME_CAPTION_ITEM_CLASS = "TBMuR bj4p3b"; // Captions wrapper
  const RAPID_API_KEY = "7bb3e31dfdmsh12714da22204ab5p1c7980jsn340e18243a50";
  const TARGET_LANG = "ru";
  const SOURCE_LANG = "en";
  const API_CALL_DEBOUNCE_TIME = 3000;
  /* |END| GLOBAL VARS |END| */
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function setStyles(node, list) {
    for (const stl in list) {
      node.style[stl] = list[stl];
    }
  }

  async function updateTranslationAreaItem($node, q) {
    const url =
      "https://google-translate1.p.rapidapi.com/language/translate/v2";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      body: new URLSearchParams({
        q,
        target: TARGET_LANG,
        source: SOURCE_LANG,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const resultParse = JSON.parse(result);
      $node.innerText = resultParse?.data?.translations[0].translatedText;
    } catch (error) {
      console.error(error);
    }
  }

  function start() {
    const $translationArea = document.createElement("div");
    $translationArea.className = "trslt-area";

    const throttledApiCall = throttle(updateTranslationAreaItem, API_CALL_DEBOUNCE_TIME);

    const translationAreaStyles = {
      position: "absolute",
      width: "500px",
      background: "red",
      opacity: "0.4",
      left: 0,
      "min-height": "100px",
      "max-height": "500px",
      overflow: "scroll",
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
          const speakerTextObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              const $trsltItem = document.getElementById(uniqIdItem);
              const content = mutation.target.offsetParent.innerText;
              // Update needed item
              if (content.length > $trsltItem.innerText.length) {
                // Api Call translate call also
                throttledApiCall($trsltItem, content);
              }
            });
          });
          speakerTextObserver.observe($textContent, { childList: true, subtree: true });
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.body.append($translationArea);
  }

  start();
})();
