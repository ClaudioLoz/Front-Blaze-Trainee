export function sortArrayByName(arr = []) {
  let sortedArrays = arr.slice().sort(function (a, b) {
    let nameA = a.name ? a.name.trim().toLowerCase() : "";
    let nameB = b.name ? b.name.trim().toLowerCase() : "";
    if (nameA < nameB) //sort string ascending
      return -1;
    if (nameA > nameB)
      return 1;
    return 0; //default return value (no sorting)
  });
  return sortedArrays
}

export function sortInventories(inventories = []) {

  let copiedInventories = inventories.slice();

  let safeIndex = copiedInventories.findIndex(inventory => inventory.type === 'Storage');
  let safe = copiedInventories[safeIndex] || {};

  if (safeIndex !== -1) {
    copiedInventories.splice(safeIndex, 1);
  }

  let modiefiedCopiedInventories = copiedInventories;

  let sortedInventories = sortArrayByName(modiefiedCopiedInventories);

  if (safe.name) {
    return [safe, ...sortedInventories];
  } else {
    return [...sortedInventories]
  }

}

export const forEveryKey = (options, func) => {

  let mappedOptions = [];

  for (let key in options) {
    mappedOptions.push(func(key, options[key]))
  }

  return mappedOptions;

}

export const updateAtIndex = (list, index, value) => {

  const listCopy = [...list]

  listCopy[index] = {
    ...listCopy[index],
    ...value
  }

  // console.log(list, 'list')
  // console.log(listCopy, 'listCopy')

  return listCopy;

}

export const deleteAtIndex = (list, index) => {

  const listCopy = [...list]

  listCopy.splice(index, 1)
  return listCopy;

}

export const convertArrayToOptions = (array, labelKey = "name", idKey="id") => {
  return array.map(element => {
    return { label: element[labelKey], value: element[idKey], data: element }
  });
}

export const getIntersection = (FilterFromArr, FilterWithArr, matchingProperty) => {
	if (FilterFromArr && FilterWithArr && matchingProperty) {
		return [...FilterFromArr].filter(element1 => FilterWithArr.some(element2 => {
			return element1[matchingProperty] == element2[matchingProperty] // eslint-disable-line
		}));
	}
}