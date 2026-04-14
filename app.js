// Pobranie elementów ze strony
const inputField = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// Obsługa zdarzenia kliknięcia przycisku "Dodaj"
addButton.addEventListener("click", function () {
	const taskText = inputField.value;

	if (taskText.trim() !== "") {
		const newListItem = document.createElement("li");

		// 1. Tworzenie checkboxa
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.addEventListener("change", function () {
			if (this.checked) {
				newListItem.classList.add("completed");
			} else {
				newListItem.classList.remove("completed");
			}
		});
		newListItem.appendChild(checkbox);

		// 2. Dodanie tekstu zadania
		const textNode = document.createTextNode(" " + taskText);
		newListItem.appendChild(textNode);

		// 3. Tworzenie przycisku "Usuń" (Zadanie 5)
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Usuń";
		deleteButton.classList.add("delete-btn"); // Dodajemy klasę dla CSS

		// Obsługa kliknięcia w "Usuń"
		deleteButton.addEventListener("click", function () {
			newListItem.remove(); // Ta funkcja usuwa nasz element li z listy
		});

		// Dodanie przycisku do zadania
		newListItem.appendChild(deleteButton);

		// 4. Dodanie całości (checkbox + tekst + przycisk) do listy na stronie
		taskList.appendChild(newListItem);

		// Wyczyszczenie pola po dodaniu
		inputField.value = "";
	}
});
