// rounds and formats a given weight (but e.g. bias and every other number also
// works fine)
export function formatWeight(weight: number): string {
  let weightString: string
  if (!weight) {
    weightString = ''
  } else if (!isFinite(weight)) {
    weightString = weight.toString()
  } else {
    weightString = (weight < 0 ? '' : '+') + weight
    if (weightString.indexOf('.') != -1) {
      while (weightString.length > 7 && weightString.slice(-1) != '.') {
        weightString = weightString.slice(0, -1)
      }
      weightString = weightString.padEnd(7, '0')
    }
  }
  return weightString
}
