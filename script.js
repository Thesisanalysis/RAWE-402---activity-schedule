document.addEventListener('DOMContentLoaded', () => {
    const activityLists = document.querySelectorAll('.activity-list');

    // Load progress from localStorage
    function loadProgress() {
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                const activityId = item.getAttribute('data-activity');
                if (localStorage.getItem(activityId) === 'completed') {
                    item.classList.add('completed');
                }
            });
        });
    }

    // Save progress to localStorage and update class
    function toggleCompletion(event) {
        const item = event.target;
        const activityId = item.getAttribute('data-activity');

        if (item.classList.contains('completed')) {
            item.classList.remove('completed');
            localStorage.removeItem(activityId);
        } else {
            item.classList.add('completed');
            localStorage.setItem(activityId, 'completed');
        }
    }

    // Add click listeners to all activities
    activityLists.forEach(list => {
        list.addEventListener('click', toggleCompletion);
    });

    // Run on page load
    loadProgress();
});