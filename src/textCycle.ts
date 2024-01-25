import { fadeInBall, fadeOutBall, replaceBallImage } from "./scene";

type ItemType = {
  main: string;
  sub: string;
  qualifier: string;
  imageURI: string;
};

const websiteText: ItemType[] = [
  {
    main: "Unsure if you're ready to buy an orb to ponder?",
    sub: "Sign up for the world's first Orb-As-A-Service (OAAS).",
    qualifier: "silly!",
    imageURI: "./pondering.webp",
  },
  {
    main: "Experience competitive AI prompting",
    sub: "DESTROY your friends with FACTS and LOGIC.",
    qualifier: "brilliant!",
    imageURI: "./battle.webp",
  },
];

function updateTextContent(item: ItemType) {
  document.getElementById("main-text")!.textContent = item.main;
  document.getElementById("sub-text")!.textContent = item.sub;
  document.getElementById("qualifier-text")!.textContent = item.qualifier;
}

function changeClass(
  elements: NodeListOf<Element>,
  oldClass: string,
  newClass: string,
) {
  elements.forEach((el) => {
    el.classList.remove(oldClass);
    el.classList.add(newClass);
  });
}

function cycleThroughArray(arr: ItemType[]) {
  let index = 0;
  console.log("index", index);
  function cycle() {
    // Error handling if elements are not found
    if (
      !document.getElementById("main-text") ||
      !document.getElementById("sub-text") ||
      !document.getElementById("qualifier-text")
    ) {
      console.error("One or more text elements not found");
      return;
    }

    changeClass(
      document.querySelectorAll(".animation-visible"),
      "animation-visible",
      "animation-invisible",
    );
    fadeOutBall(2000);

    setTimeout(() => {
      const item = arr[index];
      updateTextContent(item);
      replaceBallImage(item.imageURI);
      changeClass(
        document.querySelectorAll(".animation-invisible"),
        "animation-invisible",
        "animation-visible",
      );
      fadeInBall(2000);

      index = (index + 1) % arr.length;
    }, 2000);
  }

  return setInterval(cycle, 15 * 1000);
}

export function cycleStart() {
  cycleThroughArray(websiteText);
}
