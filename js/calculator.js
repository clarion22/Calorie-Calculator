
function calculateBMR(weight, height, age, gender) {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculatorForm");
  const clearButton = document.getElementById("clearButton");
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");

  fetch('files/exercises.json')
        .then(response => response.json())
        .then(exercises => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight").value);
    const weightUnit = document.querySelector('input[name="weightUnit"]:checked').value;
    const height = parseFloat(document.getElementById("height").value);
    const heightUnit = document.querySelector('input[name="heightUnit"]:checked').value;
    const age = parseInt(document.getElementById("age").value, 10);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const calories = parseFloat(document.getElementById("calories").value);
    const exerciseGroup = document.getElementById("exerciseGroup").value;

    const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const heightCm = heightUnit === "inches" ? height * 2.54 : height;

    // Calculate BMR
    const bmr = calculateBMR(weightKg, heightCm, age, gender);
    const restingCaloriesPerHour = bmr / 24;

    resultsList.innerHTML = "";

    // Filter exercises by selected group and calculate required exercise time
    const filteredExercises = exercises.filter((exercise) => {
      return exerciseGroup === "all" || exercise.group === exerciseGroup;
    });

    filteredExercises.forEach((exercise) => {
      const timeInHours = calories / (exercise.met * restingCaloriesPerHour);
      const timeInMinutes = (timeInHours * 60).toFixed(0);
      const time = timeInHours.toFixed(2);

      const listItem = document.createElement("li");
      listItem.className = "flex items-center bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition duration-300";

     
      const exerciseIconContainer = document.createElement("div");
      exerciseIconContainer.className = "flex-shrink-0";

    
      exerciseIconContainer.innerHTML = `
        <!-- Exercise Icon: Running Person -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H3" />
        </svg>
      `;


      const exerciseName = document.createElement("span");
      exerciseName.className = "flex-1 text-gray-700";
      exerciseName.textContent = exercise.name;

      const timeText = document.createElement("span");
      timeText.className = "ml-2 text-lg font-bold text-blue-600";
      timeText.textContent = `${time} hrs (${timeInMinutes} mins)`;

      listItem.appendChild(exerciseIconContainer);
      listItem.appendChild(exerciseName);
      listItem.appendChild(timeText);

      resultsList.appendChild(listItem);
    });
    resultsSection.classList.remove("hidden");
  });
        }).catch(error => console.error("Error loading exercises:", error)); 

  clearButton.addEventListener("click", () => {
    form.reset();
    resultsList.innerHTML = "";
    resultsSection.classList.add("hidden");
  });
});
