let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ✅ Load from local storage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote (with filter consideration)
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;

  // Save last viewed quote (session storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Restore last quote & filter on load
window.onload = function () {
  // Restore filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    document.getElementById("categoryFilter").value = savedFilter;
  }

  // Repopulate categories before restoring
  populateCategories();

  // Restore last viewed quote
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
  }
};

// Event listener for random quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (newQuote.text && newQuote.category) {
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // ✅ update dropdown if new category
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// ✅ Create the form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Call to render form
createAddQuoteForm();

// ✅ Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear existing options (except "All")
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore saved filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// ✅ Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory); // save choice
  showRandomQuote(); // refresh display
}

// ✅ Export quotes
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ✅ Import quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // update dropdown
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}