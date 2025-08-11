function showMenu(menuId, element) {
  document
    .querySelectorAll("section")
    .forEach((el) => el.classList.remove("show"));
  document.getElementById(menuId).classList.add("show");
  document
    .querySelectorAll(".navbar .nav-item")
    .forEach((btn) => btn.classList.remove("active"));
  element.classList.add("active");
}

const checkboxList = document.querySelectorAll(".checkbox");
let xp = 0;
let level = 1;

const xpBar = document.getElementById("xpBar");
const levelDisplay = document.querySelectorAll("#level");

function xpRequired(level) {
  return 50 * level;
}

function updateXPBar() {
  let neededXP = xpRequired(level);
  let percent = (xp / neededXP) * 100;
  xpBar.style.width = `${Math.min(percent, 100)}%`;
}

function updateLevel() {
  let neededXP = xpRequired(level);

  while (xp >= neededXP) {
    xp -= neededXP;
    level++;
    neededXP = xpRequired(level);
  }

  applyLevelTheme(level);

  levelDisplay.forEach((levelValue) => {
    levelValue.textContent = level;
  });
}

checkboxList.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      xp += 25;
    } else {
      xp -= 25;
      if (xp < 0) xp = 0;
    }
    updateLevel();
    updateXPBar();
  });
});

const questList = document.querySelectorAll(".skill-item");

questList.forEach((quest) => {
  quest.addEventListener("click", () => {
    const navbar = document.querySelector(".navbar");
    const headerContent = document.querySelector(".quests .header-content");
    const questsBox = document.querySelector(".quests .quests-box");
    const mainstr = document.querySelector(".main-str");
    const mainint = document.querySelector(".main-int");
    const mainatt = document.querySelector(".main-att");
    const mainsoc = document.querySelector(".main-soc");
    const mainpersonal = document.querySelector(".main-personal");

    mainstr.style.display = "none";
    mainint.style.display = "none";
    mainatt.style.display = "none";
    mainsoc.style.display = "none";
    mainpersonal.style.display = "none";

    switch (quest.id) {
      case "strenght":
        mainstr.style.display = "flex";
        break;
      case "intelligence":
        mainint.style.display = "flex";
        break;
      case "attitude":
        mainatt.style.display = "flex";
        break;
      case "social":
        mainsoc.style.display = "flex";
        break;
      case "personal":
        mainpersonal.style.display = "block";
        break;
    }

    navbar.style.display = "none";
    headerContent.style.display = "none";
    questsBox.style.display = "none";

    const backBtn = document.getElementById("backBtn");

    backBtn.classList.remove("fa-fire-flame-curved", "fire");
    backBtn.classList.add("fa-rotate-left", "return");

    backBtn.addEventListener("click", () => {
      mainstr.style.display = "none";
      mainint.style.display = "none";
      mainatt.style.display = "none";
      mainsoc.style.display = "none";
      mainpersonal.style.display = "none";

      navbar.style.display = "flex";
      headerContent.style.display = "block";
      questsBox.style.display = "block";

      backBtn.classList.add("fa-fire-flame-curved", "fire");
      backBtn.classList.remove("fa-rotate-left", "return");
    });
  });
});

const addQuests = document.getElementById("addQuests");
const cancelQuests = document.getElementById("cancel");

const addTask = document.getElementById("add-task");

addQuests.addEventListener("click", () => {
  const conQuest = document.querySelector(".add-quests-con");

  cancelQuests.addEventListener("click", () => {
    conQuest.style.display = "none";
  });
  conQuest.style.display = "flex";
});

const totalQuests = document.getElementById("totalQuests");

function updateTotalQuests(change) {
  let current = parseInt(totalQuests.textContent);
  totalQuests.textContent = current + change;
}
addTask.addEventListener("click", (e) => {
  e.preventDefault();
  const titleInput = document.querySelector(".task-title").value.trim();
  const descriptionInput = document
    .querySelector(".task-description")
    .value.trim();

  if (titleInput === "") {
    document.querySelector(".add-quests-con").style.display = "none";
    return;
  }

  const conPersonal = document.querySelector(".main-personal .main-content");

  const newItem = document.createElement("div");
  newItem.classList.add("item");
  newItem.innerHTML = `<div class="text">
                    <h4 class="header" id="title">${titleInput}</h4>
                    <p class="description" id="description">
                      ${descriptionInput}
                    </p>
                  </div>
                  <button class="done">Done</button>`;

  newItem.querySelector(".done").addEventListener("click", () => {
    newItem.remove();
    updateTotalQuests(-1);
    xp += 25;
    updateLevel();
    updateXPBar();
  });

  conPersonal.appendChild(newItem);

  updateTotalQuests(1);

  document.querySelector(".task-title").value = "";
  document.querySelector(".task-description").value = "";

  document.querySelector(".add-quests-con").style.display = "none";

  const totalTasks = newItem.length;
  console.log(totalTasks);
});

const doneBtn = document.querySelectorAll(".done");

doneBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".item");
    if (item) {
      item.remove();
    }
    xp += 25;
    updateLevel();
    updateXPBar();
  });
});

const skillData = {};

function setupSkillSystem(buttonSelector, targets) {
  const buttons = document.querySelectorAll(buttonSelector);

  targets.forEach(({ barId, levelId }) => {
    if (!skillData[barId]) {
      const xpBarSkill = document.getElementById(barId);
      const levelEls = document.getElementsByClassName(levelId);

      skillData[barId] = {
        xpSkill: 0,
        levelSkill: 1,
        xpBarSkill,
        levelEls,
      };
    }
  });

  function xpRequiredSkill(levelSkill) {
    return 50 * levelSkill;
  }

  function update(barId) {
    const data = skillData[barId];
    let { xpSkill, levelSkill, xpBarSkill, levelEls } = data;

    let neededXP = xpRequiredSkill(levelSkill);
    while (xpSkill >= neededXP) {
      xpSkill -= neededXP;
      levelSkill++;
      neededXP = xpRequiredSkill(levelSkill);
    }

    const percent = (xpSkill / neededXP) * 100;
    xpBarSkill.style.width = `${Math.min(percent, 100)}%`;

    Array.from(levelEls).forEach((el) => {
      el.textContent = levelSkill;
    });

    skillData[barId].xpSkill = xpSkill;
    skillData[barId].levelSkill = levelSkill;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      targets.forEach(({ barId }) => {
        skillData[barId].xpSkill += 25;
        update(barId);
      });
    });
  });
}

setupSkillSystem(".main-str .done", [
  { barId: "xpBarStr", levelId: "poinStr" },
  { barId: "xpBarEnd", levelId: "poinEnd" },
]);

setupSkillSystem(".main-att .done", [
  { barId: "xpBarAtt", levelId: "poinAtt" },
  { barId: "xpBarEnd", levelId: "poinEnd" },
]);

setupSkillSystem(".main-int .done", [
  { barId: "xpBarInt", levelId: "poinInt" },
  { barId: "xpBarCha", levelId: "poinCha" },
]);

setupSkillSystem(".main-soc .done", [
  { barId: "xpBarSoc", levelId: "poinSoc" },
  { barId: "xpBarCha", levelId: "poinCha" },
]);

function applyLevelTheme(level) {
  const classRank = document.querySelector(".rank-name");
  const root = document.documentElement;
  if (level >= 6) {
    classRank.textContent = "S";

    // PINK
    root.style.setProperty(
      "--color-menu-button",
      "invert(14%) sepia(96%) saturate(5000%) hue-rotate(300deg) brightness(120%) contrast(125%)"
    );
    root.style.setProperty("--color-accent", "#ff00bf");
    root.style.setProperty("--color-progress", "#ff00bf");
    root.style.setProperty("--color-box-border", "#ff00bf");
    root.style.setProperty("--color-border-skill", "#ff00bfa4");
  } else if (level >= 5) {
    classRank.textContent = "A";

    //  EMAS
    root.style.setProperty(
      "--color-menu-button",
      "invert(86%) sepia(74%) saturate(950%) hue-rotate(1deg) brightness(115%) contrast(105%)"
    );
    root.style.setProperty("--color-accent", "#ffd700");
    root.style.setProperty("--color-progress", "#ffd700");
    root.style.setProperty("--color-box-border", "#daa520");
    root.style.setProperty("--color-border-skill", "#daa520a4");
  } else if (level >= 4) {
    classRank.textContent = "B";

    // MERAH
    root.style.setProperty(
      "--color-menu-button",
      "invert(36%) sepia(98%) saturate(1800%) hue-rotate(-10deg) brightness(115%) contrast(115%)"
    );
    root.style.setProperty("--color-accent", "#ff3c00");
    root.style.setProperty("--color-progress", "#ff3c00");
    root.style.setProperty("--color-box-border", "#d32f2f");
    root.style.setProperty("--color-border-skill", "#d32f2fa4");
  } else if (level >= 3) {
    classRank.textContent = "C";

    // UNGU
    root.style.setProperty(
      "--color-menu-button",
      "invert(14%) sepia(91%) saturate(6000%) hue-rotate(276deg) brightness(110%) contrast(115%)"
    );
    root.style.setProperty("--color-accent", "#9b00e8");
    root.style.setProperty("--color-progress", "#9b00e8");
    root.style.setProperty("--color-box-border", "#8a2be2");
    root.style.setProperty("--color-border-skill", "#8a2be2a4");
  } else if (level >= 2) {
    classRank.textContent = "D";

    // BIRU
    root.style.setProperty(
      "--color-menu-button",
      "invert(46%) sepia(84%) saturate(2000%) hue-rotate(184deg) brightness(105%) contrast(102%)"
    );
    root.style.setProperty("--color-accent", "#0084ff");
    root.style.setProperty("--color-progress", "#0084ff");
    root.style.setProperty("--color-box-border", "#1e90ff");
    root.style.setProperty("--color-border-skill", "#1e4bffa4");
  } else {
    return;
  }
}
