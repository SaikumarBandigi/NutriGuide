// Show welcome screen for 2 seconds, then switch to main content
window.onload = function () {
    setTimeout(function () {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('nutrition-container').style.display = 'flex';
    }, 2000);
};

// Dummy meal plan with Unsplash image URLs
function generateMealPlan(age, proteinGrams, carbsGrams, fatGrams, isDiabetic, bloodPressure) {
    return {
        breakfast: {
            text: "Oatmeal with berries and a boiled egg",
            image: "https://source.unsplash.com/600x400/?healthy-breakfast"
        },
        lunch: {
            text: "Grilled chicken with quinoa and veggies",
            image: "https://source.unsplash.com/600x400/?healthy-lunch"
        },
        dinner: {
            text: "Salmon with brown rice and steamed broccoli",
            image: "https://source.unsplash.com/600x400/?healthy-dinner"
        },
        snacks: {
            text: "Almonds and Greek yogurt",
            image: "https://source.unsplash.com/600x400/?healthy-snacks"
        }
    };
}

// Nutrition form submission
document.getElementById('nutritionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const bloodPressure = document.getElementById('bloodPressure').value;
    const planDuration = parseInt(document.getElementById('dietPlan').value);
    const isDiabetic = document.getElementById('diabetic').checked;

    if (!age || !weight || !height || !planDuration) {
        alert("Please fill in all required fields.");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let dailyCalories = Math.round(bmr * 1.55);

    if (bloodPressure === 'high') {
        dailyCalories = Math.round(dailyCalories * 0.9);
    } else if (bloodPressure === 'elevated') {
        dailyCalories = Math.round(dailyCalories * 0.95);
    }

    let carbRatio = 0.4, proteinRatio = 0.3, fatRatio = 0.3;
    if (isDiabetic || bloodPressure === 'high') {
        carbRatio = 0.3;
        proteinRatio = 0.35;
        fatRatio = 0.35;
    } else if (bloodPressure === 'elevated') {
        carbRatio = 0.35;
        proteinRatio = 0.35;
        fatRatio = 0.3;
    }

    const carbCalories = dailyCalories * carbRatio;
    const proteinCalories = dailyCalories * proteinRatio;
    const fatCalories = dailyCalories * fatRatio;

    const carbsGrams = Math.round(carbCalories / 4);
    const proteinGrams = Math.round(proteinCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    const mealPlan = generateMealPlan(age, proteinGrams, carbsGrams, fatGrams, isDiabetic, bloodPressure);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
    <h3>Your Nutrition Plan (${planDuration} Week${planDuration > 1 ? 's' : ''})</h3>
    <p><strong>BMI:</strong> ${bmi} (Normal range: 18.5-24.9)</p>
    <p><strong>Estimated Daily Calories:</strong> ${dailyCalories} kcal</p>
    <h4>Macronutrient Breakdown:</h4>
    <ul>
        <li>Carbohydrates: ${carbsGrams}g (${Math.round(carbRatio * 100)}%)</li>
        <li>Protein: ${proteinGrams}g (${Math.round(proteinRatio * 100)}%)</li>
        <li>Fat: ${fatGrams}g (${Math.round(fatRatio * 100)}%)</li>
    </ul>
    <h4>Daily Meal Plan:</h4>
    <ul>
        <li><strong>Breakfast:</strong> ${mealPlan.breakfast.text}<br>
            <img src="${mealPlan.breakfast.image}" alt="Breakfast" class="meal-image"></li>
        <li><strong>Lunch:</strong> ${mealPlan.lunch.text}<br>
            <img src="${mealPlan.lunch.image}" alt="Lunch" class="meal-image"></li>
        <li><strong>Dinner:</strong> ${mealPlan.dinner.text}<br>
            <img src="${mealPlan.dinner.image}" alt="Dinner" class="meal-image"></li>
        <li><strong>Snacks:</strong> ${mealPlan.snacks.text}<br>
            <img src="${mealPlan.snacks.image}" alt="Snacks" class="meal-image"></li>
    </ul>
  `;
});
