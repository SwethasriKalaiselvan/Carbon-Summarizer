document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('input[name="query"]');
    const autocompleteContainer = document.createElement("div");
    autocompleteContainer.classList.add("suggestions");

    searchInput.parentNode.insertBefore(autocompleteContainer, searchInput.nextSibling);

    searchInput.addEventListener("input", async function () {
        const query = this.value;
        if (!query) {
            autocompleteContainer.innerHTML = "";
            return;
        }

        // Fetch suggestions from Wikipedia API
        const response = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${query}&limit=10&format=json`);
        const data = await response.json();
        const suggestions = data[1];

        autocompleteContainer.innerHTML = "";

        if (suggestions.length > 0) {
            const dropdown = document.createElement("div");
            dropdown.classList.add("suggestion-card");

            suggestions.forEach((suggestion) => {
                const item = document.createElement("div");
                item.textContent = suggestion;
                item.addEventListener("click", () => {
                    searchInput.value = suggestion;
                    autocompleteContainer.innerHTML = "";
                });
                dropdown.appendChild(item);
            });

            autocompleteContainer.appendChild(dropdown);
        }
    });

    // Close the dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (!autocompleteContainer.contains(e.target) && e.target !== searchInput) {
            autocompleteContainer.innerHTML = "";
        }
    });
});
