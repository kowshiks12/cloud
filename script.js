// Sample items data with auction end times
const items = [
  {
    id: 1,
    name: "Antique Vase",
    startingBid: 100,
    endTime: new Date().getTime() + 60000,
  },
  {
    id: 2,
    name: "Vintage Watch",
    startingBid: 150,
    endTime: new Date().getTime() + 120000,
  },
  {
    id: 3,
    name: "Rare Coin",
    startingBid: 200,
    endTime: new Date().getTime() + 180000,
  },
];

let bids = {};
let bidHistory = {};
let currentUser = null;

function loadItems() {
  const itemContainer = document.getElementById("items");
  const itemSelect = document.getElementById("item");
  itemContainer.innerHTML = "";
  itemSelect.innerHTML = "";

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `<strong>${item.name}</strong> - Starting Bid: $${item.startingBid} <br> Ends in <span id="timer-${item.id}"></span>`;
    itemContainer.appendChild(itemDiv);

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    itemSelect.appendChild(option);

    bids[item.id] = item.startingBid;
    bidHistory[item.id] = [];
    startTimer(item.id, item.endTime);
  });
}

function startTimer(itemId, endTime) {
  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      document.getElementById(`timer-${itemId}`).textContent = "Auction ended";
      clearInterval(timerInterval);
    } else {
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      document.getElementById(
        `timer-${itemId}`
      ).textContent = `${minutes}m ${seconds}s`;
    }
  }, 1000);
}

function displayHighestBid(itemId) {
  const highestBidDiv = document.getElementById("highestBid");
  const selectedItem = items.find((item) => item.id == itemId);
  const highestBid = bids[itemId];
  highestBidDiv.textContent = `Highest bid for ${selectedItem.name}: $${highestBid}`;

  const bidHistoryDiv = document.getElementById("bidHistory");
  bidHistoryDiv.innerHTML =
    "Bid History:<br>" +
    bidHistory[itemId].map((b) => `${b.user}: $${b.amount}`).join("<br>");
}

document.getElementById("bidForm").addEventListener("submit", function (event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please log in to place a bid.");
    return;
  }

  const itemId = document.getElementById("item").value;
  const bidAmount = parseFloat(document.getElementById("bidAmount").value);

  if (bidAmount > bids[itemId]) {
    bids[itemId] = bidAmount;
    bidHistory[itemId].push({ user: currentUser, amount: bidAmount });
    displayHighestBid(itemId);
    alert("Bid placed successfully!");
  } else {
    alert("Please place a higher bid.");
  }
});

function openRegister() {
  document.getElementById("registerModal").style.display = "flex";
}

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    localStorage.setItem(username, password);
    alert("Registration successful! Please log in.");
    closeModal("registerModal");
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (localStorage.getItem(username) === password) {
      currentUser = username;
      document.getElementById(
        "userGreeting"
      ).textContent = `Welcome, ${currentUser}!`;
      closeModal("loginModal");
    } else {
      alert("Incorrect username or password.");
    }
  });

loadItems();
displayHighestBid(items[0].id);
