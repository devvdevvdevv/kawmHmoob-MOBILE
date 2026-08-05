import { Redirect } from 'expo-router'

// The /course section is RETIRED — its content moved into Learn (grammar +
// conversational lessons, readings) and Reference (grammar cheat sheet). Kept as a
// redirect so old links don't 404. See notes/2026-08-04-course-retired.
//
// Old behavior: return <Redirect href="/course/grammar" />
export default function CourseIndex() {
  return <Redirect href="/learn" />
}
