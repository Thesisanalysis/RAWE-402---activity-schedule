document.addEventListener('DOMContentLoaded', () => {
    const activityLists = document.querySelectorAll('.activity-list');

    // Prompt user to reset progress if any is stored
    if (Object.keys(localStorage).length > 0) {
        if (confirm("Previous progress detected. Do you want to start fresh? Click OK to reset all data.")) {
            localStorage.clear();
        }
    }

    // Load progress
    function loadProgress() {
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                const id = item.dataset.activity;
                if (localStorage.getItem(id) === 'completed') {
                    item.classList.add('completed');
                }
            });
        });
    }

    // Toggle completion
    function toggleCompletion(e) {
        const item = e.target;
        if (item.tagName !== 'LI') return;
        const id = item.dataset.activity;
        if (item.classList.contains('completed')) {
            item.classList.remove('completed');
            localStorage.removeItem(id);
        } else {
            item.classList.add('completed');
            localStorage.setItem(id, 'completed');
        }
    }

    // Add click listener
    activityLists.forEach(list => list.addEventListener('click', toggleCompletion));

    // Reset progress
    document.getElementById('resetProgress').addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all completed activities?")) {
            localStorage.clear();
            document.querySelectorAll('.activity-list li').forEach(li => li.classList.remove('completed'));
        }
    });

    // Export progress (optional, you may want to polish this feature further)
    document.getElementById('exportProgress').addEventListener('click', () => {
        const completed = [];
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                if (item.classList.contains('completed')) {
                    completed.push(item.innerText);
                }
            });
        });
        alert("Completed activities:\n\n" + completed.join('\n'));
    });

    // Initial load
    loadProgress();
});
