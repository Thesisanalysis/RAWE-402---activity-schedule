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
            document.querySelectorAll('.activity-list li').forEach(li => li.classList.remove('completed'));
        }
    });

    // Export progress
    document.getElementById('exportProgress').addEventListener('click', () => {
        let csv = "Week,Activity,Status\n";
        activityLists.forEach(section => {
            const week = section.previousElementSibling ? section.previousElementSibling.textContent : "Evaluation";
            section.querySelectorAll('li').forEach(li => {
                const status = li.classList.contains('completed') ? "Completed" : "Pending";
                csv += `"${week}","${li.textContent}","${status}"\n`;
            });
        });
        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "RAWE_402_Progress.csv";
        a.click();
        URL.revokeObjectURL(url);
    });

    loadProgress();
});
