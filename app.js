// Pobranie elementów ze strony
const inputField = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// Obsługa zdarzenia kliknięcia przycisku
addButton.addEventListener("click", function () {
	const taskText = inputField.value;

	if (taskText.trim() !== "") {
		const newListItem = document.createElement("li");

		// 1. Tworzenie checkboxa
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";

		// 2. Obsługa zaznaczania checkboxa (Zadanie 4)
		checkbox.addEventListener("change", function () {
			if (this.checked) {
				// Jeśli zaznaczony, dodaj klasę 'completed'
				newListItem.classList.add("completed");
			} else {
				// Jeśli odznaczony, usuń klasę 'completed'
				newListItem.classList.remove("completed");
			}
		});

		// 3. Dodanie checkboxa i tekstu do elementu 'li'
		newListItem.appendChild(checkbox);

		// Tworzymy węzeł tekstowy ze spacją, żeby tekst nie przykleił się do checkboxa
		const textNode = document.createTextNode(" " + taskText);
		newListItem.appendChild(textNode);

		// 4. Dodanie całego elementu do listy
		taskList.appendChild(newListItem);

		inputField.value = "";
	}
});
