document.addEventListener('DOMContentLoaded', () => {
    const activityLists = document.querySelectorAll('.activity-list');
    const resetBtn = document.getElementById('resetProgress');
    const exportBtn = document.getElementById('exportProgress');

    // Prompt user to reset progress if any is stored
    if (Object.keys(localStorage).length > 0) {
        if (confirm("Previous progress detected. Do you want to start fresh? Click OK to reset all data.")) {
            localStorage.clear();
        }
    }

    // Load progress from localStorage
    function loadProgress() {
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                const id = item.dataset.activity;
                if (localStorage.getItem(id) === 'completed') {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
            });
        });
    }

    // Toggle completion on click
    function toggleCompletion(e) {
        // Only respond to LI clicks
        if (e.target && e.target.matches('li[data-activity]')) {
            const item = e.target;
            const id = item.dataset.activity;
            if (item.classList.contains('completed')) {
                item.classList.remove('completed');
                localStorage.removeItem(id);
            } else {
                item.classList.add('completed');
                localStorage.setItem(id, 'completed');
            }
        }
    }

    // Attach click listeners to each activity list
    activityLists.forEach(list => list.addEventListener('click', toggleCompletion));

    // Reset progress
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all completed activities?")) {
            localStorage.clear();
            loadProgress();
        }
    });

    // Export progress to downloadable txt file
    exportBtn.addEventListener('click', () => {
        let completed = [];
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                if (item.classList.contains('completed')) {
                    // Week info from parent section
                    const weekSection = item.closest('.week-section');
                    const weekTitle = weekSection ? weekSection.querySelector('h2').textContent : '';
                    completed.push(`${weekTitle}: ${item.textContent.trim()}`);
                }
            });
        });
        if (completed.length === 0) {
            alert("No completed activities to export.");
            return;
        }
        const blob = new Blob([completed.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'completed_activities.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Initial load
    loadProgress();
});
