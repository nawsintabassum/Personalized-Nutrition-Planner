document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('nutrition-form');
  const resetBtn = document.getElementById('reset-btn');
  const printBtn = document.getElementById('print-btn');
  const resultsCard = document.getElementById('results');
  let macroChartInstance = null;

  
  loadSavedData();

  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      gender: document.getElementById('gender').value,
      age: parseFloat(document.getElementById('age').value),
      weight: parseFloat(document.getElementById('weight').value),
      height: parseFloat(document.getElementById('height').value),
      activity: parseFloat(document.getElementById('activity').value),
      goal: document.getElementById('goal').value
    };

    localStorage.setItem('nutriFitData', JSON.stringify(data));
    calculateAndRender(data);
  });

  
  resetBtn.addEventListener('click', () => {
    form.reset();
    localStorage.removeItem('nutriFitData');
    resultsCard.classList.add('hidden');
    if (macroChartInstance) {
      macroChartInstance.destroy();
    }
  });

  
  printBtn.addEventListener('click', () => {
    window.print();
  });

  function calculateAndRender({ gender, age, weight, height, activity, goal }) {
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    
    let tdee = bmr * activity;

    
    if (goal === 'lose') {
      tdee *= 0.85; // 15% deficit
    } else if (goal === 'gain') {
      tdee *= 1.15; // 15% surplus
    }

    const totalCalories = Math.round(tdee);

    
    const proteinGrams = Math.round((totalCalories * 0.30) / 4);
    const carbsGrams = Math.round((totalCalories * 0.40) / 4);
    const fatGrams = Math.round((totalCalories * 0.30) / 9);


    document.getElementById('total-calories').textContent = totalCalories.toLocaleString();
    document.getElementById('protein-val').textContent = `${proteinGrams}g`;
    document.getElementById('carbs-val').textContent = `${carbsGrams}g`;
    document.getElementById('fat-val').textContent = `${fatGrams}g`;

    document.getElementById('bfast-cal').textContent = `${Math.round(totalCalories * 0.25)} kcal`;
    document.getElementById('lunch-cal').textContent = `${Math.round(totalCalories * 0.35)} kcal`;
    document.getElementById('dinner-cal').textContent = `${Math.round(totalCalories * 0.30)} kcal`;
    document.getElementById('snack-cal').textContent = `${Math.round(totalCalories * 0.10)} kcal`;


    renderChart(proteinGrams, carbsGrams, fatGrams);

    
    resultsCard.classList.remove('hidden');
  }

  function renderChart(protein, carbs, fat) {
    const ctx = document.getElementById('macroChart').getContext('2d');

    if (macroChartInstance) {
      macroChartInstance.destroy();
    }

    macroChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Protein (g)', 'Carbohydrates (g)', 'Fats (g)'],
        datasets: [{
          data: [protein, carbs, fat],
          backgroundColor: ['#2563eb', '#d97706', '#dc2626'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  function loadSavedData() {
    const saved = localStorage.getItem('nutriFitData');
    if (saved) {
      const data = JSON.parse(saved);
      document.getElementById('gender').value = data.gender;
      document.getElementById('age').value = data.age;
      document.getElementById('weight').value = data.weight;
      document.getElementById('height').value = data.height;
      document.getElementById('activity').value = data.activity;
      document.getElementById('goal').value = data.goal;

      calculateAndRender(data);
    }
  }
});
