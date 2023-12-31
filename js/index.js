// Get sort and blog buttons from the dom
const sortButtons = document.querySelectorAll(".sort-button");
const blogButtons = document.querySelectorAll(".blog-button");
// active tab (global scope). variable will be reassigned later according to the need of functionality
let activeTab;

//  common function to fetch data
const fetchData = async (apiUrl) => {
  // validate the argument
  if (typeof apiUrl !== "string") {
    return "Invalid input. API url should be a string data type.";
  }

  // fetch data from given argument which is an api endpoint
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data;
};

// render no video found message conditionally
const toggleNoVideoMessage = (show) => {
  const noVideoFoundEl = document.getElementById("no-video-found-message");

  if (show) {
    noVideoFoundEl.classList.remove("hidden");
  }

  if (!show) {
    noVideoFoundEl.classList.add("hidden");
  }
};

// render videos container section conditionally
const toggleVideosContainer = (show) => {
  const videosContainer = document.getElementById("videos-container");

  if (show) {
    videosContainer.classList.remove("!hidden");
  }

  if (!show) {
    videosContainer.classList.add("!hidden");
  }
};

// function to change the color of the active tab
const makeActive = (categoryId) => {
  // validate the argument
  if (typeof categoryId !== "string") {
    return "Invalid input. Category id should be a string data type.";
  }
  // retrieve the active button element and change its appearance
  const activeTabEl = document.getElementById(categoryId);
  activeTabEl.classList.add("!bg-primary", "!text-white");
};

// function to reset the acive status of the button before changing the appearnce of the latest active tab
const removeActiveFromAll = (categoryElements) => {
  categoryElements.forEach((tab) => {
    tab.classList.remove("!bg-primary", "!text-white");
  });
};

// function to calculate hours and minutes from seconds string
const convertTime = (timeInSeconds) => {
  timeInSeconds = parseFloat(timeInSeconds);

  // validate if the string was a numeric string
  if (isNaN(timeInSeconds)) {
    return "Invalid input. The argument should be a numeric string.";
  }

  // convert to minutes first for the ease of calculation
  const timeInMinutes = timeInSeconds / 60;
  let hours = 0;
  let minutes = 0;

  if (timeInMinutes / 60 < 1) {
    minutes = timeInMinutes % 60;
    return `${minutes}min ago`;
  } else {
    hours = Math.trunc(timeInMinutes / 60);
    minutes = Math.trunc(timeInMinutes % 60);
    return `${hours}hrs ${minutes} min ago`;
  }
};

// function to display the loaded video data
const displayVideos = (data, sorted) => {
  const videosContainer = document.getElementById("videos-container");
  // clear any previous video elements before showing the new results
  videosContainer.innerHTML = "";

  // if there is no data in the array hide video container section and show no video message div and vice versa
  if (data.length === 0) {
    toggleVideosContainer(false);
    toggleNoVideoMessage(true);
  } else {
    toggleVideosContainer(true);
    toggleNoVideoMessage(false);

    if (sorted) {
      data.sort(
        (a, b) => parseFloat(b.others.views) - parseFloat(a.others.views)
      );
    }
  }

  // create video elements for the data that has been loaded.
  data.forEach((video) => {
    const videoDiv = document.createElement("div");

    // set the inner html of the videodiv that has been created
    videoDiv.innerHTML = `<div class="w-full aspect-[14/9] rounded-primary overflow-hidden mb-5 relative">
    <img
      class="w-full h-full object-cover"
      src=${video.thumbnail}
      alt="Preview thumbnail of ${video.title}"
    />
    ${
      video.others.posted_date
        ? `<p class="text-[0.625rem] bg-textPrimary px-[0.3125rem] py-1 leading-[normal] right-3 bottom-3 text-white absolute rounded-secondary">${convertTime(
            video.others.posted_date
          )}</p>`
        : ""
    }  
  </div>

  <div class="flex items-start gap-3">
    <div
      class="w-10 aspect-square rounded-full overflow-hidden shrink-0"
    >
      <img
        class="w-full h-full object-cover"
        src=${video.authors[0].profile_picture}
        alt="author photo"
      />
    </div>

    <div class="">
      <h3
        class="text-textPrimary font-bold leading-[1.625rem] mb-[0.5625rem]"
      >
        ${video.title}
      </h3>

      <div class="flex mb-[0.625rem] gap-[0.5625rem]">
        <p class="text-textLight text-sm leading-[normal]">
         ${video.authors[0].profile_name}
        </p>
        
        ${
          video.authors[0].verified
            ? '<img title="Verified Profile" class="w-5 h-5" src="./assets/icon/verified.svg" alt="blue verified icon" />'
            : ""
        }        
      </div>

      <p class="text-textLight text-sm leading-[normal]">${
        video.others?.views ? `${video.others.views} views` : "No views"
      }</p>
    </div>
  </div>`;

    // inject the video elements inside the videos container
    videosContainer.appendChild(videoDiv);
  });
};

// function to load and display videos
const loadVideos = async (categoryId, sorted = false) => {
  // validate the argument
  if (typeof categoryId !== "string") {
    return "Invalid input. Category ID should be a string data type.";
  }

  // all videos api
  const videoApi = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
  const data = await fetchData(videoApi);
  const { data: videosData } = data;

  // display the videos on the page
  displayVideos(videosData, sorted);
};

// function to create the catergory tabs
const displayTabs = (tabsData) => {
  const tabsContainer = document.getElementById("tabs-container");
  // set the first button as the active tab
  activeTab = tabsData[0].category_id;
  //  loading the initial videos
  loadVideos(activeTab);

  // setting the 4 category buttons
  tabsData.forEach((tab) => {
    const button = document.createElement("button");
    // adding necessary classes to buttons/tabs
    button.classList =
      "py-2 px-5 text-textSecondary bg-lightBgPrimary hover:bg-lightBgSecondary transition-all duration-300 rounded-secondary font-medium leading-[normal] category-button";

    // add unique id to the button/tab
    button.setAttribute("id", tab.category_id);

    // adding button text
    button.innerText = tab.category;

    // inject the button elements inside the button/tabs container
    tabsContainer.appendChild(button);

    // set event listeners on the category tabs/buttons and call the loadvideos function to show relevant data and also change the active tab according to the button clicked
    button.addEventListener("click", () => {
      activeTab = tab.category_id;
      // change the appearance of the active tab
      const allButtons = document.querySelectorAll(".category-button");
      removeActiveFromAll(allButtons);
      makeActive(activeTab);
      // load videos according to the category selected
      loadVideos(activeTab);
    });
  });

  // change the appearance of the active tab
  makeActive(activeTab);
};

// function to load and display the category tabs
const loadCategories = async () => {
  // all catergories api
  const categoriesApi =
    "https://openapi.programming-hero.com/api/videos/categories";

  const data = await fetchData(categoriesApi);
  const { data: categoriesData } = data;
  displayTabs(categoriesData);
};

// adding event listener to sort buttons
// mulitple buttons because of responsive design layout
sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loadVideos(activeTab, true);
  });
});

// adding event listener to blog buttons
// mulitple buttons because of responsive design layout
blogButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "./../blog.html";
  });
});

// run basic functionality to start the app
loadCategories();
