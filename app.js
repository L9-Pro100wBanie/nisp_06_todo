// Pobranie elementów ze strony
const inputField = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// Obsługa zdarzenia kliknięcia przycisku
addButton.addEventListener("click", function () {
	// 1. Pobierz wartość z pola tekstowego
	const taskText = inputField.value;

	// Sprawdzenie, czy pole nie jest puste
	if (taskText.trim() !== "") {
		// 2. Utwórz nowy element 'li'
		const newListItem = document.createElement("li");
		newListItem.textContent = taskText;

		// 3. Dodaj nowy element do listy #task-list
		taskList.appendChild(newListItem);

		// Opcjonalnie: Wyczyść pole tekstowe po dodaniu zadania
		inputField.value = "";
	}
});
