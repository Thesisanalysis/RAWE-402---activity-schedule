document.addEventListener('DOMContentLoaded', () => {
    const activityItems = document.querySelectorAll('.activity-list li');

    // Load progress from localStorage
    activityItems.forEach(item => {
        const activityId = item.getAttribute('data-activity');
        if (localStorage.getItem(activityId) === 'completed') {
            item.classList.add('completed');
        }

        // Add click listener to each li
        item.addEventListener('click', () => {
            if (item.classList.contains('completed')) {
                item.classList.remove('completed');
                localStorage.removeItem(activityId);
            } else {
                item.classList.add('completed');
                localStorage.setItem(activityId, 'completed');
            }
        });
    });
});
