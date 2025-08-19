document.addEventListener('DOMContentLoaded', () => {
    // Utility selectors
    const activityLists = document.querySelectorAll('.activity-list');
    const resetBtn = document.getElementById('resetProgress');
    const exportTxtBtn = document.getElementById('exportProgress');
    // CSV export button: auto-add if missing
    let exportCsvBtn = document.getElementById('exportCSV');
    if (!exportCsvBtn) {
        exportCsvBtn = document.createElement('button');
        exportCsvBtn.id = 'exportCSV';
        exportCsvBtn.textContent = 'Export CSV';
        exportCsvBtn.style.marginLeft = '10px';
        if (resetBtn) resetBtn.parentNode.appendChild(exportCsvBtn);
    }

    // Add progress bar UI if missing
    let progressBar = document.getElementById('progressBar');
    let progressText = document.getElementById('progressText');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.style.height = '12px';
        progressBar.style.background = '#e0e0e0';
        progressBar.style.borderRadius = '8px';
        progressBar.style.margin = '18px 0';
        progressBar.innerHTML = '<div style="height:100%;width:0;background:#4caf50;border-radius:8px;transition:width 0.2s;" id="progressBarFill"></div>';
        document.body.insertBefore(progressBar, document.body.firstChild);
    }
    if (!progressText) {
        progressText = document.createElement('div');
        progressText.id = 'progressText';
        progressText.style.fontWeight = 'bold';
        progressText.style.marginBottom = '10px';
        document.body.insertBefore(progressText, progressBar.nextSibling);
    }

    // Start fresh logic (only for activity keys, not everything in localStorage)
    if (Object.keys(localStorage).some(key => key.startsWith('week') || key.startsWith('eval'))) {
        if (confirm("Previous progress detected. Do you want to start fresh? Click OK to reset all data.")) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('week') || key.startsWith('eval')) localStorage.removeItem(key);
            });
        }
    }

    // Load progress and update UI
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
        // Progress bar
        let percent = total ? Math.round((completed / total) * 100) : 0;
        document.getElementById('progressBarFill').style.width = percent + '%';
        progressText.textContent = `Progress: ${completed} / ${total} activities completed (${percent}%)`;
    }

    // Click handler (robust)
    activityLists.forEach(list => {
        list.addEventListener('click', function (e) {
            let li = e.target.closest('li[data-activity]');
            if (!li) return;
            const id = li.dataset.activity;
            if (li.classList.contains('completed')) {
                li.classList.remove('completed');
                localStorage.removeItem(id);
            } else {
                li.classList.add('completed');
                localStorage.setItem(id, 'completed');
            }
            loadProgress();
        });
    });

    // Reset progress
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset all completed activities?")) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('week') || key.startsWith('eval')) localStorage.removeItem(key);
                });
                loadProgress();
            }
        });
    }

    // Export TXT
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener('click', () => {
            let completed = [];
            activityLists.forEach(list => {
                list.querySelectorAll('li.completed').forEach(item => {
                    const weekSection = item.closest('.week-section');
                    const weekTitle = weekSection ? weekSection.querySelector('h2').textContent.trim() : '';
                    completed.push((weekTitle ? weekTitle + ': ' : '') + item.textContent.trim());
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
    }

    // Export CSV
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            let completed = [];
            activityLists.forEach(list => {
                list.querySelectorAll('li.completed').forEach(item => {
                    const weekSection = item.closest('.week-section');
                    const weekTitle = weekSection ? weekSection.querySelector('h2').textContent.trim() : '';
                    completed.push(`"${weekTitle}","${item.textContent.trim()}"`);
                });
            });
            if (completed.length === 0) {
                alert("No completed activities to export.");
                return;
            }
            const csv = 'Week,Activity\n' + completed.join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'completed_activities.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initial UI update
    loadProgress();
});
