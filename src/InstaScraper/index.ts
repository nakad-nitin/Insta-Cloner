/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default async function next(startIndex: number, endIndex: number) {
  // main function

  function __next(MainIndex = 0) {
    return new Promise<void>((resolve) => {
      function FindLastDiv() {
        // Find all <div> elements
        const allDivs = document.querySelector("main")!.querySelectorAll("div");
        // Filter for divs with no attributes
        const divsWithNoAttributes = Array.from(allDivs).filter((div) => div.attributes.length === 0);

        console.log(divsWithNoAttributes);
        return divsWithNoAttributes[divsWithNoAttributes.length - 1];
      }

      // Function to detect visibility
      function observeCarouselElement(element: HTMLElement, callback: (isIntersecting: boolean) => void) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              callback(entry.isIntersecting); // True if visible, false otherwise
            });
          },
          {
            root: null, // null means observing within the viewport
            threshold: 0.1, // Adjust threshold as needed (0.1 = 10% visible)
          }
        );

        observer.observe(element);

        // Return a function to stop observing
        return () => observer.unobserve(element);
      }

      console.log("Hello from next!");

      const rootDiv = FindLastDiv();
      const mainImgs = rootDiv.querySelectorAll("img");
      const currentPic = mainImgs[MainIndex];
      let lastImg: { src?: string } | HTMLImageElement | HTMLVideoElement = { src: "b" };
      let lastIndex = 1;
      const filesToDownObj: Record<string, string> = {};

      currentPic.click();

      setTimeout(() => {
        const time = document.querySelector<HTMLTimeElement>("time.x1p4m5qa")?.dateTime || "";
        const userName = document.querySelector<HTMLDivElement>(".xt0psk2:has(a)")?.textContent || "";
        const postContent = document.querySelector<HTMLDivElement>("._a9zr")?.innerText || "";

        chrome.runtime.sendMessage<Message>({
          type: "FROM_TAB",
          payload: { postContent, time, userName },
          payloadType: "constant",
        });

        for (let index = 0; index < 16; index++) {
          setTimeout(() => {
            const presentation = document.querySelector("div._aatk._aatl")!;

            // console.log(presentation);

            const imgList = presentation.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video");
            let mainImg: HTMLImageElement | HTMLVideoElement = { src: "a" } as any;

            const ifNextButton = presentation.querySelector<HTMLButtonElement>('button[aria-label="Next"]');
            const ifBackButton = presentation.querySelector<HTMLButtonElement>('button[aria-label="Go back"]');

            if (imgList.length >= 1) {
              imgList.forEach((img) => {
                const stopObserving = observeCarouselElement(img, (isVisible) => {
                  if (isVisible) {
                    if (window.debug) console.log(`Carousel element is ${isVisible ? "visible" : "not visible"}`);

                    mainImg = img;

                    if (filesToDownObj[mainImg.src]) return;
                    else filesToDownObj[mainImg.src] = mainImg.src;

                    if (mainImg.tagName === "VIDEO") return;

                    if (lastImg.src !== mainImg.src) {
                      lastImg = mainImg;

                      const data: VariablePayload = {
                        mainImg: mainImg.src,
                        alt: (mainImg as any)?.alt as string,
                        MainIndex,
                        index: lastIndex,
                      };

                      if (window.debug) console.log({ imgList, data, index, lastIndex });
                      lastIndex++;

                      // Send data to background script
                      chrome.runtime.sendMessage<Message>({ type: "FROM_TAB", payload: data, payloadType: "variable" });
                    }
                  }
                });

                // Stop observing after 10 seconds (optional)
                setTimeout(stopObserving, 10000);
              });
            }

            if (ifNextButton) ifNextButton.click();

            if (index === 14) {
              chrome.runtime.sendMessage<Message>({ type: "FROM_TAB", payload: "END", payloadType: "signal" });
              resolve();
            }

            if (!ifNextButton) {
              return;
            }
          }, index * 1000);
        }
      }, 1000);
    });
  }

  if (endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      await __next(i);
    }
  } else await __next(startIndex);
}
