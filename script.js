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

function generateMealPlan(age, protein, carbs, fat, isDiabetic, bloodPressure) {
    const ageFactor = age < 30 ? 'young' : age < 50 ? 'middle-aged' : 'senior';

    const meals = {
        young: [
            "Smoothie with banana, whey protein, and almond milk",
            "Grilled chicken with quinoa and veggies",
            "Salmon with brown rice and asparagus",
            "Greek yogurt with nuts and honey"
        ],
        "middle-aged": [
            "Oatmeal with berries and flaxseeds",
            "Turkey sandwich with whole-grain bread",
            "Grilled fish with steamed broccoli",
            "Cottage cheese with almonds"
        ],
        senior: [
            "Scrambled eggs with avocado toast",
            "Lentil soup with whole wheat bread",
            "Baked cod with spinach and quinoa",
            "Soft fruits and yogurt"
        ]
    };

    const images = {
        young: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b1a3",
            "https://images.unsplash.com/photo-1624290524426-8a4e9e5d73eb",
            "https://images.unsplash.com/photo-1495521821757-a1efb6729352"
        ],
        "middle-aged": [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1560717848-2c764b0c0fd5",
            "https://images.unsplash.com/photo-1599392184290-9b8e5f4835ce",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        ],
        senior: [
            "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
            "https://images.unsplash.com/photo-1611339555312-e607c8356fd7",
            "https://images.unsplash.com/photo-1599392184290-9b8e5f4835ce",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        ]
    };

    return {
        breakfast: { text: meals[ageFactor][0], image: images[ageFactor][0] },
        lunch: { text: meals[ageFactor][1], image: images[ageFactor][1] },
        dinner: { text: meals[ageFactor][2], image: images[ageFactor][2] },
        snacks: { text: meals[ageFactor][3], image: images[ageFactor][3] }
    };
}
