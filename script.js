// Select form elements
const habitForm = document.getElementById("habitForm");
const habitNameInput = document.getElementById("habitName");
const habitList = document.getElementById("habitList");

// Load habits from LocalStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Display habits on page load
document.addEventListener("DOMContentLoaded", displayHabits);

// Add new habit
habitForm.addEventListener("submit", function (e) {
	e.preventDefault();
	const habitName = habitNameInput.value.trim();
	if (habitName === "") return;

	const newHabit = {
		id: Date.now(),
		name: habitName,
		completed: false,
		days: {},
	};

	habits.push(newHabit);
	saveHabits();
	displayHabits();

	habitForm.reset();
});

// Toggle habit completion for the current day
habitList.addEventListener("click", function (e) {
	if (e.target.tagName === "BUTTON") {
		const habitId = parseInt(e.target.dataset.id);
		const habit = habits.find((h) => h.id === habitId);

		const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
		habit.days[today] = !habit.days[today]; // Toggle completion status

		saveHabits();
		displayHabits();
	}
});

// Save habits to LocalStorage
function saveHabits() {
	localStorage.setItem("habits", JSON.stringify(habits));
}

// Display habits
function displayHabits() {
	habitList.innerHTML = "";

	if (habits.length === 0) {
		habitList.innerHTML = "<li>No habits yet. Add one!</li>";
		return;
	}

	habits.forEach((habit) => {
		const today = new Date().toISOString().split("T")[0]; // Get today's date
		const isCompleted = habit.days[today] || false;

		const habitItem = document.createElement("li");
		habitItem.classList.toggle("completed", isCompleted);

		habitItem.innerHTML = `
            <span>${habit.name}</span>
            <button data-id="${habit.id}">${isCompleted ? "Undo" : "Complete"}</button>
        `;

		habitList.appendChild(habitItem);
	});
}
