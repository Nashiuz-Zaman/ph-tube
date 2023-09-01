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

// function to create the catergory tabs
const displayTabs = (tabsData) => {
  const tabsContainer = document.getElementById("tabs-container");

  // setting the 4 category buttons
  tabsData.forEach((tab) => {
    const button = document.createElement("button");
    // adding necessary classes
    button.classList =
      "fuck py-2 px-5 bg-lightBgPrimary hover:bg-lightBgSecondary transition-all duration-300 rounded-secondary font-medium leading-[normal]";

    // adding button text
    button.innerText = tab.category;
    tabsContainer.appendChild(button);
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

const displayVideos = (data) => {
  const videosContainer = document.getElementById("videos-container");
  const videoDiv = document.createElement("div");
  videoDiv.innerHTML = 
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

loadCategories();
