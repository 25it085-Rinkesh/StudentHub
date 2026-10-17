// =========================================================
// StudentHub - Events Dynamic JSON Handler (Practical 06)
// File: js/events.js
// Description: Consumes external JSON data via Fetch API,
//              implements search, category filter, multi-criteria
//              sorting, client-side pagination, and localStorage cache.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    // DOM Element References
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortEvents = document.getElementById("sortEvents");
    const loadingMessage = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");
    const eventList = document.getElementById("eventList");
    const pagination = document.getElementById("pagination");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");

    if (!eventList) return;

    // State Variables
    let allEvents = [];
    let filteredEvents = [];
    let currentPage = 1;
    const itemsPerPage = 6; // 6 items per page for clean pagination (15 records -> 6, 6, 3)

    // Fetch Events Data from external JSON
    async function fetchEvents() {
        showLoading(true);
        hideError();

        try {
            const response = await fetch("../data/events.json");
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            allEvents = data;

            // Advanced Extension: Cache response in localStorage for offline resiliency
            try {
                localStorage.setItem("studenthub_events_cache", JSON.stringify(data));
            } catch (cacheErr) {
                console.warn("Unable to cache events to localStorage:", cacheErr);
            }

            applyFiltersAndSort();
        } catch (error) {
            console.error("Error fetching events:", error);
            // Attempt to recover from localStorage cache
            const cached = localStorage.getItem("studenthub_events_cache");
            if (cached) {
                try {
                    allEvents = JSON.parse(cached);
                    showError("Notice: Loaded cached event data (offline mode).");
                    applyFiltersAndSort();
                    return;
                } catch (e) {
                    // Ignore parse error and proceed to show standard error
                }
            }
            showError("Failed to load upcoming events. Please verify network connectivity and ensure data/events.json exists.");
        } finally {
            showLoading(false);
        }
    }

    // UI Helper: Loading State
    function showLoading(isLoading) {
        if (loadingMessage) {
            loadingMessage.style.display = isLoading ? "block" : "none";
        }
    }

    // UI Helper: Error State
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }

    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = "none";
            errorMessage.textContent = "";
        }
    }

    // Category Badge Helper
    function getCategoryClass(category) {
        const cat = (category || "").toLowerCase();
        switch (cat) {
            case "technical":
                return "badge-technical";
            case "workshop":
                return "badge-workshop";
            case "sports":
                return "badge-sports";
            case "cultural":
                return "badge-cultural";
            case "career":
                return "badge-career";
            default:
                return "badge-default";
        }
    }

    // Format Date string
    function formatDate(dateStr) {
        try {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(dateStr).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateStr;
        }
    }

    // Render Event Cards for Current Page
    function renderEvents() {
        eventList.innerHTML = "";

        if (filteredEvents.length === 0) {
            eventList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                    <p style="font-size: 16px; font-weight: 500;">No events match your search or filter criteria.</p>
                </div>
            `;
            updatePaginationUI(0, 0);
            return;
        }

        const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

        pageItems.forEach(function (event) {
            const card = document.createElement("article");
            card.className = "event-card";

            const badgeClass = getCategoryClass(event.category);

            card.innerHTML = `
                <div>
                    <span class="event-category-badge ${badgeClass}">${escapeHtml(event.category || "General")}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                </div>
                <div style="margin-top: 14px;">
                    <p class="event-meta">
                        <strong>📅 Date:</strong> <span>${escapeHtml(formatDate(event.date))}</span>
                    </p>
                    <p class="event-meta">
                        <strong>📍 Location:</strong> <span>${escapeHtml(event.location)}</span>
                    </p>
                </div>
            `;

            eventList.appendChild(card);
        });

        updatePaginationUI(currentPage, totalPages);
    }

    // Update Pagination Controls UI
    function updatePaginationUI(current, total) {
        if (!pagination || !prevPageBtn || !nextPageBtn || !pageNumber) return;

        if (total <= 1) {
            pagination.style.display = total === 1 ? "flex" : "none";
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
            pageNumber.textContent = total === 1 ? "Page 1 of 1" : "No Pages";
            return;
        }

        pagination.style.display = "flex";
        pageNumber.textContent = `Page ${current} of ${total}`;
        prevPageBtn.disabled = current <= 1;
        nextPageBtn.disabled = current >= total;
    }

    // Apply Search, Filter, and Sort in Pipeline
    function applyFiltersAndSort() {
        const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
        const selectedCategory = categoryFilter ? categoryFilter.value : "all";
        const sortCriteria = sortEvents ? sortEvents.value : "default";

        // 1. Filter
        filteredEvents = allEvents.filter(function (event) {
            const matchesSearch = !query || event.title.toLowerCase().includes(query);
            const matchesCategory =
                selectedCategory === "all" ||
                (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());
            return matchesSearch && matchesCategory;
        });

        // 2. Sort
        filteredEvents.sort(function (a, b) {
            switch (sortCriteria) {
                case "az":
                    return a.title.localeCompare(b.title);
                case "za":
                    return b.title.localeCompare(a.title);
                case "dateAsc":
                    return new Date(a.date) - new Date(b.date);
                case "dateDesc":
                    return new Date(b.date) - new Date(a.date);
                case "default":
                default:
                    return (a.id || 0) - (b.id || 0);
            }
        });

        // Reset to first page whenever search/filter/sort changes
        currentPage = 1;
        renderEvents();
    }

    // XSS Prevention Helper
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Event Listeners for User Interactivity
    if (searchInput) {
        searchInput.addEventListener("input", applyFiltersAndSort);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFiltersAndSort);
    }

    if (sortEvents) {
        sortEvents.addEventListener("change", applyFiltersAndSort);
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderEvents();
                // Smooth scroll back to events section top on page change
                eventList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", function () {
            const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderEvents();
                eventList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    // Initial Load
    fetchEvents();
});
