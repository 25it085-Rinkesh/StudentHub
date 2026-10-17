// =========================================================
// StudentHub - FAQs Dynamic JSON Handler (Practical 06)
// File: js/faq.js
// Description: Consumes faqs.json via Fetch API,
//              implements search, sorting, and client-side pagination.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    const faqSearch = document.getElementById("faqSearch");
    const faqSort = document.getElementById("faqSort");
    const faqList = document.getElementById("faqList");
    const faqPagination = document.getElementById("faqPagination");
    const faqPrevBtn = document.getElementById("faqPrev");
    const faqNextBtn = document.getElementById("faqNext");
    const faqPageNumber = document.getElementById("faqPageNumber");

    if (!faqList) return;

    let allFaqs = [];
    let filteredFaqs = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    // Fetch FAQs from external JSON
    async function fetchFaqs() {
        faqList.innerHTML = `<div style="text-align: center; padding: 20px; color: #0284c7;">Loading FAQs...</div>`;

        try {
            const response = await fetch("../data/faqs.json");
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            allFaqs = data;

            // Cache in localStorage
            try {
                localStorage.setItem("studenthub_faqs_cache", JSON.stringify(data));
            } catch (cacheErr) {
                console.warn("Unable to cache faqs to localStorage:", cacheErr);
            }

            applyFiltersAndSort();
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            const cached = localStorage.getItem("studenthub_faqs_cache");
            if (cached) {
                try {
                    allFaqs = JSON.parse(cached);
                    applyFiltersAndSort();
                    return;
                } catch (e) {
                    // Ignore
                }
            }
            faqList.innerHTML = `
                <div style="background-color: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; text-align: center;">
                    Failed to load FAQs. Please ensure data/faqs.json exists.
                </div>
            `;
        }
    }

    // Render FAQ items for the current page
    function renderFaqs() {
        faqList.innerHTML = "";

        if (filteredFaqs.length === 0) {
            faqList.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #64748b;">
                    No FAQs match your search query.
                </div>
            `;
            updatePaginationUI(0, 0);
            return;
        }

        const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filteredFaqs.slice(startIndex, startIndex + itemsPerPage);

        pageItems.forEach(function (faq) {
            const card = document.createElement("div");
            card.className = "faq-card";

            card.innerHTML = `
                <h3>❓ ${escapeHtml(faq.question)}</h3>
                <p>💡 ${escapeHtml(faq.answer)}</p>
            `;

            faqList.appendChild(card);
        });

        updatePaginationUI(currentPage, totalPages);
    }

    // Update Pagination UI
    function updatePaginationUI(current, total) {
        if (!faqPagination || !faqPrevBtn || !faqNextBtn || !faqPageNumber) return;

        if (total <= 1) {
            faqPagination.style.display = total === 1 ? "flex" : "none";
            faqPrevBtn.disabled = true;
            faqNextBtn.disabled = true;
            faqPageNumber.textContent = total === 1 ? "Page 1 of 1" : "No Pages";
            return;
        }

        faqPagination.style.display = "flex";
        faqPageNumber.textContent = `Page ${current} of ${total}`;
        faqPrevBtn.disabled = current <= 1;
        faqNextBtn.disabled = current >= total;
    }

    // Apply Search and Sort
    function applyFiltersAndSort() {
        const query = (faqSearch ? faqSearch.value : "").trim().toLowerCase();
        const sortCriteria = faqSort ? faqSort.value : "default";

        filteredFaqs = allFaqs.filter(function (faq) {
            return !query || (faq.question && faq.question.toLowerCase().includes(query)) ||
                             (faq.answer && faq.answer.toLowerCase().includes(query));
        });

        filteredFaqs.sort(function (a, b) {
            switch (sortCriteria) {
                case "az":
                    return (a.question || "").localeCompare(b.question || "");
                case "za":
                    return (b.question || "").localeCompare(a.question || "");
                case "default":
                default:
                    return (a.id || 0) - (b.id || 0);
            }
        });

        currentPage = 1;
        renderFaqs();
    }

    // XSS Escape Helper
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Event Listeners
    if (faqSearch) {
        faqSearch.addEventListener("input", applyFiltersAndSort);
    }

    if (faqSort) {
        faqSort.addEventListener("change", applyFiltersAndSort);
    }

    if (faqPrevBtn) {
        faqPrevBtn.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderFaqs();
                faqList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    if (faqNextBtn) {
        faqNextBtn.addEventListener("click", function () {
            const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderFaqs();
                faqList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    fetchFaqs();
});
