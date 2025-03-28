
const handleClick = (ramen) => {
  document.querySelector(".detail-image").src = ramen.image;
  document.querySelector(".detail-image").alt = ramen.name;
  document.querySelector(".detail-image").dataset.id = ramen.id;
  document.querySelector(".name").textContent = ramen.name;
  document.querySelector(".restaurant").textContent = ramen.restaurant;
  document.querySelector("#rating-display").textContent = ramen.rating;
  document.querySelector("#comment-display").textContent = ramen.comment;


  const existingDeleteBtn = document.querySelector("#delete-btn");
  if (existingDeleteBtn) existingDeleteBtn.remove();
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.id = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteRamen(ramen.id));

  document.querySelector("#ramen-detail").appendChild(deleteBtn);
};
const addRamenToMenu = (ramen) => {
  const menu = document.querySelector("#ramen-menu");
  const img = document.createElement("img");

  img.src = ramen.image;
  img.alt = ramen.name;
  img.addEventListener("click", () => handleClick(ramen));

  menu.appendChild(img);
};

const displayRamens = () => {
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((ramens) => {
      ramens.forEach(addRamenToMenu);
      if (ramens.length > 0) handleClick(ramens[0]);
    })
    .catch((error) => console.error("Error fetching ramens:", error));
};


const addSubmitListener = () => {
  document.querySelector("#new-ramen").addEventListener("submit", (event) => {
    event.preventDefault();

    const newRamen = {
      name: event.target["new-name"].value,
      restaurant: event.target["new-restaurant"].value,
      image: event.target["new-image"].value,
      rating: event.target["new-rating"].value,
      comment: event.target["new-comment"].value,
    };

    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRamen),
    })
      .then((response) => response.json())
      .then(addRamenToMenu)
      .catch((error) => console.error("Error adding ramen:", error));

    event.target.reset();
  });
};


const updateRamen = () => {
  document.querySelector("#edit-ramen").addEventListener("submit", (event) => {
    event.preventDefault();

    const id = document.querySelector(".detail-image").dataset.id;
    if (!id) return;

    const updatedData = {
      rating: event.target["edit-rating"].value,
      comment: event.target["edit-comment"].value,
    };

    fetch(`http://localhost:3000/ramens/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((updatedRamen) => {
        document.querySelector("#rating-display").textContent = updatedRamen.rating;
        document.querySelector("#comment-display").textContent = updatedRamen.comment;
      })
      .catch((error) => console.error("Error updating ramen:", error));
  });
};

const deleteRamen = (id) => {
  fetch(`http://localhost:3000/ramens/${id}`, { method: "DELETE" })
    .then(() => {
      document.querySelector(`#ramen-menu img[alt="${document.querySelector(".detail-image").alt}"]`).remove();
      document.querySelector("#ramen-detail").innerHTML = "<p>Select a ramen to view details</p>";
    })
    .catch((error) => console.error("Error deleting ramen:", error));
};


const main = () => {
  displayRamens();
  addSubmitListener();
  updateRamen();
};

main();

