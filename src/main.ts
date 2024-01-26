import "./index.css";
import { beginRendering } from "./scene";
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
        <div
          class="flex items-center md:min-h-[420px]"
        >
          <h1
            id="main-text"
            class="lg:text-8xl text-center md:text-start p-2 text-5xl animation animation-visible font-bold mb-2 colorful glowing"
          >
            PvP AI Prompting - now with orbs
          </h1>
        </div>
        <div class="md:max-w-[25rem] min-h-[135px] flex flex-col justify-end">
          <p
            id="sub-text"
            class="md:text-start md:max-w-64 lg:max-w-max text-center md:text-xl mb-4 md:ml-4 animation animation-visible"
          >
            Pondering your orb has never been so...competitive
          </p>
          <form
            netlify
            name="waitlist"
            method="POST"
            class="bg-purple-900 flex overflow-hidden w-full rounded-2xl ring-offset-0 has-[:focus]:ring-4 ring-purple-500"
          >
            <input
              type="email"
              class="bg-purple-900 text-white text-lg rounded-l-2xl flex flex-grow p-4"
              placeholder="email@example.com"
              id="emailInput"
              name="email"
            />
            <input type="hidden" name="form-name" value="waitlist" />
            <button
              type="submit"
              id="waitlistButton"
              class="bg-purple-600 hover:bg-violet-500 active:bg-purple-950 text-white px-6"
            >
              Waitlist me!
            </button>
          </form>
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

cycleStart();
beginRendering();
