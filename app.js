// --- ZMIENNE STANU DLA EFEKTÓW ---
let pendingTaskClass = ""; // Tu przechowamy klasę dla następnego zadania
let catchEffectTimer = 0; // Do wyświetlania napisu na ekranie
let catchEffectMsg = "";

const inputField = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// ZMODYFIKOWANA OBSŁUGA DODAWANIA ZADANIA (Zadanie 6)
addButton.addEventListener("click", function () {
	const taskText = inputField.value;
	if (taskText.trim() !== "") {
		const newListItem = document.createElement("li");

		// Aplikujemy specjalną klasę, jeśli została wyłowiona
		if (pendingTaskClass !== "") {
			newListItem.classList.add(pendingTaskClass);
			pendingTaskClass = ""; // Resetujemy po użyciu na 1 zadaniu
		}

		// Reszta logiki (checkbox, tekst, usuń) pozostaje bez zmian
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.addEventListener("change", function () {
			this.checked
				? newListItem.classList.add("completed")
				: newListItem.classList.remove("completed");
		});

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Usuń";
		deleteButton.classList.add("delete-btn");
		deleteButton.addEventListener("click", () => newListItem.remove());

		newListItem.appendChild(checkbox);
		newListItem.appendChild(document.createTextNode(" " + taskText));
		newListItem.appendChild(deleteButton);
		taskList.appendChild(newListItem);
		inputField.value = "";
	}
});

// --- LOGIKA GRY Z EFEKTAMI ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
let hook = { x: 200, y: 50, targetY: 50, state: "idle", caughtFish: null };
let fishes = [];

function createFish() {
	return {
		x: Math.random() * canvas.width,
		y: 100 + Math.random() * 160,
		speed: (Math.random() * 2 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
		emoji: "🐟",
	};
}
for (let i = 0; i < 5; i++) fishes.push(createFish());

canvas.addEventListener("mousedown", (e) => {
	if (hook.state === "idle") {
		const rect = canvas.getBoundingClientRect();
		hook.x = e.clientX - rect.left;
		hook.targetY = e.clientY - rect.top;
		hook.state = "dropping";
	}
});

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Rysowanie kota i żyłki
	ctx.fillStyle = "#8B4513";
	ctx.fillRect(0, 30, canvas.width, 20);
	ctx.font = "30px Arial";
	ctx.fillText("🐱", hook.x - 15, 25);
	ctx.beginPath();
	ctx.moveTo(hook.x, 30);
	ctx.lineTo(hook.x, hook.y);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.fillText("🪝", hook.x - 10, hook.y + 10);

	// Mechanika wyławiania
	if (hook.state === "dropping") {
		hook.y += 3;
		if (hook.y >= hook.targetY) hook.state = "retracting";
	} else if (hook.state === "retracting" || hook.state === "caught") {
		hook.y -= 2;
		if (hook.y <= 50) {
			if (hook.state === "caught") {
				score++;
				scoreDisplay.textContent = score;

				// --- LOGIKA NAGRÓD (Zadanie 6) ---
				if (score === 67) {
					pendingTaskClass = "task-67"; // Najwyższy priorytet
					catchEffectMsg = "LEGENDARNA RYBA 67! ✨";
					catchEffectTimer = 100;
				} else if (score % 10 === 0) {
					// Żółty kolor tylko jeśli NIE mamy aktualnie oczekującej nagrody 67
					if (pendingTaskClass !== "task-67") {
						pendingTaskClass = "task-yellow";
					}
					catchEffectMsg = "ZŁOTA RYBKA (10)! 🌟";
					catchEffectTimer = 80;
				} else {
					catchEffectMsg = "+1 Ryba";
					catchEffectTimer = 40;
				}

				const fishIndex = fishes.indexOf(hook.caughtFish);
				fishes[fishIndex] = createFish();
				hook.caughtFish = null;
			}
			hook.state = "idle";
			hook.y = 50;
		}
	}

	// Wyświetlanie efektu napisu po wyłowieniu
	if (catchEffectTimer > 0) {
		ctx.fillStyle = "white";
		ctx.font = "bold 20px Arial";
		ctx.fillText(catchEffectMsg, canvas.width / 2 - 50, 80);
		catchEffectTimer--;
	}

	// Ryby
	fishes.forEach((fish) => {
		if (hook.caughtFish !== fish) {
			fish.x += fish.speed;
			if (fish.x > canvas.width + 20) fish.x = -20;
			if (fish.x < -20) fish.x = canvas.width + 20;
			ctx.font = "24px Arial";
			ctx.fillText(fish.emoji, fish.x, fish.y);
			if (
				(hook.state === "dropping" || hook.state === "retracting") &&
				Math.abs(hook.x - fish.x) < 25 &&
				Math.abs(hook.y - fish.y) < 25
			) {
				hook.state = "caught";
				hook.caughtFish = fish;
			}
		} else {
			ctx.fillText("🐟", hook.x - 12, hook.y + 25);
			fish.x = hook.x;
			fish.y = hook.y + 20;
		}
	});
	requestAnimationFrame(gameLoop);
}
gameLoop();
