/**
 * Record an exercise result on a plain JS student object.
 *
 * @param {{ solved: string[], failed: string[] }} student 
 *        A student object with `solved` and `failed` arrays.
 * @param {{ id: string }} exercise 
 *        The exercise object with an `id` field.
 * @param {number} res 
 *        The result code: 1, 0 or -1.
 *        If res >= 0.5 it’s treated as “solved”, otherwise “failed”.
 * @returns {{ solved: string[], failed: string[] }} 
 *        The updated student object.
 */
function recordExerciseResult(student, exercise, outcome) {
    // validate inputs
    if (typeof res !== 'number' || ![1, 0, -1].includes(outcome)) {
      throw new Error('`res` must be one of 1, 0, or -1');
    }
    if (!Array.isArray(student.solved) || !Array.isArray(student.failed)) {
      throw new Error('student must have `solved` and `failed` arrays');
    }
  
    // push into the correct list
    if (outcome >= 0.5) {
      student.solved.push(exercise.id);
    } else {
      student.failed.push(exercise.id);
    }
  
    updateEloAndBKT(student, exercise, outcome)

    return student;
  }
