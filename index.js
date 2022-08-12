const LAT = 35.16;
const LON = 126.85;
const APIKEY = "7345eaeefd85179f0469b4158544e3fa";





const timer = document.querySelector(".timer");
const texter = document.querySelector(".timer-content")


const starter = document.querySelector(".btn")
const btn = document.querySelector(".asdasd")

let flag=0;

btn.classList.add("on-off");

starter.addEventListener("click", () => {
  btn.classList.toggle("on-off");
});

// starter.addEventListener("click",function(){
//   if(flag === 0 ){
//       flag =1;
//       btn.style.display="none";
//   }
//   if(flag ===1){
//       flag =0;
//       btn.style.display="block";
//   }
// })




const setRenderBackground = async () => {
  const response = await axios.get("https://picsum.photos/1280/720", {
    responseType: "blob",
  });
  const imageURL = URL.createObjectURL(response.data);
  document.querySelector("body").style.backgroundImage = `url(${imageURL})`;
};

const setTime = () => {
  const date = new Date();
  let Hour = date.getHours();
  let Minute = date.getMinutes();
  let Second = date.getSeconds();
  let nowtime = "";
  let nowinsa = "";
  if (11 <= Hour && Hour <= 13) {
    nowinsa = "Good Afterning";
  } else if (6 <= Hour && Hour <= 10) {
    nowinsa = "Good Morning!";
  } else if (21 <= Hour && Hour <= 24) {
    nowinsa = "Good Night!";
  } else {
    nowinsa = "Study Time!";
  }
  if (Hour < 10) {
    nowtime += "0";
  }
  nowtime += Hour + " : ";
  if (Minute < 10) {
    nowtime += "0";
  }
  nowtime += Minute + " : ";

  if (Second < 10) {
    nowtime += "0";
  }
  nowtime += Second;

  // timer.textContent = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  timer.textContent = nowtime;
  texter.textContent = nowinsa;

  // timer.textContent = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const getMemo = () => {
  const memo = document.querySelector(".memo");
  const memoValue = localStorage.getItem("todo");
  memo.textContent = memoValue;
};

const setMemo = () => {
  const memoInput = document.querySelector(".memo-input");
  memoInput.addEventListener("keyup", (evt) => {
    if (evt.code === "Enter" && evt.currentTarget.value) {
      localStorage.setItem("todo", evt.currentTarget.value);
      getMemo();
      memoInput.value = "";
    }
  });
};

const matchIcon = (weatherDate) => {
  if (weatherDate === "Clear") {
    return "./images/039-sun.png";
  }
  if (weatherDate === "Clouds") {
    return "./images/001-cloud.png";
  }
  if (weatherDate === "Rain") {
    return "./images/003-rainy.png";
  }
  if (weatherDate === "Snow") {
    return "./images/006-snowy.png";
  }
  if (weatherDate === "Thunderstorm") {
    return "./images/008-storm.png";
  }
  if (weatherDate === "Drizzle") {
    return "./images/033-hurricane.png";
  }
};

const getWeather = async () => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${APIKEY}`
  );
  return response;
};

const weatherWrapperComponent = (li) => {
  // 절대온도인데 섭씨로 바꿈.
  // 소수 1자리까지
  const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
  return `
    <div class="card">
      <div class="card-header">${li.dt_txt.split(" ")[0]}</div>
      <div class="card-body">
        <h5 class="card-title">${li.weather[0].main}</h5>
        <img
          src="${matchIcon(li.weather[0].main)}"
          width="60px"
          height="60px"
          class="card-img-top"
          alt="날씨"
        />
        <p class="card-text">${changeToCelsius(li.main.temp)}℃</p>
      </div>
    </div>
  `;
};

const renderWeather = async () => {
  const response = await getWeather();
  const weatherData = response.data;
  const weatherList = weatherData.list.reduce((acc, cur) => {
    if (cur.dt_txt.indexOf("18:00:00") > 0) {
      acc.push(cur);
    }
    return acc;
  }, []);
  const cardGroup = document.querySelector(".card-group");
  cardGroup.innerHTML = weatherList
    .map((li) => {
      return weatherWrapperComponent(li);
    })
    .join("");
};

setRenderBackground();
setInterval(() => setRenderBackground(), 5000);
setInterval(() => setTime(), 1000);
getMemo();
setMemo();

renderWeather();