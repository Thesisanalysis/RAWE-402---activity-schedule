document.addEventListener('DOMContentLoaded', () => {
    const activityLists = document.querySelectorAll('.activity-list');

    // Load progress
    function loadProgress() {
        activityLists.forEach(list => {
            list.querySelectorAll('li').forEach(item => {
                const id = item.dataset.activity;
                if(localStorage.getItem(id) === 'completed'){
                    item.classList.add('completed');
                }
            });
        });
    }

    // Toggle completion
    function toggleCompletion(e) {
        const item = e.target;
        if(item.tagName !== 'LI') return;
        const id = item.dataset.activity;
        if(item.classList.contains('completed')){
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
        if(confirm("Are you sure you want to reset all completed activities?")){
            localStorage.clear();
            document.querySelectorAll('.activity-list li').forEach(li => li.classList.remove('
