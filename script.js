const modal = document.getElementById('demoModal');
const openButtons = [document.getElementById('openDemoTop'), document.getElementById('openDemoHero'), document.getElementById('openDemoFamily')];
const closeButton = document.getElementById('closeDemo');
const inputStep = document.getElementById('demoInput');
const feedbackStep = document.getElementById('demoFeedback');
const analyzeButton = document.getElementById('analyzeEssay');
const resetButton = document.getElementById('resetDemo');
const text = document.getElementById('essayText');
const scoreValue = document.getElementById('scoreValue');
const scoreRing = document.getElementById('scoreRing');
const strengthText = document.getElementById('strengthText');
const focusText = document.getElementById('focusText');

function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); text.focus(); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
openButtons.forEach(btn => btn && btn.addEventListener('click', openModal));
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key === 'Escape') closeModal(); });

analyzeButton.addEventListener('click', ()=>{
  const value = text.value.trim();
  const wordCount = value ? value.split(/\s+/).length : 0;
  const hasExample = /for example|for instance|because|such as/i.test(value);
  const hasLink = /therefore|this shows|as a result|this means/i.test(value);
  let score = 57 + Math.min(15, Math.floor(wordCount / 9));
  if(hasExample) score += 5;
  if(hasLink) score += 4;
  score = Math.max(48, Math.min(78, score));
  scoreValue.textContent = score + '%';
  scoreRing.textContent = score;
  strengthText.textContent = wordCount > 45 ? 'You have developed a clear idea with enough detail to build on.' : 'Your main idea is relevant and gives you a clear starting point.';
  focusText.textContent = hasExample && hasLink ? 'Strengthen your ending by linking your final point back to the question.' : 'Add one specific example, then explain how that example proves your main point.';
  inputStep.classList.add('hidden'); feedbackStep.classList.remove('hidden');
});
resetButton.addEventListener('click', ()=>{ feedbackStep.classList.add('hidden'); inputStep.classList.remove('hidden'); text.focus(); });

