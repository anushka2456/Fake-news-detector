document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newsTextarea = document.getElementById('news-text');
    const clearTextBtn = document.getElementById('clear-text');
    const checkBtn = document.getElementById('check-btn');
    const analysisProgress = document.getElementById('analysis-progress');
    const analysisStage = document.getElementById('analysis-stage');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressIndicator = document.getElementById('progress-indicator');
    const resultsContainer = document.getElementById('results');
    
    // Templates
    const realResultTemplate = document.getElementById('real-result-template');
    const fakeResultTemplate = document.getElementById('fake-result-template');
    
    // State
    let isChecking = false;
    
    // Analysis stages
    const stages = [
      'Parsing text...',
      'Analyzing content...',
      'Checking sources...',
      'Verifying facts...',
      'Evaluating credibility...'
    ];
    
    // Initialize
    init();
    
    function init() {
      // Event listeners
      newsTextarea.addEventListener('input', handleTextareaInput);
      clearTextBtn.addEventListener('click', handleClearText);
      checkBtn.addEventListener('click', handleCheckNews);
      
      // Initial UI state
      updateButtonState();
      clearTextBtn.style.display = 'none';
    }
    
    function handleTextareaInput() {
      updateButtonState();
      clearTextBtn.style.display = newsTextarea.value ? 'flex' : 'none';
    }
    
    function updateButtonState() {
      checkBtn.disabled = !newsTextarea.value.trim() || isChecking;
    }
    
    function handleClearText() {
      newsTextarea.value = '';
      clearTextBtn.style.display = 'none';
      resultsContainer.classList.add('hidden');
      updateButtonState();
    }
    
    function handleCheckNews() {
      if (!newsTextarea.value.trim() || isChecking) return;
      
      isChecking = true;
      updateButtonState();
      resultsContainer.classList.add('hidden');
      analysisProgress.classList.remove('hidden');
      
      // Reset progress
      let progress = 0;
      let currentStage = 0;
      progressIndicator.style.width = '0%';
      analysisStage.textContent = stages[0];
      progressPercentage.textContent = '0%';
      
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        if (progress < 100) {
          progress += 5;
          progressIndicator.style.width = `${progress}%`;
          progressPercentage.textContent = `${progress}%`;
          
          if (progress % 20 === 0 && currentStage < stages.length - 1) {
            currentStage++;
            analysisStage.textContent = stages[currentStage];
          }
        } else {
          clearInterval(progressInterval);
          completeAnalysis();
        }
      }, 75);
    }
    
    function completeAnalysis() {
      // For demo purposes, randomly determine if news is real or fake
      const isFake = Math.random() > 0.5;
      const confidenceScore = Math.floor(Math.random() * 30) + 70; // 70-99%
      
      // Show results
      showResults(isFake ? 'fake' : 'real', confidenceScore);
      
      // Reset state
      isChecking = false;
      updateButtonState();
      analysisProgress.classList.add('hidden');
    }
    
    function showResults(result, confidence) {
      // Clear previous results
      resultsContainer.innerHTML = '';
      
      // Clone appropriate template
      const template = result === 'real' ? realResultTemplate : fakeResultTemplate;
      const resultElement = document.importNode(template.content, true);
      
      // Update confidence score
      const confidenceValue = resultElement.querySelector('.confidence-value');
      const confidenceIndicator = resultElement.querySelector('.confidence-indicator');
      
      confidenceValue.textContent = `${confidence}%`;
      confidenceIndicator.style.width = `${confidence}%`;
      
      // Add to DOM
      resultsContainer.appendChild(resultElement);
      resultsContainer.classList.remove('hidden');
    }
});
