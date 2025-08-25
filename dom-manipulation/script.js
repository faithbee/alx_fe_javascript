s
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show quotes on page
function displayQuotes(filtered = quotes) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  filtered.forEach(q => {
    const div = document.createElement("div");
    div.textContent = `"${q.text}" - ${q.author} [${q.category}]`;
    container.appendChild(div);
  });
}

// Add new quote from form
document.getElementById("addQuoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = document.getElementById("quoteText").value;
  const author = document.getElementById("quoteAuthor").value;
  const category = document.getElementById("quoteCategory").value;

  const newQuote = { text, author, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayQuotes();
  e.target.reset();
});

// Fill category dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  filter.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");

  // Remember last filter
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  filter.value = lastFilter;
  filterQuotes();
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selected);
  if (selected === "all") {
    displayQuotes();
  } else {
    displayQuotes(quotes.filter(q => q.category === selected));
  }
}

// Run on page load
window.onload = () => {
  populateCategories();
  displayQuotes();
};