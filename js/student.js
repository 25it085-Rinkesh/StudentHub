// =========================================================
// StudentHub - Student Directory Dynamic JSON Handler (Practical 06)
// File: js/student.js
// Description: Consumes students.json via Fetch API,
//              implements search, course/year filters, sorting,
//              client-side pagination, and localStorage caching.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    const studentSearch = document.getElementById("studentSearch");
    const courseFilter = document.getElementById("courseFilter");
    const yearFilter = document.getElementById("yearFilter");
    const studentSort = document.getElementById("studentSort");
    const studentLoading = document.getElementById("studentLoading");
    const studentError = document.getElementById("studentError");
    const studentList = document.getElementById("studentList");
    const studentPagination = document.getElementById("studentPagination");
    const studentPrevBtn = document.getElementById("studentPrev");
    const studentNextBtn = document.getElementById("studentNext");
    const studentPageNumber = document.getElementById("studentPageNumber");

    if (!studentList) return;

    let allStudents = [];
    let filteredStudents = [];
    let currentPage = 1;
    const itemsPerPage = 6; // 6 items per page for clean pagination (15 records -> 6, 6, 3)

    // Fetch Students Data from external JSON
    async function fetchStudents() {
        showLoading(true);
        hideError();

        try {
            const response = await fetch("../data/students.json");
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            allStudents = data;

            // Cache response in localStorage
            try {
                localStorage.setItem("studenthub_students_cache", JSON.stringify(data));
            } catch (cacheErr) {
                console.warn("Unable to cache students to localStorage:", cacheErr);
            }

            applyFiltersAndSort();
        } catch (error) {
            console.error("Error fetching students:", error);
            const cached = localStorage.getItem("studenthub_students_cache");
            if (cached) {
                try {
                    allStudents = JSON.parse(cached);
                    showError("Notice: Loaded cached student directory (offline mode).");
                    applyFiltersAndSort();
                    return;
                } catch (e) {
                    // Ignore
                }
            }
            showError("Failed to load student profiles. Please verify that data/students.json exists.");
        } finally {
            showLoading(false);
        }
    }

    // UI Helpers
    function showLoading(isLoading) {
        if (studentLoading) {
            studentLoading.style.display = isLoading ? "block" : "none";
        }
    }

    function showError(message) {
        if (studentError) {
            studentError.textContent = message;
            studentError.style.display = "block";
        }
    }

    function hideError() {
        if (studentError) {
            studentError.style.display = "none";
            studentError.textContent = "";
        }
    }

    // Extract initials from name for avatar
    function getInitials(name) {
        if (!name) return "ST";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    // Render Student Cards
    function renderStudents() {
        studentList.innerHTML = "";

        if (filteredStudents.length === 0) {
            studentList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
                    <p style="font-size: 16px; font-weight: 500;">No students match your search or filter criteria.</p>
                </div>
            `;
            updatePaginationUI(0, 0);
            return;
        }

        const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

        pageItems.forEach(function (student) {
            const card = document.createElement("article");
            card.className = "student-card";

            const initials = getInitials(student.name);

            card.innerHTML = `
                <div class="student-header">
                    <div class="student-avatar">${escapeHtml(initials)}</div>
                    <div class="student-info">
                        <h3>${escapeHtml(student.name)}</h3>
                        <p class="student-email">${escapeHtml(student.email)}</p>
                    </div>
                </div>
                <div class="student-badges">
                    <span class="badge-course">🎓 ${escapeHtml(student.course || "N/A")}</span>
                    <span class="badge-year">📅 Year ${escapeHtml(String(student.year || "N/A"))}</span>
                </div>
            `;

            studentList.appendChild(card);
        });

        updatePaginationUI(currentPage, totalPages);
    }

    // Update Pagination UI
    function updatePaginationUI(current, total) {
        if (!studentPagination || !studentPrevBtn || !studentNextBtn || !studentPageNumber) return;

        if (total <= 1) {
            studentPagination.style.display = total === 1 ? "flex" : "none";
            studentPrevBtn.disabled = true;
            studentNextBtn.disabled = true;
            studentPageNumber.textContent = total === 1 ? "Page 1 of 1" : "No Pages";
            return;
        }

        studentPagination.style.display = "flex";
        studentPageNumber.textContent = `Page ${current} of ${total}`;
        studentPrevBtn.disabled = current <= 1;
        studentNextBtn.disabled = current >= total;
    }

    // Apply Filter, Search, and Sort Pipeline
    function applyFiltersAndSort() {
        const query = (studentSearch ? studentSearch.value : "").trim().toLowerCase();
        const selectedCourse = courseFilter ? courseFilter.value : "all";
        const selectedYear = yearFilter ? yearFilter.value : "all";
        const sortCriteria = studentSort ? studentSort.value : "default";

        filteredStudents = allStudents.filter(function (student) {
            const nameMatch = (student.name || "").toLowerCase().includes(query);
            const emailMatch = (student.email || "").toLowerCase().includes(query);
            const matchesSearch = !query || nameMatch || emailMatch;

            const matchesCourse =
                selectedCourse === "all" ||
                (student.course && student.course.toLowerCase() === selectedCourse.toLowerCase());

            const matchesYear =
                selectedYear === "all" ||
                String(student.year) === selectedYear;

            return matchesSearch && matchesCourse && matchesYear;
        });

        filteredStudents.sort(function (a, b) {
            switch (sortCriteria) {
                case "nameAsc":
                    return (a.name || "").localeCompare(b.name || "");
                case "nameDesc":
                    return (b.name || "").localeCompare(a.name || "");
                case "yearAsc":
                    return (a.year || 0) - (b.year || 0);
                case "yearDesc":
                    return (b.year || 0) - (a.year || 0);
                case "default":
                default:
                    return (a.id || 0) - (b.id || 0);
            }
        });

        currentPage = 1;
        renderStudents();
    }

    // HTML Escaping
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
    if (studentSearch) {
        studentSearch.addEventListener("input", applyFiltersAndSort);
    }

    if (courseFilter) {
        courseFilter.addEventListener("change", applyFiltersAndSort);
    }

    if (yearFilter) {
        yearFilter.addEventListener("change", applyFiltersAndSort);
    }

    if (studentSort) {
        studentSort.addEventListener("change", applyFiltersAndSort);
    }

    if (studentPrevBtn) {
        studentPrevBtn.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderStudents();
                studentList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    if (studentNextBtn) {
        studentNextBtn.addEventListener("click", function () {
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderStudents();
                studentList.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    fetchStudents();
});
