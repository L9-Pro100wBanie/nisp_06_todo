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
});
// ==========================================
// --- MINI GRA: KOT WĘDKARZ (DODATEK) ---
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
// Stan wędki: pozycja kota, obecna długość żyłki, stan (w spoczynku, opada, wraca, złapano)
let hook = { x: 200, y: 50, targetY: 50, state: "idle", caughtFish: null };
let fishes = [];

// Funkcja tworząca nową rybkę z losową prędkością i pozycją
function createFish() {
	return {
		x: Math.random() * canvas.width,
		y: 100 + Math.random() * 160, // Ryby pływają głębiej
		speed: (Math.random() * 2 + 0.5) * (Math.random() > 0.5 ? 1 : -1), // w lewo lub w prawo
		emoji: "🐟",
	};
}

// Inicjalizacja 5 rybek na start
for (let i = 0; i < 5; i++) {
	fishes.push(createFish());
}

// Nasłuchiwanie na kliknięcie w Canvas (woda) - zarzucanie wędki
canvas.addEventListener("mousedown", function (e) {
	if (hook.state === "idle") {
		const rect = canvas.getBoundingClientRect();
		hook.x = e.clientX - rect.left; // Kot przesuwa się tam gdzie klikniesz
		hook.targetY = e.clientY - rect.top; // Spławik opada do miejsca kliknięcia
		hook.state = "dropping";
	}
});

// Główna pętla gry
function gameLoop() {
	// 1. Czyszczenie ekranu (wody) klatka po klatce
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 2. Rysowanie pomostu i Kota
	ctx.fillStyle = "#8B4513"; // kolor drewna
	ctx.fillRect(0, 30, canvas.width, 20); // pomost
	ctx.font = "30px Arial";
	ctx.fillText("🐱", hook.x - 15, 25); // kot siedzi prosto nad żyłką

	// 3. Rysowanie żyłki i haczyka
	ctx.beginPath();
	ctx.moveTo(hook.x, 30);
	ctx.lineTo(hook.x, hook.y);
	ctx.strokeStyle = "#fff"; // biała żyłka
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.fillText("🪝", hook.x - 10, hook.y + 10);

	// 4. Logika poruszania wędki
	if (hook.state === "dropping") {
		hook.y += 3; // spławik opada
		if (hook.y >= hook.targetY || hook.y >= canvas.height - 20) {
			hook.state = "retracting"; // zaczyna zwijać żyłkę
		}
	} else if (hook.state === "retracting" || hook.state === "caught") {
		hook.y -= 2; // spławik wraca do góry
		if (hook.y <= 50) {
			// Jeśli wrócił i miał rybę, dodajemy punkt
			if (hook.state === "caught") {
				score++;
				scoreDisplay.textContent = score;
				// Usuwamy złapaną rybę i tworzymy nową w wodzie
				const fishIndex = fishes.indexOf(hook.caughtFish);
				if (fishIndex > -1) fishes[fishIndex] = createFish();
				hook.caughtFish = null;
			}
			hook.state = "idle"; // Wędka znowu gotowa do zarzucenia
			hook.y = 50;
		}
	}

	// 5. Rysowanie i ruch rybek
	fishes.forEach((fish) => {
		// Jeśli ta ryba NIE JEST złapana, pływa swobodnie
		if (hook.caughtFish !== fish) {
			fish.x += fish.speed;
			// Zawijanie ekranu (ryba wypływa z jednej strony, wraca z drugiej)
			if (fish.x > canvas.width + 20) fish.x = -20;
			if (fish.x < -20) fish.x = canvas.width + 20;

			ctx.font = "24px Arial";
			ctx.fillText(fish.emoji, fish.x, fish.y);

			// Wykrywanie kolizji haczyka z rybą (tylko jak spławik jest w wodzie)
			if (
				(hook.state === "dropping" || hook.state === "retracting") &&
				Math.abs(hook.x - fish.x) < 25 &&
				Math.abs(hook.y - fish.y) < 25
			) {
				hook.state = "caught";
				hook.caughtFish = fish;
			}
		} else {
			// Jeśli ryba jest złapana, jej pozycja to pozycja haczyka
			ctx.fillText("🐟", hook.x - 12, hook.y + 25);
			fish.x = hook.x;
			fish.y = hook.y + 20;
		}
	});

	// Zapętlenie funkcji
	requestAnimationFrame(gameLoop);
}

// Uruchomienie gry
gameLoop();
