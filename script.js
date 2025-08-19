document.addEventListener('DOMContentLoaded', () => {
    const activityLists = document.querySelectorAll('.activity-list');
    const resetBtn = document.getElementById('resetProgress');
    const exportTxtBtn = document.getElementById('exportProgress');

    // Progress bar setup
    let progressBarFill = document.getElementById('progressBarFill');
    let progressText = document.getElementById('progressText');

    function loadProgress() {
        let total = 0, completed = 0;
        activityLists.forEach(list => {
            list.querySelectorAll('li[data-activity]').forEach(item => {
                total++;
                const id = item.dataset.activity;
                if (localStorage.getItem(id) === 'completed') {
                    item.classList.add('completed');
                    completed++;
                } else {
                    item.classList.remove('completed');
                }
            });
        });
        const percent = total ? Math.round((completed / total) * 100) : 0;
        if (progressBarFill) progressBarFill.style.width = percent + '%';
        if (progressText) progressText.textContent = `Progress: ${completed} / ${total} activities completed (${percent}%)`;
    }

    // Click handler for LI items
    activityLists.forEach(list => {
        list.addEventListener('click', (e) => {
            const li = e.target.closest('li[data-activity]');
            if (!li) return;
            const id = li.dataset.activity;
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                localStorage.setItem(id, 'completed');
            } else {
                localStorage.removeItem(id);
            }
            loadProgress();
        });
    });

    // Reset all progress
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!confirm("Are you sure you want to reset all completed activities?")) return;
            activityLists.forEach(list => {
                list.querySelectorAll('li[data-activity]').forEach(li => li.classList.remove('completed'));
            });
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('week') || key.startsWith('eval')) localStorage.removeItem(key);
            });
            loadProgress();
        });
    }

    // Export TXT of all items (completed + pending)
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener('click', () => {
            let lines = [];
            activityLists.forEach(list => {
                const section = list.closest('.week-section');
                const weekTitle = section ? section.dataset.week : 'Unknown';
                list.querySelectorAll('li[data-activity]').forEach(li => {
                    const status = li.classList.contains('completed') ? 'Completed' : 'Pending';
                    lines.push(`${weekTitle}: ${li.textContent} [${status}]`);
                });
            });
            if (lines.length === 0) return alert("No activities found.");
            const blob = new Blob([lines.join('\n')], {type: 'text/plain'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'RAWE_402_Progress.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Export CSV of all items (completed + pending)
    const exportCsvBtn = document.createElement('button');
    exportCsvBtn.textContent = 'Export CSV';
    exportCsvBtn.style.marginLeft = '10px';
    if (resetBtn) resetBtn.parentNode.appendChild(exportCsvBtn);

    exportCsvBtn.addEventListener('click', () => {
        let csv = 'Week,Activity,Status\n';
        activityLists.forEach(list => {
            const section = list.closest('.week-section');
            const weekTitle = section ? section.dataset.week : 'Unknown';
            list.querySelectorAll('li[data-activity]').forEach(li => {
                const status = li.classList.contains('completed') ? 'Completed' : 'Pending';
                const text = li.textContent.replace(/"/g, '""');
                csv += `"${weekTitle}","${text}","${status}"\n`;
            });
        });
        const blob = new Blob([csv], {type: 'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'RAWE_402_Progress.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    loadProgress();
});
