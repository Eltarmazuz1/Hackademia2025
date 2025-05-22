/**
 * Updates the Elo rating and Bayesian Knowledge Tracing (BKT) estimate of a student for a given exercise.
 *
 * @param {Object} student - A student object with `elos` and `knowledge` fields.
 * @param {Object} exercise - An exercise object with an `elo` number and a `category` string.
 * @param {number} outcome - The result of the exercise attempt from the student's perspective: 1 (win), 0 (draw), or -1 (loss).
 * @returns {Object} Updated Elo ratings and knowledge estimate for the student and exercise.
 * @throws {Error} If inputs are not valid or the outcome is not one of the allowed values.
 */
function updateEloAndBKT(student, exercise, outcome) {
    const K = 32;
  
    if (
      typeof student !== 'object' ||
      typeof student.elos !== 'object' ||
      typeof student.knowledge !== 'object' ||
      typeof exercise !== 'object' ||
      typeof exercise.elo !== 'number' ||
      typeof exercise.category !== 'string' ||
      ![-1, 0, 1].includes(outcome)
    ) {
      throw new Error('Invalid input data.');
    }
  
    const category = exercise.category;
  
    if (typeof student.elos[category] !== 'number') {
      throw new Error(`Missing Elo for category '${category}' in student.`);
    }
  
    if (typeof student.knowledge[category] !== 'number') {
      student.knowledge[category] = 0.0; // Initialize BKT estimate if not present
    }
  
    const studentRating = student.elos[category];
    const exerciseRating = exercise.elo;
  
    const expectedStudent = 1 / (1 + Math.pow(10, (exerciseRating - studentRating) / 400));
    const expectedExercise = 1 - expectedStudent;
  
    const actualStudent = (outcome + 1)/2; // Maps outcome as 1 -> 1, 0 -> 0.5, 0 -> 0
    const actualExercise = 1 - actualStudent;
  
    // Update Elo
    student.elos[category] = Math.round(studentRating + K * (actualStudent - expectedStudent));
    // Optionally update exercise elo using: exercise.elo = Math.round(exerciseRating + K * (actualExercise - expectedExercise));
  
    // Update BKT
    const pTransit = expectedStudent; // Probability of skill acquisition using Elo expectation
    const pKnown = student.knowledge[category];
    const correct = actualStudent === 1;
  
    // Simple BKT update assuming slip = 0.1, guess = 0.2
    const slip = 0.1;
    const guess = 0.2;
  
    const pCorrectGivenKnown = correct ? 1 - slip : slip;
    const pCorrectGivenUnknown = correct ? guess : 1 - guess;
  
    const numerator = pKnown * pCorrectGivenKnown;
    const denominator = numerator + (1 - pKnown) * pCorrectGivenUnknown;
    let updatedKnowledge = numerator / denominator;
  
    // Apply transition
    updatedKnowledge = updatedKnowledge + (1 - updatedKnowledge) * pTransit;
  
    student.knowledge[category] = updatedKnowledge;
  
    return {
      updatedStudentElo: student.elos[category],
      // Optionally return updated exercise elo: updatedExerciseElo: exercise.elo,
      updatedKnowledge: updatedKnowledge
    };
  }
  
/**
 * Chooses an exercise that neither student has solved and is closest in Elo to the average Elo of the students.
 * Alternatively, it could pick something in the lower/higher range of elos of students.
 * 
 * @param {Array} students - A list of 1 or 2 student objects. Each student has `elos` (Elo ratings) and `solved` (list of solved exercise ids).
 * @param {string} category - The category for which the exercise is chosen.
 * @param {Array} exercises - A list of exercise objects, each with an `id`, `category`, and `elo` field.
 * @returns {Object} The chosen exercise object.
 * @throws {Error} If students or exercises are not valid.
 */
function chooseExercise(students, category, exercises) {
    // Check if the input is valid
    if (!Array.isArray(students) || students.length < 1 || students.length > 2) {
      throw new Error('The students input should be an array of 1 or 2 students.');
    }
  
    if (!Array.isArray(exercises)) {
      throw new Error('The exercises input should be an array of exercises.');
    }
  
    if (typeof category !== 'string') {
      throw new Error('The category input should be a string.');
    }
  
    // Calculate the average Elo of the students in the given category
    const totalElo = students.reduce((sum, student) => {
      if (typeof student.elos[category] === 'number') {
        return sum + student.elos[category];
      }
      throw new Error(`Student does not have Elo for category '${category}'.`);
    }, 0);
  
    const averageElo = totalElo / students.length;
  
    // Filter exercises that neither student has solved and are in the specified category
    const unsolvedExercises = exercises.filter(exercise => {
      return exercise.category === category && 
             !students.some(student => student.solved.includes(exercise.id));
    });
  
    if (unsolvedExercises.length === 0) {
      throw new Error('No unsolved exercises found in the specified category.');
    }
  
    // Sort the unsolved exercises by the closest Elo to the average Elo
    const closestExercise = unsolvedExercises.reduce((closest, exercise) => {
      const eloDifference = Math.abs(exercise.elo - averageElo);
      if (!closest || eloDifference < closest.eloDifference) {
        return {
          exercise: exercise,
          eloDifference: eloDifference
        };
      }
      return closest;
    }, null);
  
    return closestExercise.exercise;
  }
  
/**
 * Lazily yields one pair of students at a time according to high↔low quartile matching.
 * Maintains internal state (original list, sorted list, and quartile bins) so sorting/binning is done only once.
 * On each iteration, removes paired students from all structures. If one student remains, yields them as leftover.
 *
 * @param {string} category          - Score category to use for ranking.
 * @param {Array}  students          - Array of student objects with `{ id, scores: { [category]: number } }`.
 * @yields {{ pair: [Object,Object] } | { leftover: Object }}
 */
function* pairByQuartileStream(category, students) {
    // Clone arrays to avoid mutating original inputs
    const list = students.slice();
    const sorted = list.slice().sort((a, b) => b.scores[category] - a.scores[category]);
    const n = sorted.length;
    const t1 = Math.floor(n * 0.25);
    const t2 = Math.floor(n * 0.5);
    const t3 = Math.floor(n * 0.75);
  
    // Initialize bins 0..3 (0=top, 3=bottom)
    const bins = [[], [], [], []];
    sorted.forEach((stu, idx) => {
      let bin = idx < t1 ? 0 : idx < t2 ? 1 : idx < t3 ? 2 : 3;
      bins[bin].push(stu);
    });
  
    while (list.length > 1) {
      // Take the first student in arrival order
      const first = list.shift();
  
      // Find which bin the first student is in
      let firstBin = bins.findIndex(bin => bin.some(s => s.id === first.id));
      if (firstBin < 0) firstBin = 3; // fallback if missing
  
      // Remove first from its bin
      bins[firstBin] = bins[firstBin].filter(s => s.id !== first.id);
  
      // Choose complementary bin (high↔low)
      const desiredBin = 3 - firstBin;
      let partnerPool = bins[desiredBin];
  
      // Fallback: if desired bin empty, flatten all bins
      if (partnerPool.length === 0) {
        partnerPool = bins.flat();
      }
  
      // Exclude the first student himself just in case
      partnerPool = partnerPool.filter(s => s.id !== first.id);
  
      // Random partner selection
      const randIdx = Math.floor(Math.random() * partnerPool.length);
      const partner = partnerPool[randIdx];
  
      // Remove partner from main list and its bin
      const idxInList = list.findIndex(s => s.id === partner.id);
      if (idxInList >= 0) list.splice(idxInList, 1);
      const partnerBin = bins.findIndex(bin => bin.some(s => s.id === partner.id));
      if (partnerBin >= 0) bins[partnerBin] = bins[partnerBin].filter(s => s.id !== partner.id);
  
      // Yield the matched pair
      yield { pair: [first, partner] };
    }
  
    // If one student remains, yield as leftover
    if (list.length === 1) {
      yield { leftover: list[0] };
    }
  }
  

/*  
// ----------------------
// Inline tests for all functions (no Jest required)
// Append this to the bottom of your file (after the function definitions)

function assert(condition, message) {
  if (!condition) throw new Error('Test failed: ' + message);
  console.log('✅', message);
}

// --- Tests for updateEloAndBKT ---
(() => {
  console.log('\nRunning updateEloAndBKT tests...');
  let student = { elos: { math: 1200 }, knowledge: {} };
  let exercise = { elo: 1300, category: 'math' };

  // Win
  student = { elos: { math: 1200 }, knowledge: { math: 0.999} };
  exercise = { elo: 1300, category: 'math' };
  let result = updateEloAndBKT(student, exercise, 1);
  assert(result.updatedStudentElo > 1200, 'Elo increases on win');
  assert(typeof result.updatedKnowledge === 'number', 'Knowledge is updated on win');
  console.log("Updated knowledge:" + result.updatedKnowledge)

  // Draw
  student = { elos: { math: 1200 }, knowledge: {} };
  exercise = { elo: 1200, category: 'math' };
  result = updateEloAndBKT(student, exercise, 0);
  assert(Math.abs(result.updatedStudentElo - 1200) <= 1, 'Elo changes minimally on draw');

  // Loss
  student = { elos: { math: 1200 }, knowledge: {} };
  exercise = { elo: 1100, category: 'math' };
  result = updateEloAndBKT(student, exercise, -1);
  assert(result.updatedStudentElo < 1200, 'Elo decreases on loss');

  // Invalid outcome
  let errorCaught = false;
  try { updateEloAndBKT(student, exercise, 2); } catch (e) { errorCaught = true; }
  assert(errorCaught, 'Throws on invalid outcome');

  // Missing category
  student = { elos: {}, knowledge: {} };
  errorCaught = false;
  try { updateEloAndBKT(student, exercise, 1); } catch (e) { errorCaught = true; }
  assert(errorCaught, 'Throws when student missing category Elo');
})();

// --- Tests for chooseExercise ---
(() => {
  console.log('\nRunning chooseExercise tests...');
  const exercises = [
    { id: 1, category: 'math', elo: 1100 },
    { id: 2, category: 'math', elo: 1300 },
    { id: 3, category: 'science', elo: 1200 }
  ];
  let chosen;

  // Single student
  const s1 = { elos: { math: 1250 }, solved: [] };
  chosen = chooseExercise([s1], 'math', exercises);
  assert(chosen.id === 2, 'Picks closest exercise for single student');

  // Filters solved
  const s2 = { elos: { math: 1250 }, solved: [2] };
  chosen = chooseExercise([s2], 'math', exercises);
  assert(chosen.id === 1, 'Excludes solved exercises');

  // Two students
  const sa = { elos: { math: 1200 }, solved: [] };
  const sb = { elos: { math: 1300 }, solved: [] };
  chosen = chooseExercise([sa, sb], 'math', exercises);
  assert(chosen.id === 2, 'Uses average Elo for two students');

  // No exercises left
  const sc = { elos: { math: 1200 }, solved: [1,2] };
  let threw = false;
  try { chooseExercise([sc], 'math', exercises); } catch (e) { threw = true; }
  assert(threw, 'Throws when no unsolved exercises');
})();

// --- Tests for pairByQuartileStream ---
(() => {
  console.log('\nRunning pairByQuartileStream tests...');
  function make(id, score) { return { id, scores: { math: score } }; }

  // Odd count -> one pair + leftover
  const oddList = [ make('a',100), make('b',200), make('c',300) ];
  const gen1 = pairByQuartileStream('math', oddList);
  const out1 = gen1.next().value;
  assert(out1.pair.length === 2, 'Yields one pair for odd list');
  const out2 = gen1.next().value;
  assert(out2.leftover && out2.leftover.id, 'Yields leftover');

  // High↔Low pairing
  const evenList = [ make('low',50), make('mid1',150), make('mid2',200), make('high',300) ];
  const gen2 = pairByQuartileStream('math', evenList);
  const firstPair = gen2.next().value.pair;
  const ids = firstPair.map(s => s.id);
  assert(ids.includes('low') && ids.includes('high'), 'Pairs highest with lowest');
})();
 */