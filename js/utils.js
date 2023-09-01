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

const displayVideos = (data) => {
  console.log(data);
  const videosContainer = document.getElementById("videos-container");
  videosContainer.innerHTML = "";

  data.forEach((video) => {
    const videoDiv = document.createElement("div");
    videoDiv.innerHTML = `<div class="w-full aspect-[14/9] rounded-primary overflow-hidden mb-5">
    <img
      class="w-full h-full object-cover"
      src=${video.thumbnail}
      alt=${video.title}
    />
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
            ? '<img class="w-5 h-5" src="./assets/icon/verified.svg" alt="blue verified icon" />'
            : ""
        }        
      </div>

      <p class="text-textLight text-sm leading-[normal]">${
        video.others?.views ? `${video.others.views} views` : "No views"
      }</p>
    </div>
  </div>`;
    videosContainer.appendChild(videoDiv);
  });
};

// function to load and display videos
const loadVideos = async (categoryId) => {
  // validate the argument
  if (typeof categoryId !== "string") {
    return "Invalid input. Category ID should be a string data type.";
  }

  // all videos api
  const videoApi = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
  const data = await fetchData(videoApi);
  const { data: videosData } = data;

  displayVideos(videosData);
};

// function to create the catergory tabs
const displayTabs = (tabsData) => {
  const tabsContainer = document.getElementById("tabs-container");

  // setting the 4 category buttons
  tabsData.forEach((tab) => {
    const button = document.createElement("button");
    // adding necessary classes
    button.classList =
      "py-2 px-5 text-textSecondary bg-lightBgPrimary hover:bg-lightBgSecondary transition-all duration-300 rounded-secondary font-medium leading-[normal]";

    // adding button text
    button.innerText = tab.category;
    tabsContainer.appendChild(button);

    // set event listeners on the category tabs/buttons
    button.addEventListener("click", () => {
      loadVideos(tab.category_id);
    });
  });
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

loadCategories();
loadVideos("1000");
