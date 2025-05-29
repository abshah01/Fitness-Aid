// script.js

let userCount = 0; // This should be saved in a database in a real app

const form = document.getElementById("fitnessForm");
const planOutput = document.getElementById("planOutput");
const exerciseSession = document.getElementById("exerciseSession");
const currentExercise = document.getElementById("currentExercise");
const nextExerciseBtn = document.getElementById("nextExercise");
const completeWorkoutBtn = document.getElementById("completeWorkout");
const alarmSound = document.getElementById("alarmSound");
const motivationSound = document.getElementById("motivationSound");

let workoutPlan = [];
let dietPlan = "";
let exerciseIndex = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  userCount++;

  const name = document.getElementById("name").value;
  const height = document.getElementById("height").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const bodyType = document.getElementById("bodyType").value;
  const goal = document.getElementById("goal").value;
  const alarmTime = document.getElementById("alarmTime").value;

  const userId = String(userCount).padStart(4, '0');

  ({ workoutPlan, dietPlan } = generatePlans(bodyType, goal, weight));

  setAlarm(alarmTime);
  showPlan(userId, workoutPlan, dietPlan);
});

function generatePlans(bodyType, goal, weight) {
  let plan = [];
  let diet = "";

  if (bodyType === "chubby") {
    if (goal === "fit") {
      plan = ["Jumping Jacks (2 min)", "Push-ups (10 reps)", "Plank (30 sec)", "Jog in place (2 min)"];
      diet = "Low carb, high protein, vegetables, and fruits. Avoid sugar and processed food.";
    } else if (goal === "sixpack") {
      plan = ["Mountain Climbers (1 min)", "Crunches (20 reps)", "Leg Raises (15 reps)", "HIIT (5 min)"];
      diet = "Very low fat, high protein, lean meat, egg whites, oats, green tea.";
    } else {
      plan = ["Burpees (10 reps)", "Push-ups (15 reps)", "Bodyweight Squats (20 reps)", "Plank (45 sec)"];
      diet = "Balanced protein and carbs, peanut butter, boiled eggs, oats, banana shakes.";
    }
  } else if (bodyType === "slim") {
    if (goal === "fit") {
      plan = ["Squats (20 reps)", "Push-ups (10 reps)", "Jog in place (3 min)", "Arm Circles (1 min)"];
      diet = "Calorie-rich diet: potatoes, rice, eggs, peanut butter, and fruits.";
    } else if (goal === "sixpack") {
      plan = ["Crunches (25 reps)", "Leg Raises (20 reps)", "Plank (1 min)", "Jumping Jacks (2 min)"];
      diet = "Lean protein, complex carbs, green vegetables, lots of water.";
    } else {
      plan = ["Push-ups (15 reps)", "Pull-ups (if available)", "Bodyweight Squats (30 reps)", "Lunges (15 per leg)"];
      diet = "Protein shakes, meat, eggs, dairy, rice, and high-calorie snacks.";
    }
  } else {
    // bulk
    if (goal === "fit") {
      plan = ["Jog in place (5 min)", "Push-ups (20 reps)", "Stretching (5 min)", "Squats (20 reps)"];
      diet = "Reduce carbs slightly, add greens, light dinner, more protein.";
    } else if (goal === "sixpack") {
      plan = ["Crunches (30 reps)", "Russian Twists (40 reps)", "Leg Raises (20 reps)", "HIIT (5 min)"];
      diet = "Strict lean protein only, green vegetables, no fried food, avoid snacks.";
    } else {
      plan = ["Push-ups (25 reps)", "Bodyweight Dips (15 reps)", "Lunges (20 reps)", "Burpees (10 reps)"];
      diet = "Protein and calorie-rich meals, eggs, beef, oats, shakes.";
    }
  }

  return { workoutPlan: plan, dietPlan: diet };
}

function showPlan(userId, plan, diet) {
  const planHtml = `
    👤 User ID: ${userId}<br>
    📋 <b>Your Workout Plan:</b><br>${plan.map((e, i) => `#${i + 1} ${e}`).join('<br>')}<br><br>
    🥗 <b>Your Diet Plan:</b><br>${diet}<br><br>
    <button onclick="startExerciseSession()">Start Session</button>
  `;
  planOutput.innerHTML = planHtml;
  planOutput.classList.remove("hidden");
  planOutput.classList.add("show");
}

function setAlarm(timeStr) {
  const now = new Date();
  const [hour, minute] = timeStr.split(":").map(Number);
  const alarmTime = new Date();
  alarmTime.setHours(hour, minute, 0, 0);

  if (alarmTime < now) alarmTime.setDate(alarmTime.getDate() + 1);

  const timeout = alarmTime - now;
  setTimeout(() => {
    alarmSound.play();
    alert("⏰ It's time for your workout! Let's go!");
  }, timeout);
}

function startExerciseSession() {
  planOutput.classList.add("hidden");
  exerciseSession.classList.remove("hidden");
  exerciseIndex = 0;
  showCurrentExercise();
}

function showCurrentExercise() {
  if (exerciseIndex >= workoutPlan.length) {
    completeWorkout();
    return;
  }
  const exercise = workoutPlan[exerciseIndex];
  currentExercise.innerHTML = `👉 ${exercise}`;
  motivationSound.play();
}

nextExerciseBtn.addEventListener("click", () => {
  exerciseIndex++;
  showCurrentExercise();
});

completeWorkoutBtn.addEventListener("click", () => {
  completeWorkout();
});

function completeWorkout() {
  currentExercise.innerHTML = "🎉 Workout complete! Great job, champ! Keep it up tomorrow!";
  motivationSound.play();
  nextExerciseBtn.style.display = "none";
  completeWorkoutBtn.style.display = "none";
}
