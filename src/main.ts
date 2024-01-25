import "./index.css";
import { beginRendering, onLoad } from "./scene";
import { cycleStart } from "./textCycle";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="flex h-dvh justify-center md:justify-start">
  <div class="flat-background"></div>
  <div class="flat-background2 md:hidden"></div>
  <div class="flex flex-col h-dvh">
    <div
      class="container flex-grow mr-auto flex align-center justify-start p-4 md:p-8"
    >
      <div class="md:w-4/6 flex flex-col justify-between md:justify-around h-full">
        <h1
          id="main-text"
          class="lg:text-8xl text-center md:text-start p-2 text-6xl animation animation-visible font-bold mb-2 colorful glowing"
        >
          Unsure if you're ready to buy an orb to ponder?
        </h1>
        <div>
          <p
            id="sub-text"
            class="md:text-start md:max-w-64 lg:max-w-max text-center md:text-xl mb-4 ml-4 animation animation-visible"
          >
            Sign up for the world's first Orb-As-A-Service (OAAS).
          </p>
          <div
            class="bg-purple-900 flex overflow-hidden w-full md:max-w-[40rem] rounded-2xl ring-offset-0 has-[:focus]:ring-4 ring-purple-500"
          >
            <input
              type="email"
              class="bg-purple-900 text-white text-lg rounded-l-2xl flex flex-grow p-4"
              placeholder="email@example.com"
              id="emailInput"
            />
            <button
              id="waitlistButton"
              class="bg-purple-600 hover:bg-violet-500 active:bg-purple-950 text-white px-6"
            >
              Waitlist me!
            </button>
          </div>
        </div>
      </div>
    </div>
    <p class="mb-4 text-center md:text-start md:m-4">
      A very
      <span
        id="qualifier-text"
        class="colorful glowing animation-visible animation font-extrabold"
        >silly</span
      >
      project by <a href="https://daniel.du-pless.is">Daniel du Plessis</a>
    </p>
  </div>
</div>
`;

onLoad(() => {
  cycleStart();
  beginRendering();
});
