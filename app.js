let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let plan = JSON.parse(localStorage.getItem("plan")) || {};

// ================= NAV =================
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  if (tab === "shopping") renderShopping();
  if (tab === "planner") renderPlanner();
  if (tab === "recipes") renderRecipes();
}

// ================= INIT =================
renderPlanner();
renderRecipes();

// ================= PLANNER =================
function renderPlanner() {
  const grid = document.getElementById("weekGrid");
  grid.innerHTML = "";

  const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  days.forEach(day => {
    const div = document.createElement("div");
    div.className = "day";

    div.innerHTML = `
      <strong>${day}</strong>
      <div class="slot" data-day="${day}-comida">🍽 Comida</div>
      <div class="slot" data-day="${day}-cena">🌙 Cena</div>
    `;

    grid.appendChild(div);
  });

  enableDrop();
}

function enableDrop() {
  document.querySelectorAll(".slot").forEach(slot => {

    slot.ondragover = e => e.preventDefault();

    slot.ondrop = e => {
      e.preventDefault();

      const recipe = JSON.parse(e.dataTransfer.getData("text"));

      slot.innerHTML = recipe.name;

      plan[slot.dataset.day] = recipe;

      save();
    };

    const saved = plan[slot.dataset.day];
    if (saved) slot.innerHTML = saved.name;
  });
}

// ================= RECIPES =================
function renderRecipes() {
  const list = document.getElementById("recipeList");
  const view = document.getElementById("recipesView");

  list.innerHTML = "";
  view.innerHTML = "";

  recipes.forEach((r, i) => {

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;

    card.textContent = r.name;

    card.ondragstart = e => {
      e.dataTransfer.setData("text", JSON.stringify(r));
    };

    list.appendChild(card);

    const full = document.createElement("div");
    full.className = "card";

    full.innerHTML = `
      <strong>${r.name}</strong><br/>
      ${r.category}<br/>
      <small>${r.ingredients.join(", ")}</small>
    `;

    view.appendChild(full);
  });
}

// ================= ADD RECIPE =================
function addRecipe() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const ingredients = document.getElementById("ingredients").value.split("\n");

  recipes.push({ name, category, ingredients });

  save();
  renderRecipes();
}

// ================= SHOPPING LIST =================
function renderShopping() {
  const container = document.getElementById("shoppingList");

  let items = {};

  Object.values(plan).forEach(r => {
    if (!r || !r.ingredients) return;

    r.ingredients.forEach(i => {
      const key = i.trim().toLowerCase();
      if (!key) return;
      items[key] = (items[key] || 0) + 1;
    });
  });

  container.innerHTML = "";

  Object.keys(items).forEach(i => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <input type="checkbox"/>
      <span>${i}</span>
    `;

    container.appendChild(div);
  });
}

// ================= STORAGE =================
function save() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("plan", JSON.stringify(plan));
}
