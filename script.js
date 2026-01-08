document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('day-form');
    const resultContainer = document.getElementById('result-display');
    const dayOutput = document.getElementById('day-output');

    // Month mapping array (0-indexed but we'll use 1-based logic)
    const months = [
        "", // dummy for 0 index
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get values
        const dateVal = document.getElementById('date-input').value;
        const monthVal = parseInt(document.getElementById('month-input').value);
        const yearVal = document.getElementById('year-input').value;

        // Basic Validation
        if (!dateVal || !monthVal || !yearVal) return;
        if (monthVal < 1 || monthVal > 12) {
            alert("Please enter a valid month (1-12)");
            return;
        }

        // Convert Month Number to Name
        const monthName = months[monthVal];

        // Prepare Payload
        const payload = {
            date: parseInt(dateVal),
            month: monthName,
            year: parseInt(yearVal)
        };

        // UI Loading State (Optional: change button text)
        const btnText = document.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = "Calculating...";

        try {
            // Call API
            // Assuming the Flask server is running locally on port 5000
            const response = await fetch('http://127.0.0.1:5000/api/get-day', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch');
            }

            const data = await response.json();

            // Show Result
            dayOutput.textContent = data.day;
            resultContainer.classList.add('show');

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            resultContainer.classList.remove('show');
        } finally {
            btnText.textContent = originalText;
        }
    });

    // Add some nice input focus effects handled by CSS, but maybe some Tilt effect?
    const card = document.querySelector('.glass-card');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        // subtle tilt
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
});
