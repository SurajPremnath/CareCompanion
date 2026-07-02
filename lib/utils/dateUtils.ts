// ==========================================================
// CareVR
// Date Utilities
// ==========================================================

export function calculateAge(
  dateOfBirth: string | null
): number | null {

  if (!dateOfBirth) {

    return null;

  }

  const dob = new Date(dateOfBirth);

  const today = new Date();

  let age =
    today.getFullYear() -
    dob.getFullYear();

  const monthDifference =
    today.getMonth() -
    dob.getMonth();

  if (

    monthDifference < 0 ||

    (
      monthDifference === 0 &&
      today.getDate() < dob.getDate()
    )

  ) {

    age--;

  }

  return age;

}